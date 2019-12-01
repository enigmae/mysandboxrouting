import { SearchControl, ISearchResult } from "./searchControl";
import * as React from "react";
interface ISearchCollectionState {
  SearchResults: ISearchResult[];
}
export interface ISearchCollectionProps {
  handleSearchCollectionChanged: (searchResults: ISearchResult[]) => void;
}
export class SearchCollection extends React.Component<
  ISearchCollectionProps,
  ISearchCollectionState
> {
  constructor(props: Readonly<ISearchCollectionProps>) {
    super(props);
    this.handleSearchResultChanged = this.handleSearchResultChanged.bind(this);
    this.state = { SearchResults: [] };
  }

  handleSearchResultChanged(e: ISearchResult) {
    console.log("handleSearchResultsChanged ");
    this.state.SearchResults.push(e);
    this.setState({ SearchResults: this.state.SearchResults });
    this.props.handleSearchCollectionChanged(this.state.SearchResults);
  }
  render() {
    const blankitem = (
      <li>
        <SearchControl
          SearchResult={{
            SearchQuery: "",
            SearchResult: undefined
          }}
          searchResultsChanged={this.handleSearchResultChanged}
        />
      </li>
    );
    const items = [blankitem];
    for (let search of this.state.SearchResults) {
      items.push(blankitem);
    }
    return <ol>{items}</ol>;
  }
}
