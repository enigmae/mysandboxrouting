import * as request from "request-promise";
import dateformat from 'dateformat';
import {Semaphore} from 'await-semaphore';
import { IItineraryService, getItineraryRequest, IItinineraryResponse, itineraryItem, ItineraryRequest, ItinineraryResponse } from "./itinerary";
export class ItineraryService implements IItineraryService {
  semaphore = new Semaphore(7);
  constructor(private key:string='ArLJodQ7fEaQ2dfy3lIHWJrJILC35_Qj0EpT8TCy3ls96pl6sqCdlu18bo8j_tbM'){
    
  }
  async getItinerary(getItineraryRequest: getItineraryRequest): Promise<IItinineraryResponse> {
    var itineraryItems = getItineraryRequest.searchParams.map(sr => new itineraryItem(sr.SearchResult!, "00:" + getItineraryRequest.dwellTime + ":00", {
      latitude: sr.Coords!.Lat,
      longitude: sr.Coords!.Long, 
    },[sr.Riders!]));
    /*itineraryItems.push(new itineraryItem('Destination', "00:15:00", {
      latitude: getItineraryRequest.endLocation.Lat,
      longitude: getItineraryRequest.endLocation.Long
    }, '2019-11-16T16:00:00', '2019-11-16T18:00:00'));*/
    console.log("Searching for start time:"+getItineraryRequest.startTime);
    let startTime = getItineraryRequest.startTime==undefined? "2019-11-16T08:00:00" : dateformat(getItineraryRequest.startTime, 'yyyy-mm-ddThh:MM:ss');
    let endTime = getItineraryRequest.endTime==undefined?"2019-11-16T18:00:00" : dateformat(getItineraryRequest.endTime, 'yyyy-mm-ddThh:MM:ss');
    startTime = startTime.replace('P', 'T').replace('A','T');
    endTime = endTime.replace('P', 'T').replace('A','T');
    var agents = new Array();
    var maxAgents = getItineraryRequest.numAgents;
    //TODO:Change for biz version
    if(getItineraryRequest.numAgents>3){
      maxAgents = 3;
    }
    for(var agentCount=0; agentCount<maxAgents; agentCount++){
      agents.push({
          capacity:[getItineraryRequest.busCapacity],
          name: 'Agent_'+agentCount,
          shifts: [
            {
              startTime: startTime,
              endTime: endTime,
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
        });
    }
    
   /* var result = await request.post("https://dev.virtualearth.net/REST/V1/Routes/OptimizeItinerary?key="+this.key, {
      resolveWithFullResponse: false,
      json: new ItineraryRequest(agents, itineraryItems)
    });*/
    var release = await this.semaphore.acquire();
     var result = await request.post("https://dev.virtualearth.net/REST/V1/Routes/OptimizeItineraryAsync?key="+this.key, {
      resolveWithFullResponse: false,
      json: new ItineraryRequest(agents, itineraryItems)
    });
    var itineraryResponse = (<IItinineraryResponse>result);
     console.log(JSON.stringify(itineraryResponse));
    
    var callbackUrl = itineraryResponse.resourceSets[0].resources[0].callbackUrl;
    var callbackTimeout = itineraryResponse.resourceSets[0].resources[0].callbackInSeconds;
    if(callbackUrl){
    let promiseGetResponse = new Promise<IItinineraryResponse>((resolve, reject) => {
    let wait;
    var onTimeout =async () => {
    console.log('invoking callback url');
    
      result = await request.get(callbackUrl);
      itineraryResponse = (<IItinineraryResponse>JSON.parse(result));
     callbackUrl = itineraryResponse.resourceSets[0].resources[0].callbackUrl;
      console.log(JSON.stringify(itineraryResponse));
      if(!callbackUrl)
        {
          clearTimeout(wait);
          resolve(itineraryResponse);
        }
        else{
          wait = setTimeout(onTimeout, callbackTimeout*1000);
        }
    };
    wait = setTimeout(onTimeout, callbackTimeout*1000);
    });
     return promiseGetResponse.then(i=> {
       return new ItinineraryResponse((<IItinineraryResponse>JSON.parse(result)).resourceSets, getItineraryRequest.endLocationName);
     }).finally(()=> release());
    }
   release();
    return new ItinineraryResponse((<IItinineraryResponse>result).resourceSets, getItineraryRequest.endLocationName);
  }
}
