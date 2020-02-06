import { EnterLocationControl, ISearchResult, ISearchParam } from "./enterLocationControl";
import * as React from "react";
import { LocationRiderControl, ILocationRider } from "./locationRiderControl";
import deepEqual from 'deep-equal';
import { Guid } from "guid-typescript";
import Enumerable from "linq";
import update from 'immutability-helper';
export interface ILocationRiderCollectionControlProps{
handleLocationRidersChanged:(locationRiders:ILocationRider[])=>void;
LocationRiders?:ILocationRider[];
CollectionKey:string;
}
export interface ILocationRiderCollectionControlState{
  LocationRiders:ILocationRider[];
  NumRiders:number;
}
export class IdGenerator {
    private id=0;
    constructor(private prefix:string){

    }
    NewId(): string {
        this.id = this.id + 1;
        return this.prefix+ this.id.toString();
    }
}
export class LocationRiderCollectionControl extends React.Component<ILocationRiderCollectionControlProps, ILocationRiderCollectionControlState> {
    private idGen:IdGenerator;

    constructor(props: Readonly<ILocationRiderCollectionControlProps>) {
        super(props);
        this.state = { LocationRiders: new Array(), NumRiders: 0 };
        this.handleLocationRiderChanged = this.handleLocationRiderChanged.bind(this);
        this.handleSubmitRider = this.handleSubmitRider.bind(this);
        this.resetRidersFromProps();
        this.handleDeleteRiders = this.handleDeleteRiders.bind(this);
        this.idGen = new IdGenerator(this.props.CollectionKey);
    }

    resetRidersFromProps(){
    if(this.props.LocationRiders){
      // this.props.LocationRiders.forEach(i=>i.Key = this.idGen.NewId());
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
    locationRider.Key = this.idGen.NewId().toString();
    locationRiders.push(locationRider);
    this.resetLocationRiders(locationRiders);
}
handleDeleteRiders(key:string) {
  let rider = Enumerable.from(this.state.LocationRiders).select((i, index)=>{return {key:i.SearchResult, index:index}}).first(i=>i.key==key);
 var state = this.state;
 state.LocationRiders.splice(rider.index,1);
 // update(state, {LocationRiders:{$splice:[[rider.index]]}});
 this.setState(state, this.notifyLocationRidersChanged);
}
resetLocationRiders(locationRiders:ILocationRider[]){
  this.setState({LocationRiders:locationRiders, NumRiders:Enumerable.from(locationRiders).sum(i=>i.NumRiders!)}, this.notifyLocationRidersChanged);

}
notifyLocationRidersChanged(){
    this.props.handleLocationRidersChanged(this.state.LocationRiders)
}
  render() {
    let blankitem = (
      <LocationRiderControl key={this.props.CollectionKey+ (this.state.LocationRiders.length==0? "-1".toString():this.state.LocationRiders.length.toString())}
      submitLocationRider={(e)=>this.handleSubmitRider(e)}
     />
  );
    const items = new Array();
    var itemMap = this.state.LocationRiders.map((locationRider, index)=>
    <div><LocationRiderControl key={locationRider.SearchResult} NumRiders={locationRider.NumRiders} SearchResult={locationRider.SearchResult} Coords={locationRider.Coords}
        submitLocationRider={(e)=>this.handleSubmitRider(e)} handleLocationRiderChanged={e=>this.handleLocationRiderChanged(e, index)}
    /><button onClick={()=>this.handleDeleteRiders(locationRider.SearchResult!)}>Delete</button></div>);
    
    itemMap.push(blankitem);
    return <div>Total Riders:{this.state.NumRiders}<ol>{itemMap}</ol></div>;
  }
}
