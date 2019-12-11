import * as React from "react";
import { SearchCollection } from "./searchCollection";
import { ISearchResult } from "./searchControl";
import { IItinineraryResponse, instructionSet, IItineraryService, ItinerariesResponse } from "./Services/itinerary";
import { SearchControl } from "./searchControl";
import { InstructionControl } from "./instructionControl";
import { InstructionSummaryControl } from "./Controls/instructionSummaryControl";
import { ItineraryService } from "./Services/ItineraryService";
import { ItineraryCollectionService } from "./Services/ItineraryCollectionService";
interface IDisplayItinerariesState {
  SearchResults?: ISearchResult[];
  Destination?: ISearchResult;
  ItineraryResponse?: IItinineraryResponse;
  ItinerariesResponse?:ItinerariesResponse; 
  DwellTime?: number;
}
export class DisplayItineraries extends React.Component<
  {},
  IDisplayItinerariesState
> {
  constructor(props) {
    super(props);
    this.itinerary = new ItineraryService();
    this.itineraryCollection = new ItineraryCollectionService(this.itinerary);
    this.handleDestinationChanged = this.handleDestinationChanged.bind(this);
    this.state = { DwellTime: 15 };
    this.handleDwellTimeChanged = this.handleDwellTimeChanged.bind(this);
    this.handleSingleItinerarySearch = this.handleSingleItinerarySearch.bind(this);
    this.handleMultipleItinerarySearch = this.handleMultipleItinerarySearch.bind(this);
    this.handleSearchItineraries = this.handleSearchItineraries.bind(this);
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
          <SearchControl
            SearchResult={{
              SearchQuery: "",
              SearchResult: undefined
            }}
            searchResultsChanged={this.handleDestinationChanged}
          />
        </div>
        <div>
          Enter dwell time:
          <br />
          <input
            value={this.state.DwellTime}
            onChange={this.handleDwellTimeChanged}
          />
        </div>
        <SearchCollection
          handleSearchCollectionChanged={this.handleMultipleItinerarySearch}
        />
        <button  onClick={this.handleSearchItineraries}>Search</button>
        <h1>Itineraries:</h1>
        <ol>{responseList}</ol>
      </div>
    );
  }
  handleSingleItinerarySearch(searchResults:ISearchResult[]){
    this.itinerary
              .getItinerary({
                dwellTime: this.state.DwellTime!,
                searchResults: searchResults,
                startLocation: searchResults[0].Coords!,
                endLocation: this.state.Destination!.Coords!
              })
              .then((i: IItinineraryResponse) => {
                this.setState({ ItineraryResponse: i });
              });
            }
  handleMultipleItinerarySearch(searchResults:ISearchResult[]){
    this.setState({SearchResults:searchResults});
  }
  handleSearchItineraries(){
    this.itineraryCollection.getItineraries({
      dwellTime: this.state.DwellTime!,
      searchResults: this.state.SearchResults!,
      endLocation: this.state.Destination!.Coords!
    }).then((i: ItinerariesResponse) => {
      this.setState({ ItinerariesResponse: i });
    })
  }
  handleDestinationChanged(e: ISearchResult) {
    console.log("handle destination changed:" + JSON.stringify(e));
    this.setState({ Destination: e });
  }
  handleDwellTimeChanged(event) {
    this.setState({ DwellTime: event.target.value });
  }
}
