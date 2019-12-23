import { EnterLocationControl, ISearchResult, ISearchParam } from "./enterLocationControl";
import * as React from "react";

export class SearchCollectionControl extends React.Component<
 
> {
  constructor(props: Readonly<ISearchCollectionProps>) {
    super(props);
    this.handleSearchResultChanged = this.handleSearchResultChanged.bind(this);
    this.state = { SearchResults: [], NumRiders:0 };
  }


  render() {
    const blankitem = (
      <li>
        <table>
          <td></td>
          <td></td>
        </table>
        <tr>
         <EnterLocationControl
          SearchResult={{
            SearchQuery: "",
            SearchResult: undefined
          }}
          searchResultsChanged={this.handleSearchResultChanged}
        />
        <div style={{display:"inline-block"}}>
        <label className="RidersLabel"># Riders</label><input className="Riders" value={this.state.NumRiders}/>
        </div></tr>
        </li>
    );
    const items = [blankitem];
    for (let search of this.state.SearchResults) {
      items.push(blankitem);
    }
    return <ol>{items}</ol>;
  }
}
