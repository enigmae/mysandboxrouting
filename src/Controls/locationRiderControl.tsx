import * as React from 'react';
import { EnterLocationControl, ISearchParam, ISearchResult } from './enterLocationControl';
import { ILocation } from '../bing';
export interface ILocationRider {
    SearchResult?: string;
    NumRiders?:number;
  }
  export interface ILocationRiderControlState extends ILocationRider{
    SubmitEnabled:boolean;
    Submitted:boolean;
  }
  export interface ILocationRiderControlProps {
    handleLocationRiderChanged?: (locationRider: ILocationRider) => void;
    submitLocationRider:(locationRider: ILocationRider)=>void;
    NumRiders?:number;
    SearchResult?:string;
  }
export class LocationRiderControl extends React.Component< ILocationRiderControlProps,
ILocationRiderControlState>{
  constructor(props:Readonly<ILocationRiderControlProps>){
    super(props);
    this.handleRidersChanged = this.handleRidersChanged.bind(this);
    this.handleAddLocationClicked = this.handleAddLocationClicked.bind(this);
    this.handleSearchResultChanged = this.handleSearchResultChanged.bind(this);
    this.state = {NumRiders:props.NumRiders, SearchResult:props.SearchResult, SubmitEnabled:false, Submitted:false};
  }
  handleRidersChanged(e){
    this.setState({NumRiders:e.target.value}, this.resetSubmitEnabled);
  }
  handleSearchResultChanged(e: ISearchResult) {
        console.log("handleSearchResultsChanged ");
        this.setState({ SearchResult: e.SearchResult }, this.resetSubmitEnabled);
      }
  handleAddLocationClicked(){
      this.props.submitLocationRider(this.state);
  }
  resetSubmitEnabled(){
    if(this.state.NumRiders && this.state.SearchResult){
      this.setState({SubmitEnabled:true});
    }
  }
    render(){
        return <table>
          <td></td>
          <td></td>
        <tr>
         <EnterLocationControl
          SearchResult={{
            SearchQuery: "",
            SearchResult: this.state.SearchResult
          }}
          searchResultsChanged={this.handleSearchResultChanged}
        />
        <div style={{display:"inline-block"}}>
        <label className="RidersLabel"># Riders</label><input className="Riders" value={this.state.NumRiders} onChange={this.handleRidersChanged}/>
        <button className="AddLocation" onClick={this.handleAddLocationClicked} disabled={!this.state.SubmitEnabled}>Add location</button>
        </div></tr></table>
    }
}