import * as request from "request-promise";
import { IItineraryService, getItineraryRequest, IItinineraryResponse, itineraryItem, ItineraryRequest, ItinineraryResponse } from "./itinerary";
export class ItineraryService implements IItineraryService {
  async getItinerary(getItineraryRequest: getItineraryRequest): Promise<IItinineraryResponse> {
    var itineraryItems = getItineraryRequest.searchResults.map(sr => new itineraryItem(sr.SearchResult!, "00:" + getItineraryRequest.dwellTime + ":00", {
      latitude: sr.Coords!.Lat,
      longitude: sr.Coords!.Long
    }));
    var result = await request.post("https://dev.virtualearth.net/REST/V1/Routes/OptimizeItinerary?key=ArLJodQ7fEaQ2dfy3lIHWJrJILC35_Qj0EpT8TCy3ls96pl6sqCdlu18bo8j_tbM", {
      resolveWithFullResponse: false,
      json: new ItineraryRequest([
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
      ], itineraryItems)
    });
    return new ItinineraryResponse((<IItinineraryResponse>result).resourceSets);
  }
}
