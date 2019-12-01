import * as React from "react";
import { SearchCollection } from "./searchCollection";
import { ISearchResult } from "./searchControl";
import {Itinerary, IItinineraryResponse} from "./itinerary";
interface IDisplayItinerariesState{
    SearchResults:ISearchResult[];
    ItineraryResponse:IItinineraryResponse;
}
export class DisplayItineraries extends React.Component<{}, IDisplayItinerariesState>{
    constructor(props){
        super(props);
        this.itinerary = new Itinerary();
    }
    itinerary:Itinerary;
    render(){
        let responseList;
        if(this.state && this.state.ItineraryResponse && this.state.ItineraryResponse.resourceSets) 
            responseList = this.state.ItineraryResponse.resourceSets[0].resources[0].agentItineraries[0].instructions.map(i=>{
                let loc;
                let place;
                let endtime;
                let duration;
                if(i.itineraryItem){
                    loc = 'Location:('+i.itineraryItem.location.latitude+', '+i.itineraryItem.location.longitude+')';
                    if(i.itineraryItem.name){
                        place = <span><b>Place:</b><label>{i.itineraryItem.name}</label></span>;
                    }
                }
                if(i.endTime){
                    endtime = <span><b>EndTime:</b> {i.endTime}</span>;
                }
                if(i.duration){
                    duration = <span> <b>Duration:</b>{i.duration}</span>
                } 
                return(
            <li key={i.startTime+i.instructionType}>
                <b>Start:</b>{i.startTime} {place}<br/><b> Type:</b>{i.instructionType}  {endtime} {duration} 
                </li>);
        });
        return <div>
             <SearchCollection
        handleSearchCollectionChanged={i => {
          //this.setState({ SearchResults:i});
          this.itinerary.getItinerary(i).then((i:IItinineraryResponse)=>{
             this.setState({ItineraryResponse:i});
          });
        }}
        
      />
      <h1>Itineraries:</h1>
      <ol>
        {responseList}
        </ol></div>
    }
}