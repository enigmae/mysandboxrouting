import * as React from 'react';
import { EnterLocationControl, ISearchParam, ISearchResult } from './enterLocationControl';
interface ISearchCollectionState {
    SearchResults: ISearchParam[];
    NumRiders:number;
  }
  export interface ISearchCollectionProps {
    handleSearchCollectionChanged: (searchResults: ISearchResult[]) => void;
  }
export class LocationRiderControl extends React.Component< ISearchCollectionProps,
ISearchCollectionState>{
    handleSearchResultChanged(e: ISearchResult) {
        console.log("handleSearchResultsChanged ");
        var searchResult = {...e, };
        this.state.SearchResults.push(e);
        this.setState({ SearchResults: this.state.SearchResults });
        this.props.handleSearchCollectionChanged(this.state.SearchResults);
      }
    render(){
        return <table>
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
        </div></tr></table>
    }
}