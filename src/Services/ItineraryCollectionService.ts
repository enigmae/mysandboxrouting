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
    for(var numAgents = 1; numAgents<= getItinerariesRequest.searchResults.length;numAgents++){
    for (let result of getItinerariesRequest.searchResults) {
      let startDate =new Date(2019,11,17,10,0);
      let endDate =new Date(2019,11,18,22,0);
      
      let itinerary = await this.itinerary.getItinerary({numAgents:numAgents,
        startLocation: result.Coords!, searchParams: getItinerariesRequest.searchResults,
        dwellTime: getItinerariesRequest.dwellTime, endLocation: getItinerariesRequest.endLocation,
        startTime:result.StartTime, endTime:result.EndTime
      });
      response.push(itinerary);
    }
    }
    return { 
      itineraries: Enumerable.from(response).orderByDescending(i=>i.instructionSets.length).thenBy(i=>Enumerable.from( i.instructionSets).max(m=>m.durationMinutes)).select(i=>i).toArray()
  };
}
}
