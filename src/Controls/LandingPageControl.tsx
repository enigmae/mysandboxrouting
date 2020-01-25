import * as React from "react";
import * as NumericInput from "react-numeric-input";
import { LocationRiderCollectionControl } from "./locationRiderCollectionControl";
import { ISearchResult, ISearchParam, SearchParam } from "./enterLocationControl";
import { IItinineraryResponse, instructionSet, IItineraryService, ItinerariesResponse } from "../Services/itinerary";
import { EnterLocationControl } from "./enterLocationControl";
import { ItineraryInstructionsControl } from "./itineraryInstructionsControl";
import { InstructionSummaryControl } from "./instructionSummaryControl";
import { ItineraryService } from "../Services/ItineraryService";
import { ItineraryCollectionService } from "../Services/ItineraryCollectionService";
import DateTimePicker from "react-datetime-picker";
import * as dateMath from 'date-arithmetic';
import { ItinerariesControl } from "./itinerariesControl";
import { ILocationRider } from "./locationRiderControl";
import Enumerable from "linq";
import { BusCapacityControl, CapacityKey } from "./BusCapacityControl";
interface IDisplayItinerariesState {
  SearchResults?: ISearchParam[];
  Destination?: ISearchResult;
  ItineraryResponse?: IItinineraryResponse;
  ItinerariesResponse?:ItinerariesResponse; 
  DwellTime?: number;
  Arrivaltime:Date;
  /*MinBuses:number;
  MaxBuses:number;
  BusCapacity:number,
  */Loading:boolean,
  CanSubmit:boolean,
  BusCapacities?:Array<CapacityKey>
}
export interface visibility{
  visibility:'visible'|'hidden';
}
export function boolVis(isVisible:boolean):visibility{
  
  return {visibility: isVisible ? 'visible':'hidden'}
}
export class LandingPageControl extends React.Component<
  {},
  IDisplayItinerariesState
> {
  constructor(props) {
    super(props);
    this.itinerary = new ItineraryService();
    this.itineraryCollection = new ItineraryCollectionService(this.itinerary);
    this.handleDestinationChanged = this.handleDestinationChanged.bind(this);

    this.state = { DwellTime: 15, Arrivaltime: this.initializeArrivalTime(), Loading:false,CanSubmit:false};
    this.handleDwellTimeChanged = this.handleDwellTimeChanged.bind(this);
    //this.handleSingleItinerarySearch = this.handleSingleItinerarySearch.bind(this);
    this.handleMultipleItinerarySearch = this.handleMultipleItinerarySearch.bind(this);
    this.handleSearchItineraries = this.handleSearchItineraries.bind(this);
    this.handleReadjustForArrival = this.handleReadjustForArrival.bind(this);
    this.handleArrivalTimeChanged = this.handleArrivalTimeChanged.bind(this);
    this.handleBusCapacitiesChanged = this.handleBusCapacitiesChanged.bind(this);
  }
  initializeArrivalTime(){
    let endOfToday = dateMath.endOf(new Date(),'day');
    let ninePm = dateMath.add(endOfToday, 20, "hours");
    let subtractDay = dateMath.add(ninePm, -1, "day");
    return dateMath.add(subtractDay, 1, "minutes");
  }
  itineraryCollection: ItineraryCollectionService;
  itinerary: IItineraryService;
  render() {
    let responseList;
    if (
      this.state &&
      this.state.ItinerariesResponse
    ){
      //TODO:Break this out into it's own control
      let instructionList  = this.state.ItinerariesResponse.itineraries.map(m=>
     <li><InstructionSummaryControl condensedInstructionSet = {m.condensedInstructionSet}/></li>);
      responseList = <ol>{instructionList}</ol>;
    }
    return (<div>
        <div>
          Enter destination:
          <div>
          <EnterLocationControl
            SearchResult={{
              SearchQuery: "",
              SearchResult: undefined
            }}
            searchResultsChanged={this.handleDestinationChanged}
          /></div>
        </div>
        <div>
          Enter dwell time:
          <br />
          <NumericInput
            value={this.state.DwellTime} max={120}
            onChange={this.handleDwellTimeChanged}
          />
        </div>
         Enter arrival time:
    <br />
    <DateTimePicker
      value={this.state.Arrivaltime}
      onChange={this.handleArrivalTimeChanged}
    />
    <BusCapacityControl handleBusCapacityChanged={this.handleBusCapacitiesChanged} />
        <LocationRiderCollectionControl handleLocationRidersChanged={(e)=>this.handleLocationRidersChanged(e)}
        />
        <button  onClick={()=>this.handleSearchItineraries()} disabled={!this.state.CanSubmit}>Search</button>
       <div style={{visibility: this.state.Loading ? 'visible': 'hidden'}}>Loading...</div>
       <ItinerariesControl ItinerariesResponse={this.state.ItinerariesResponse}/>
      </div>
    )
  }
  handleBusCapacitiesChanged(e){
    this.setState({BusCapacities:e});
  }
  
  handleLocationRidersChanged(locationRiders:ILocationRider[]){
   var result = Enumerable.from(locationRiders).select((val)=>new SearchParam(val.SearchResult!, val.NumRiders!, val.Coords!)).toArray();
   this.setState({SearchResults:result});
   if(this.state.Destination){
     this.setState({CanSubmit: true});
   }
  }

  handleArrivalTimeChanged(date:Date){
    this.setState({Arrivaltime:date});
  }

  searchResultHashmap={};
  handleReadjustForArrival(date:Date){
    var searchResultHashmap = this.searchResultHashmap;
    var research = false;
    this.state.SearchResults!.forEach(i=>{
      let existingDuration = searchResultHashmap[i.SearchResult!];
      if(existingDuration){
        research = true;
      }
      let duration:number = existingDuration;
      
     // duration+=2;
      let startTime = dateMath.add(date, -duration, "minutes");
      i.StartTime = startTime;
      i.EndTime = dateMath.add(startTime, 1, "day");
    });
    if(research)
    {
      this.handleSearchItineraries(true);
    }
  }
  handleReadjustForArrivalBySubtractDuration(date:Date){
    console.log('Readjusting for arrival date:'+date.toString());
    var response = this.state.ItinerariesResponse!
    response.itineraries.forEach(it=>{
      it.readjustForArrival(date);
    });
    this.setState({ItinerariesResponse:undefined}, ()=>this.setState({ItinerariesResponse:response}));
  }
  /*
  handleSingleItinerarySearch(searchResults:ISearchResult[]){
    this.itinerary
              .getItinerary({
                dwellTime: this.state.DwellTime!,
                searchParams: searchResults,
                startLocation: searchResults[0].Coords!,
                endLocation: this.state.Destination!.Coords!
              })
              .then((i: IItinineraryResponse) => {
                this.setState({ ItineraryResponse: i });
                i.instructionSets.forEach(is=>{
                  this.searchResultHashmap[is.startingPoint] = is.durationMinutes;
                });
              });
            }*/
  handleMultipleItinerarySearch(searchResults:ISearchResult[]){
    this.setState({SearchResults:searchResults});
  }
  handleSearchItineraries(skipReadjust:boolean=false){
    this.setState({Loading:true});
    this.itineraryCollection.getItineraries({
      dwellTime: this.state.DwellTime!,
      searchResults: this.state.SearchResults!,
      endLocation: this.state.Destination!.Coords!,
      endLocationName:this.state.Destination!.SearchResult!,
      busCapacities:Enumerable.from(this.state.BusCapacities!).select(i=>i.capacity).toArray()
    }) 
    .then((i: ItinerariesResponse) => {
      this.setState({ ItinerariesResponse: i });
      i.itineraries.forEach(it=>{it.instructionSets.forEach(is=>{
        this.searchResultHashmap[is.startingPoint] = is.durationMinutes;
      });});
    }).then(()=>{
      if(!skipReadjust)
        this.handleReadjustForArrivalBySubtractDuration(this.state.Arrivaltime);
    }).finally(()=>this.setState({Loading:false}));
  }
  handleDestinationChanged(e: ISearchResult) {
    console.log("handle destination changed:" + JSON.stringify(e));
    this.setState({ Destination: e });
  }
  handleDwellTimeChanged(event) {
    this.setState({ DwellTime: event.target.value });
  }
}
