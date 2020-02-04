import * as rm from "typed-rest-client/RestClient";
import * as React from "react";
import "../styles.css";
import { IBingMapsResponse, IResource } from "../bing";

async function getBingMapsResponse(query: string): Promise<IResource> {
    console.log("running search");
    const rest = new rm.RestClient("rest-samples", "https://dev.virtualearth.net");
    const response = await rest.get<
        IBingMapsResponse
    >(
        `/REST/v1/Locations?q=${query}&key=ArLJodQ7fEaQ2dfy3lIHWJrJILC35_Qj0EpT8TCy3ls96pl6sqCdlu18bo8j_tbM`
    );
    // console.log("the response:" + JSON.stringify(response));
    return response.result!.resourceSets[0].resources[0];
}

interface IEnterLocationState {
    SearchQuery?: string;
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
    SearchQuery?: string;
    Coords?: ILatLong;
}

export interface ISearchParam extends ISearchResult {
    EndTime?: Date;
    StartTime?: Date;
    Riders?: number;
}

export class SearchParam implements ISearchParam {
    constructor(public SearchResult: string,
        public Riders: number,
        public Coords: ILatLong,
        public StartTime?: Date,
        public EndTime?: Date) {

    }
}

export interface IEnterLocationControlProps {
    searchResultsChanged: (arg0: ISearchResult) => void;
    SearchResult?: ISearchResult;
    Disabled?:boolean;
}

export class EnterLocationControl extends React.Component<
    IEnterLocationControlProps,
    IEnterLocationState
> {
    constructor(props: Readonly<IEnterLocationControlProps>) {
        super(props);
        this.handleSearchChanged = this.handleSearchChanged.bind(this);
        this.handleSearchBlur = this.handleSearchBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        //TODO:Just set the default props
        const stateFromProps = this.getStateFromprops();
        this.state = {
            SearchResultVisible: false,
            ...stateFromProps
        };
        this.inputElement = null;
    }

    getStateFromprops() {
        const searchResult = "";
        const coords = { Lat: 0, Long: 0 };
        return {
            SearchQuery: this.props.SearchResult && this.props.SearchResult.SearchQuery
                ? this.props.SearchResult.SearchQuery
                : "",
            SearchResult: this.props.SearchResult && this.props.SearchResult.SearchResult
                ? this.props.SearchResult.SearchResult
                : searchResult,
            Coords: this.props.SearchResult && this.props.SearchResult.Coords ? this.props.SearchResult.Coords : coords
        };
    }

    raiseSearchResultsChanged() {
        this.props.searchResultsChanged({
            SearchResult: this.state.SearchResult,
            Coords: this.state.Coords,
            SearchQuery: this.state.SearchQuery
        });
    }

    componentDidUpdate(prevProps: IEnterLocationControlProps, prevState: IEnterLocationState) {
        if (prevState.SearchQuery != this.state.SearchQuery) {
            this.raiseSearchResultsChanged();
            return;
        }
        if (prevProps.SearchResult && this.props.SearchResult) {
            if (prevProps.SearchResult.SearchQuery != this.props.SearchResult.SearchQuery) {
                this.setState(this.getStateFromprops(),
                    () => this.resetCoordsFromBing(this.props.SearchResult!.SearchQuery!));
            }
        }
    }

    componentDidMount() {
        this.inputElement!.focus();
    }

    inputElement: HTMLInputElement | null;

    handleSearchChanged(event) {
        this.setState({ LastQuery: this.state.SearchQuery });
        console.log(`handlesearch changed last query is ${this.state.LastQuery}`);

        this.setState({
            SearchQuery: event.target.value,
            SearchResultVisible: true
        });
        this.resetCoordsFromBing(event.target.value);
    }

    resetCoordsFromBing(search: string) {
        getBingMapsResponse(search).then(i => {

            console.log(`last query is ${this.state.LastQuery}`);
            console.log(`maps Response: ${JSON.stringify(i)}`);
            if (i === undefined)
                return;
            this.setState({
                    SearchResult: i.name,
                    Coords: { Lat: i.point.coordinates[0], Long: i.point.coordinates[1] }
                },
                this.raiseSearchResultsChanged);
        });
    }

    noticedChange(): boolean {
        console.log(`last query is ${this.state.LastQuery}`);
        console.log(`search query is ${this.state.SearchQuery}`);
        console.log(`search result is ${this.state.SearchResult}`);
        if (this.state.LastQuery !== this.state.SearchQuery) {
            this.setState({ LastQuery: this.state.SearchQuery });

            console.log(`noticed change to ${this.state.LastQuery}`);
            return true;
        } else {
            console.log("noticed no change");
            return false;
        }
    }

    handleSearchBlur(event) {
        if (!this.noticedChange()) return;
        const searchResult = this.state.SearchQuery === "" ? "" : this.state.SearchResult;
        this.setState({
            SearchQuery: searchResult,
            SearchResultVisible: false
        });
        this.setState({ LastQuery: searchResult });
        if (searchResult === "") return;
        this.setState({
            Submitted: true
        });
        this.raiseSearchResultsChanged();

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
        let searchResult: Object = <div hidden={true}/>;
        if (this.state.SearchResultVisible) {
            searchResult = (
                <div>
                    <input type="text" value={this.state.SearchResult} readOnly={true}/>
                    <br/>
                </div>
            );
        }
        return (
            <span>
                <input disabled={this.props.Disabled}
                    type="text"
                    value={this.state.SearchQuery}
                    onChange={this.handleSearchChanged}
                    onBlur={this.handleSearchBlur}
                    onKeyDown={this.handleKeyDown}
                    ref={input => (this.inputElement = input)}/>
                {searchResult}
            </span>
        );
    }
}