
import * as request from "request-promise";
import { ISearchResult } from "./searchControl";
export interface location{
    latitude:number;
    longitude:number;
}
export interface shift{
    startTime:string;
    endTime:string;
    startLocation:location;
    endLocation:location;
}
export interface IitineraryItem{
    name:string;
    dwellTime:string;
    location:location;
}
export class itineraryItem implements IitineraryItem{
    constructor(public name:string, public dwellTime:string, public location:location){

    }
}
export interface agent{
    name:string;
    shifts:shift[];
}
export interface IItineraryRequest{
    agents:agent[];
    itineraryItems:IitineraryItem[];
}
export interface route{
    startLocation:Location;
    endLocatrion:Location;
    startTime:string;
    endTime:string;
    totalTravelDistance:number;
    totalTravelTime:string;
    wayPoints:Location[];
}
export interface instruction{
    instructionType:string;
    distance:number;
    itineraryItem:IitineraryItem;
    startTime:string;
    endTime:string;
    duration:string;
}
export interface agentItinerary{
    agent:agent;
    instructions:instruction[]
}
export interface resource{
    agentItineraries:agentItinerary[];
}
export interface resourceSet{
    resources:resource[];
}
export interface IItinineraryResponse{
    resourceSets:resourceSet[];
}
export class ItineraryRequest implements IItineraryRequest{
    constructor(public agents:agent[], public itineraryItems:IitineraryItem[]){

    }
}
export class Itinerary{

    async getItinerary(searchResults:ISearchResult[]):Promise<IItinineraryResponse>{
        var itineraryItems = searchResults.map(sr=> new itineraryItem(sr.SearchResult!,'00:15:00',{latitude:sr.Coords!.Lat, longitude:sr.Coords!.Long}));
        var result = await request.post('https://dev.virtualearth.net/REST/V1/Routes/OptimizeItinerary?key=ArLJodQ7fEaQ2dfy3lIHWJrJILC35_Qj0EpT8TCy3ls96pl6sqCdlu18bo8j_tbM', {resolveWithFullResponse:false,
        
        json:new ItineraryRequest([{name:'Kayode', shifts:[{startTime:'2019-11-16T08:00:00', endTime:'2019-11-16T18:00:00', 
        endLocation:
        {latitude:25.7806727, longitude:-80.2044578},startLocation:
        {latitude:25.7806727, longitude:-80.2044578}
    }]}], itineraryItems)
    });
    return <IItinineraryResponse>result;
    }
}