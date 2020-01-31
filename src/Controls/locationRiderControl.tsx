import * as React from 'react';
import { EnterLocationControl, ISearchParam, ISearchResult, ILatLong } from './enterLocationControl';
import { ILocation } from '../bing';
import { LatLng } from '../Services/rallyService';
export interface ILocationRider {
    SearchResult?: string;
    NumRiders?:number;
    Coords?:ILatLong;
    SearchQuery?:string;
  }
  export interface ILocationRiderControlState extends ILocationRider{
    SubmitEnabled:boolean;
    Submitted:boolean;
    Preloaded:boolean;
  }
  export interface ILocationRiderControlProps {
    handleLocationRiderChanged?: (locationRider: ILocationRider) => void;
    submitLocationRider:(locationRider: ILocationRider)=>void;
    NumRiders?:number;
    SearchResult?:string;
    Coords?:LatLng
  }
export class LocationRiderControl extends React.Component< ILocationRiderControlProps,
ILocationRiderControlState>{
  constructor(props:Readonly<ILocationRiderControlProps>){
    super(props);
    this.handleRidersChanged = this.handleRidersChanged.bind(this);
    this.handleAddLocationClicked = this.handleAddLocationClicked.bind(this);
    this.handleSearchResultChanged = this.handleSearchResultChanged.bind(this);
    let submitted = false;
    if(props.NumRiders || props.SearchResult){
      submitted = true;
    }
    this.state = {NumRiders:props.NumRiders,SearchQuery:props.SearchResult, SearchResult:props.SearchResult,SubmitEnabled:false, Coords:props.Coords,Preloaded:submitted, Submitted:false};
  }
  handleRidersChanged(e){
    this.setState({NumRiders:parseInt(e.target.value)},()=>{
      this.notifyLocationRiderChanged();
      this.resetSubmitEnabled();
      });
    ;
  }
  handleSearchResultChanged(e: ISearchResult) {
        console.log("handleSearchResultsChanged ");
        this.setState({ SearchResult: e.SearchResult,Coords:e.Coords!}, this.resetSubmitEnabled);
      
       this.notifyLocationRiderChanged();
        
      }
  notifyLocationRiderChanged(){
    if((this.state.Submitted || this.state.Preloaded) && this.props.handleLocationRiderChanged)
        this.props.handleLocationRiderChanged({ SearchResult:this.state.SearchResult, SearchQuery:this.state.SearchQuery, NumRiders:this.state.NumRiders, Coords:this.state.Coords});
  }
  handleAddLocationClicked(){
    this.notifySubmitLocationRider();
    this.setState({Submitted:true});
  }
  notifySubmitLocationRider(){
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
            SearchQuery: this.state.SearchQuery,
            SearchResult: this.state.SearchResult,
            Coords:this.state.Coords
          }}
          searchResultsChanged={this.handleSearchResultChanged}
        />
        <div style={{display:"inline-block"}}>
        <label className="RidersLabel"># Riders</label><input className="Riders" value={this.state.NumRiders} onChange={this.handleRidersChanged}/>
        <button className="AddLocation" onClick={this.handleAddLocationClicked} disabled={!this.state.SubmitEnabled} style={{visibility:this.state.Submitted || this.state.Preloaded ? 'hidden':'visible'}}>Add location</button>
        </div></tr></table>
    }
}