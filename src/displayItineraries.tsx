import * as React from "react";
import { SearchCollection } from "./searchCollection";
import { ISearchResult } from "./searchControl";
import { IItinineraryResponse, instructionSet, IItineraryService } from "./Services/itinerary";
import { SearchControl } from "./searchControl";
import { InstructionControl } from "./instructionControl";
import { InstructionSummaryControl } from "./Controls/instructionSummaryControl";
import { ItineraryService } from "./Services/ItineraryService";
interface IDisplayItinerariesState {
  SearchResults?: ISearchResult[];
  Destination?: ISearchResult;
  ItineraryResponse?: IItinineraryResponse;
  DwellTime?: number;
}
export class DisplayItineraries extends React.Component<
  {},
  IDisplayItinerariesState
> {
  constructor(props) {
    super(props);
    this.itinerary = new ItineraryService();
    this.handleDestinationChanged = this.handleDestinationChanged.bind(this);
    this.state = { DwellTime: 15 };
    this.handleDwellTimeChanged = this.handleDwellTimeChanged.bind(this);
  }
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
          handleSearchCollectionChanged={i => {
            //this.setState({ SearchResults:i});
            this.itinerary
              .getItinerary({
                dwellTime: this.state.DwellTime!,
                searchResults: i,
                startLocation: i[0].Coords!,
                endLocation: this.state.Destination!.Coords!
              })
              .then((i: IItinineraryResponse) => {
                this.setState({ ItineraryResponse: i });
              });
          }}
        />
        <h1>Itineraries:</h1>
        <ol>{responseList}</ol>
      </div>
    );
  }
  handleDestinationChanged(e: ISearchResult) {
    console.log("handle destination changed:" + JSON.stringify(e));
    this.setState({ Destination: e });
  }
  handleDwellTimeChanged(event) {
    this.setState({ DwellTime: event.target.value });
  }
}
