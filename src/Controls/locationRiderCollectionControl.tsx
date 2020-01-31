import { EnterLocationControl, ISearchResult, ISearchParam } from "./enterLocationControl";
import * as React from "react";
import { LocationRiderControl, ILocationRider } from "./locationRiderControl";
import deepEqual from 'deep-equal';
import { Guid } from "guid-typescript";
import Enumerable from "linq";

export interface ILocationRiderCollectionControlProps{
handleLocationRidersChanged:(locationRiders:ILocationRider[])=>void;
LocationRiders?:ILocationRider[];
CollectionKey:string;
}
export interface ILocationRiderCollectionControlState{
  LocationRiders:ILocationRider[];
  NumRiders:number;
}
export class LocationRiderCollectionControl extends React.Component<ILocationRiderCollectionControlProps, ILocationRiderCollectionControlState> {
  constructor(props: Readonly<ILocationRiderCollectionControlProps>) {
    super(props);
    this.state = { LocationRiders: new Array(), NumRiders:0 };
    this.handleLocationRiderChanged = this.handleLocationRiderChanged.bind(this);
    this.handleSubmitRider = this.handleSubmitRider.bind(this);
    this.resetRidersFromProps();
  }
  resetRidersFromProps(){
    if(this.props.LocationRiders){
      this.setState({LocationRiders:this.props.LocationRiders});
    }
  }
  componentDidUpdate(prevProps:ILocationRiderCollectionControlProps){
    if(!deepEqual(prevProps.LocationRiders, this.props.LocationRiders)){
      this.resetRidersFromProps();
    }
  }
  handleLocationRiderChanged(locationRider: ILocationRider, index:number){
    var locationRiders = this.state.LocationRiders;
    locationRiders[index] = locationRider;
  this.resetLocationRiders(locationRiders);
  }
handleSubmitRider(locationRider: ILocationRider){
  var locationRiders = this.state.LocationRiders;
  locationRiders.push(locationRider);
  this.resetLocationRiders(locationRiders);
}
resetLocationRiders(locationRiders:ILocationRider[]){
  this.setState({LocationRiders:locationRiders, NumRiders:Enumerable.from(locationRiders).sum(i=>i.NumRiders!)}, ()=> this.props.handleLocationRidersChanged(this.state.LocationRiders));

}
  render() {
    let blankitem = (
      <LocationRiderControl key={this.props.CollectionKey+ (this.state.LocationRiders.length==0? "-1".toString():this.state.LocationRiders.length.toString())}
      submitLocationRider={(e)=>this.handleSubmitRider(e)}
     />
  );
    const items = new Array();
    var itemMap = this.state.LocationRiders.map((locationRider, index)=>
    <LocationRiderControl key={this.props.CollectionKey+index.toString()} NumRiders={locationRider.NumRiders} SearchResult={locationRider.SearchResult} Coords={locationRider.Coords}
        submitLocationRider={(e)=>this.handleSubmitRider(e)} handleLocationRiderChanged={e=>this.handleLocationRiderChanged(e, index)}
    />);
    
    itemMap.push(blankitem);
    return <div>Total Riders:{this.state.NumRiders}<ol>{itemMap}</ol></div>;
  }
}
