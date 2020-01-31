import * as Enumerable from 'linq';
import { IItineraryService, ItinerariesRequest, ItinerariesResponse, IItinineraryResponse } from "./itinerary";
import { ISearchParam, ISearchResult } from '../Controls/enterLocationControl';
export interface IItineraryCollectionService{
  getItineraries(getItinerariesRequest: ItinerariesRequest): Promise<ItinerariesResponse>;
} 
export class ItineraryCollectionService implements IItineraryCollectionService{
  constructor(private itinerary: IItineraryService) {
  }
   addExtraStops(getItinerariesRequest:ItinerariesRequest){
      let additionalStops = new Array<ISearchParam>();
      let minBusCapacity = Enumerable.from(getItinerariesRequest.busCapacities).min();
      for(let searchResult of getItinerariesRequest.searchResults){
        if(searchResult.Riders!>minBusCapacity){
          let riders = searchResult.Riders!;
          let numAdditionalStops = Math.floor(riders/minBusCapacity);
          let leftOver = riders%minBusCapacity;
          if(leftOver==0){
            numAdditionalStops--;
          }
          searchResult.Riders = minBusCapacity;
          let additionalStop = {...searchResult};
          for(let addStops = 1; addStops<=numAdditionalStops; addStops++){
            additionalStops.push({...additionalStop});
          }
          if(leftOver!=0){
            additionalStops[additionalStops.length-1].Riders = leftOver;
          }
        }
      }
      additionalStops.forEach(i=> getItinerariesRequest.searchResults.push(i));
   }
  async getItineraries(getItinerariesRequest: ItinerariesRequest): Promise<ItinerariesResponse> {
    this.addExtraStops(getItinerariesRequest);
    let response = new Array<Promise<IItinineraryResponse>>();
    for(var numAgents = 1; numAgents<= getItinerariesRequest.busCapacities.length; numAgents++){
    for (let result of Enumerable.from(getItinerariesRequest.searchResults).where(i=>i.Riders!>0)) {
      let startDate =new Date(2019,11,17,10,0);
      let endDate =new Date(2019,11,18,22,0);
      
      let itinerary = this.itinerary.getItinerary({numAgents:numAgents,endLocationName:getItinerariesRequest.endLocationName,
        startLocation: result.Coords!, searchParams: getItinerariesRequest.searchResults,
        dwellTime: getItinerariesRequest.dwellTime, endLocation: getItinerariesRequest.endLocation,
        startTime:result.StartTime, endTime:result.EndTime, busCapacities:getItinerariesRequest.busCapacities
      });
      response.push(itinerary);
    }
    }
    let responses = new Array<IItinineraryResponse>();
    await Promise.all(response.map(m=>m.then(r=>responses.push(r))));
    let keys = new Set<string>();
    let responsesFiltered = new Array<IItinineraryResponse>();
    for(let response of responses){
      let key = response.condensedInstructionSet.durationMinutes+'_'+response.condensedInstructionSet.totalMiles+'_'+response.condensedInstructionSet.condensedInstructions.length;
      if(!keys.has(key)){
        responsesFiltered.push(response);
        keys.add(key);
      }
    }
    
    let returnedValue = {
      itineraries: Enumerable.from(responsesFiltered).
        where(i=>i.instructionSets!==undefined)
        .orderByDescending(i=>i.instructionSets.length)
        .thenBy(i=>i.instructionSets.length>0 ? Enumerable.from( i.instructionSets).max(m=>m.durationMinutes): 0).select(i=>i).toArray()
  };
  return returnedValue;
}
}
