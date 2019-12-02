import * as React from "react";
import { SearchCollection } from "./searchCollection";
import { ISearchResult } from "./searchControl";
import { Itinerary, IItinineraryResponse } from "./itinerary";
import { SearchControl } from "./searchControl";
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
    this.itinerary = new Itinerary();
    this.handleDestinationChanged = this.handleDestinationChanged.bind(this);
    this.state = { DwellTime: 15 };
    this.handleDwellTimeChanged = this.handleDwellTimeChanged.bind(this);
  }
  itinerary: Itinerary;
  render() {
    let responseList;
    if (
      this.state &&
      this.state.ItineraryResponse &&
      this.state.ItineraryResponse.resourceSets
    )
      //TODO:Break this out into it's own control
      responseList = this.state.ItineraryResponse.resourceSets[0].resources[0].agentItineraries[0].instructions.map(
        i => {
          let loc;
          let place;
          let endtime;
          let duration;
          if (i.itineraryItem) {
            loc =
              "Location:(" +
              i.itineraryItem.location.latitude +
              ", " +
              i.itineraryItem.location.longitude +
              ")";
            if (i.itineraryItem.name) {
              place = (
                <span>
                  <b>Place:</b>
                  <label>{i.itineraryItem.name}</label>
                </span>
              );
            }
          }
          if (i.endTime) {
            endtime = (
              <span>
                <b>EndTime:</b> {i.endTime}
              </span>
            );
          }
          if (i.duration) {
            duration = (
              <span>
                {" "}
                <b>Duration:</b>
                {i.duration}
              </span>
            );
          }
          return (
            <li key={i.startTime + i.instructionType}>
              <b>Start:</b>
              {i.startTime} {place}
              <br />
              <b> Type:</b>
              {i.instructionType} {endtime} {duration}
            </li>
          );
        }
      );
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
