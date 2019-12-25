import { EnterLocationControl, ISearchResult, ISearchParam } from "./enterLocationControl";
import * as React from "react";
import { LocationRiderControl, ILocationRider } from "./locationRiderControl";

export interface ILocationRiderCollectionControlProps{

}
export interface ILocationRiderCollectionControlState{
  LocationRiders:ILocationRider[];
}
export class LocationRiderCollectionControl extends React.Component<ILocationRiderCollectionControlProps, ILocationRiderCollectionControlState> {
  constructor(props: Readonly<ILocationRiderCollectionControlProps>) {
    super(props);
    this.state = { LocationRiders: new Array() };
    this.handleLocationRiderChanged = this.handleLocationRiderChanged.bind(this);
    this.handleSubmitRider = this.handleSubmitRider.bind(this);
  }
  blankitem = (
    <LocationRiderControl
    submitLocationRider={(e)=>this.handleSubmitRider(e)}
     handleLocationRiderChanged={this.handleLocationRiderChanged}
   />
);
  handleLocationRiderChanged(locationRider: ILocationRider){

  }
handleSubmitRider(locationRider: ILocationRider){
  var locationRiders = this.state.LocationRiders;
  locationRiders.push(locationRider);
  this.setState({LocationRiders:locationRiders});
}
  render() {
    const items = [this.blankitem];
    for (let locationRider of this.state.LocationRiders) {
      items.push(<LocationRiderControl NumRiders={locationRider.NumRiders} SearchResult={locationRider.SearchResult}
        submitLocationRider={(e)=>this.handleSubmitRider(e)}
        />);
    }
    return <ol>{items}</ol>;
  }
}
