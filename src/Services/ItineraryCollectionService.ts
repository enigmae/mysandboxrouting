import { IItineraryService, getItinerariesRequest, getItinerariesResponse, IItinineraryResponse } from "./itinerary";
export interface IItineraryCollectionService{
  getItineraries(getItinerariesRequest: getItinerariesRequest): Promise<getItinerariesResponse>;
} 
export class ItineraryCollectionService implements IItineraryCollectionService{
  constructor(private itinerary: IItineraryService) {
  }
  async getItineraries(getItinerariesRequest: getItinerariesRequest): Promise<getItinerariesResponse> {
    let response = new Array<IItinineraryResponse>();
    for (let result of getItinerariesRequest.searchResults) {
      let itinerary = await this.itinerary.getItinerary({
        startLocation: result.Coords!, searchResults: getItinerariesRequest.searchResults,
        dwellTime: getItinerariesRequest.dwellTime, endLocation: getItinerariesRequest.endLocation
      });
      response.push(itinerary);
    }
    return { itineraries: response };
  }
}
