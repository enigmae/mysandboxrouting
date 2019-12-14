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
      let startDate =new Date(2019,11,17,10,0);
      let endDate =new Date(2019,11,18,22,0);
      
      let itinerary = await this.itinerary.getItinerary({
        startLocation: result.Coords!, searchParams: getItinerariesRequest.searchResults,
        dwellTime: getItinerariesRequest.dwellTime, endLocation: getItinerariesRequest.endLocation,
        startTime:result.startTime, endTime:result.endTime
      });
      response.push(itinerary);
    }
    return { 
      itineraries: Enumerable.from(response).orderBy(i=>Enumerable.from(i.instructionSets).max(is=>is.durationMinutes)).select(i=>i).toArray()
  };
}
}
