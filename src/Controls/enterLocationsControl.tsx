import * as React from "react";
import { LocationRiderCollectionControl } from "./locationRiderCollectionControl";
import { ISearchResult, ISearchParam } from "./enterLocationControl";
import { IItinineraryResponse, instructionSet, IItineraryService, ItinerariesResponse } from "../Services/itinerary";
import { EnterLocationControl } from "./enterLocationControl";
import { ItineraryInstructionsControl } from "./itineraryInstructionsControl";
import { InstructionSummaryControl } from "./instructionSummaryControl";
import { ItineraryService } from "../Services/ItineraryService";
import { ItineraryCollectionService } from "../Services/ItineraryCollectionService";
import DateTimePicker from "react-datetime-picker";
import * as dateMath from 'date-arithmetic';
import { ItinerariesControl } from "./itinerariesControl";
interface IDisplayItinerariesState {
  SearchResults?: ISearchParam[];
  Destination?: ISearchResult;
  ItineraryResponse?: IItinineraryResponse;
  ItinerariesResponse?:ItinerariesResponse; 
  DwellTime?: number;
  Arrivaltime:Date;
}
export class EnterLocationsControl extends React.Component<
  {},
  IDisplayItinerariesState
> {
  constructor(props) {
    super(props);
    this.itinerary = new ItineraryService();
    this.itineraryCollection = new ItineraryCollectionService(this.itinerary);
    this.handleDestinationChanged = this.handleDestinationChanged.bind(this);

    this.state = { DwellTime: 15, Arrivaltime: this.initializeArrivalTime()};
    this.handleDwellTimeChanged = this.handleDwellTimeChanged.bind(this);
    //this.handleSingleItinerarySearch = this.handleSingleItinerarySearch.bind(this);
    this.handleMultipleItinerarySearch = this.handleMultipleItinerarySearch.bind(this);
    this.handleSearchItineraries = this.handleSearchItineraries.bind(this);
    this.handleReadjustForArrival = this.handleReadjustForArrival.bind(this);
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
      this.state.ItineraryResponse &&
      this.state.ItineraryResponse.resourceSets
    ){
      //TODO:Break this out into it's own control
      responseList  = <InstructionSummaryControl instructionSet=
        {this.state.ItineraryResponse.instructionSets[0]}/>;
    }
    else if (
      this.state &&
      this.state.ItinerariesResponse
    ){
      //TODO:Break this out into it's own control
      let instructionList  = this.state.ItinerariesResponse.itineraries.map(m=>
     <li><InstructionSummaryControl instructionSet = {m.instructionSets[0]}/></li>);
      responseList = <ol>{instructionList}</ol>;
    }
    return (
      <div>
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
          <input
            value={this.state.DwellTime}
            onChange={this.handleDwellTimeChanged}
          />
        </div>
         Enter arrival time:
    <br />
    <DateTimePicker
      value={this.state.Arrivaltime}
      onChange={this.handleArrivalTimeChanged}
    />
        <locationRiderCollectionControl
          handleSearchCollectionChanged={this.handleMultipleItinerarySearch}
        />
        <button  onClick={this.handleSearchItineraries}>Search</button>
       <ItinerariesControl ItinerariesResponse={this.state.ItinerariesResponse}/>
      </div>
    );
  }
  handleArrivalTimeChanged(date:Date){
    this.setState({Arrivaltime:date});
  }
  searchResultHashmap={};
  handleReadjustForArrival(date:Date){
    this.state.SearchResults!.forEach(i=>{
      let duration:number = this.searchResultHashmap[i.SearchResult!];
      duration+=2;
      let startTime = dateMath.add(date, -duration, "minutes");
      i.startTime = startTime;
      i.endTime = dateMath.add(startTime, 1, "day");
    });
    this.handleSearchItineraries();
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
  handleSearchItineraries(){
    this.itineraryCollection.getItineraries({
      dwellTime: this.state.DwellTime!,
      searchResults: this.state.SearchResults!,
      endLocation: this.state.Destination!.Coords!
    })
    .then((i: ItinerariesResponse) => {
      this.setState({ ItinerariesResponse: i });
      i.itineraries.forEach(it=>{it.instructionSets.forEach(is=>{
        this.searchResultHashmap[is.startingPoint] = is.durationMinutes;
      });});
    }).then(()=>{
      this.handleReadjustForArrival(this.state.Arrivaltime);
    });
  }
  handleDestinationChanged(e: ISearchResult) {
    console.log("handle destination changed:" + JSON.stringify(e));
    this.setState({ Destination: e });
  }
  handleDwellTimeChanged(event) {
    this.setState({ DwellTime: event.target.value });
  }
}
