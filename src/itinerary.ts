import * as request from "request-promise";
import { ISearchResult, ILatLong } from "./searchControl";
export interface location {
  latitude: number;
  longitude: number;
}
export interface shift {
  startTime: string;
  endTime: string;
  startLocation: location;
  endLocation: location;
}
export interface IitineraryItem {
  name: string;
  dwellTime: string;
  location: location;
}
export class itineraryItem implements IitineraryItem {
  constructor(
    public name: string,
    public dwellTime: string,
    public location: location
  ) {}
}
export interface agent {
  name: string;
  shifts: shift[];
}
export interface IItineraryRequest {
  agents: agent[];
  itineraryItems: IitineraryItem[];
}
export interface route {
  startLocation: Location;
  endLocatrion: Location;
  startTime: string;
  endTime: string;
  totalTravelDistance: number;
  totalTravelTime: string;
  wayPoints: Location[];
}
export interface instruction {
  instructionType: string;
  distance: number;
  itineraryItem: IitineraryItem;
  startTime: string;
  endTime: string;
  duration: string;
}
export interface agentItinerary {
  agent: agent;
  instructions: instruction[];
}
export interface resource {
  agentItineraries: agentItinerary[];
}
export interface resourceSet {
  resources: resource[];
}
export interface IItinineraryResponse {
  resourceSets: resourceSet[];
}
export class ItineraryRequest implements IItineraryRequest {
  constructor(
    public agents: agent[],
    public itineraryItems: IitineraryItem[]
  ) {}
}
export interface getIntineraryRequest {
  searchResults: ISearchResult[];
  startLocation: ILatLong;
  endLocation: ILatLong;
  dwellTime: number;
}
export class Itinerary {
  async getItinerary(
    getItineraryRequest: getIntineraryRequest
  ): Promise<IItinineraryResponse> {
    var itineraryItems = getItineraryRequest.searchResults.map(
      sr =>
        new itineraryItem(
          sr.SearchResult!,
          "00:" + getItineraryRequest.dwellTime + ":00",
          {
            latitude: sr.Coords!.Lat,
            longitude: sr.Coords!.Long
          }
        )
    );
    var result = await request.post(
      "https://dev.virtualearth.net/REST/V1/Routes/OptimizeItinerary?key=ArLJodQ7fEaQ2dfy3lIHWJrJILC35_Qj0EpT8TCy3ls96pl6sqCdlu18bo8j_tbM",
      {
        resolveWithFullResponse: false,

        json: new ItineraryRequest(
          [
            {
              name: "Kayode",
              shifts: [
                {
                  startTime: "2019-11-16T08:00:00",
                  endTime: "2019-11-16T18:00:00",
                  endLocation: {
                    latitude: getItineraryRequest.endLocation.Lat,
                    longitude: getItineraryRequest.endLocation.Long
                  },
                  startLocation: {
                    latitude: getItineraryRequest.startLocation.Lat,
                    longitude: getItineraryRequest.startLocation.Long
                  }
                }
              ]
            }
          ],
          itineraryItems
        )
      }
    );
    return <IItinineraryResponse>result;
  }
}
