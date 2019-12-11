import * as Enumerable from 'linq';
import { IItineraryService, ItinerariesRequest, ItinerariesResponse, IItinineraryResponse } from "./itinerary";
export interface IItineraryCollectionService{
  getItineraries(getItinerariesRequest: ItinerariesRequest): Promise<ItinerariesResponse>;
} 
export class ItineraryCollectionService implements IItineraryCollectionService{
  constructor(private itinerary: IItineraryService) {
  }
  async getItineraries(getItinerariesRequest: ItinerariesRequest): Promise<ItinerariesResponse> {
    let response = new Array<IItinineraryResponse>();
    for (let result of getItinerariesRequest.searchResults) {
      let itinerary = await this.itinerary.getItinerary({
        startLocation: result.Coords!, searchResults: getItinerariesRequest.searchResults,
        dwellTime: getItinerariesRequest.dwellTime, endLocation: getItinerariesRequest.endLocation
      });
      response.push(itinerary);
    }
    return { 
      itineraries: Enumerable.from(response).orderBy(i=>Enumerable.from(i.instructionSets).max(is=>is.durationMinutes)).select(i=>i).toArray()
  };
}
}
