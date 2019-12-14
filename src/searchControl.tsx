import * as rm from "typed-rest-client/RestClient";
import * as React from "react";
import "./styles.css";
import { IBingMapsResponse, IResource } from "./bing";

async function getBingMapsResponse(query: string): Promise<IResource> {
  console.log("running search");
  let rest = new rm.RestClient("rest-samples", "https://dev.virtualearth.net");
  let response: rm.IRestResponse<IBingMapsResponse> = await rest.get<
    IBingMapsResponse
  >(
    "/REST/v1/Locations?q=" +
      query +
      "&key=ArLJodQ7fEaQ2dfy3lIHWJrJILC35_Qj0EpT8TCy3ls96pl6sqCdlu18bo8j_tbM"
  );
  // console.log("the response:" + JSON.stringify(response));
  return response.result!.resourceSets[0].resources[0];
}

interface ISearchState {
  SearchQuery: string;
  SearchResult: string;
  SearchResultVisible: boolean;
  Coords: ILatLong;
  LastQuery?: string;
  Submitted?: boolean;
}
export interface ILatLong {
  Lat: number;
  Long: number;
}
export interface ISearchResult {
  SearchResult?: string;
  SearchQuery: string;
  Coords?: ILatLong;
}
export interface ISearchParam extends ISearchResult{
  endTime?:Date;
  startTime?:Date;
}
export interface ISearchControlProps {
  searchResultsChanged: (arg0: ISearchResult) => void;
  SearchResult: ISearchResult;
}
export class SearchControl extends React.Component<
  ISearchControlProps,
  ISearchState
> {
  constructor(props: Readonly<ISearchControlProps>) {
    super(props);
    this.handleSearchChanged = this.handleSearchChanged.bind(this);
    this.handleSearchBlur = this.handleSearchBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    let searchResult = '';
    let coords = {Lat:0, Long:0};
    if(props.SearchResult){
      if(props.SearchResult.SearchResult)
        searchResult = props.SearchResult.SearchResult;
      if(props.SearchResult.Coords)
        coords = props.SearchResult.Coords;
    }
    this.state = {
      SearchResultVisible: false,
      SearchQuery: props.SearchResult ? props.SearchResult.SearchQuery : "",
      SearchResult: searchResult,
      Coords: coords
    };
    this.inputElement = null;
  }
  componentDidMount() {
    this.inputElement!.focus();
  }
  inputElement:HTMLInputElement|null;
  handleSearchChanged(event) {
    this.setState({ LastQuery: this.state.SearchQuery });
    console.log("handlesearch changed last query is " + this.state.LastQuery);

    this.setState({
      SearchQuery: event.target.value,
      SearchResultVisible: true
    });
    getBingMapsResponse(event.target.value).then(i => {

      console.log("last query is " + this.state.LastQuery);
      console.log("maps Response: " + JSON.stringify(i));
      if(i===undefined)
        return;
      this.setState({
        SearchResult: i.name,
        Coords: { Lat: i.point.coordinates[0], Long: i.point.coordinates[1] }
      });
    });
  }
  noticedChange(): boolean {
    console.log("last query is " + this.state.LastQuery);
    console.log("search query is " + this.state.SearchQuery);
    console.log("search result is " + this.state.SearchResult);
    if (this.state.LastQuery !== this.state.SearchQuery) {
      this.setState({ LastQuery: this.state.SearchQuery });

      console.log("noticed change to " + this.state.LastQuery);
      return true;
    } else {
      console.log("noticed no change");
      return false;
    }
  }

  handleSearchBlur(event) {
    if (!this.noticedChange()) return;
    let searchResult =
      this.state.SearchQuery === "" ? "" : this.state.SearchResult;
    this.setState({
      SearchQuery: searchResult,
      SearchResultVisible: false
    });
    this.setState({ LastQuery: searchResult });
    if (searchResult === "") return;
    this.setState({
      Submitted: true
    });
    this.props.searchResultsChanged({
      SearchResult: searchResult,
      Coords: this.state.Coords,
      SearchQuery: this.state.SearchQuery
    });
  }
  handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      this.inputElement!.blur();
      //this.handleSearchBlur(null);
    }
    if (this.state.SearchQuery === "") {
      this.setState({ SearchResultVisible: false });
    }
  };
  render() {
    let searchResult;
    if (this.state.SearchResultVisible) {
      searchResult = (
        <input type="text" value={this.state.SearchResult} readOnly={true} />
      );
    }
    return (
      <div>
        <input
          type="text"
          value={this.state.SearchQuery}
          onChange={this.handleSearchChanged}
          onBlur={this.handleSearchBlur}
          onKeyDown={this.handleKeyDown}
          readOnly={this.state.Submitted}
          ref={input => (this.inputElement = input)}
        />
        <br />
        {searchResult}
        <br />
      </div>
    );
  }
}
