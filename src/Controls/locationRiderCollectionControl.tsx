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
    this.state = { LocationRiders: [] };
    this.handleLocationRiderChanged = this.handleLocationRiderChanged.bind(this);
  }
  blankitem = (
    <LocationRiderControl
    submitLocationRider={this.handleSubmitRider}
     handleLocationRiderChanged={this.handleLocationRiderChanged}
   />
);
  handleLocationRiderChanged(locationRider: ILocationRider){

  }
handleSubmitRider(locationRider: ILocationRider){
    this.state.LocationRiders.push(locationRider);
}
  render() {
    const items = [this.blankitem];
    for (let locationRider of this.state.LocationRiders) {
      items.push(<LocationRiderControl NumRiders={locationRider.NumRiders} SearchResult={locationRider.SearchResult}/>);
    }
    return <ol>{items}</ol>;
  }
}
