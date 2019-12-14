import { ISearchResult, ILatLong, ISearchParam } from "../searchControl";
import dateDiff from 'date-diff'; 
import { setupMaster } from "cluster";
export interface location {
  latitude: number;
  longitude: number;
}
export interface shift {
  startTime?: string;
  endTime?: string;
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
    public location: location,
    public openingTime?:string,
    public closingTime?:string,
    public startingTime?:string
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
export class instructionSet{
  constructor(agentItinerary:agentItinerary){
    this.instructions = agentItinerary.instructions;
    this.agent = agentItinerary.agent;
    this.distance = this.calcdistance();
    this.durationMinutes = this.calcMinutes();
  }
  agent:agent;
  instructions:instruction[];
  distance:number;
  durationMinutes:number;
  private calcdistance(){
    let sum =0;
    for(let i = 0; i<this.instructions.length;i++){
      if(this.instructions[i].distance)
        {
          sum+=this.instructions[i].distance;
        }
    }
    return sum*0.000621371;
  }
  private calcMinutes(){

   let diff = new dateDiff(new Date(this.instructions[this.instructions.length-1].startTime), new Date(this.instructions[0].startTime));
    // let minutes = dateMath.subtract(new Date(this.instructions[0].startTime), new Date(this.instructions[this.instructions.length-1].endTime), "minutes");
    //return minutes;
  return diff.minutes();
  }
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
  instructionSets:instructionSet[];
}
export class ItinineraryResponse implements IItinineraryResponse{
  constructor(public resourceSets: resourceSet[]){

  }
  get instructionSets():instructionSet[]{
    return this.resourceSets[0].resources[0].agentItineraries.map(i=> new instructionSet(i));
  }
}
export class ItineraryRequest implements IItineraryRequest {
  constructor(
    public agents: agent[],
    public itineraryItems: IitineraryItem[]
  ) {}
}
export interface getItineraryRequest {
  searchParams: ISearchParam[];
  startLocation: ILatLong;
  endLocation: ILatLong;
  dwellTime: number;
  startTime:Date;
  endTime:Date;
}
export interface IItineraryService{
  getItinerary(
    getItineraryRequest: getItineraryRequest
  ): Promise<IItinineraryResponse>;
}
export interface ItinerariesRequest {
  searchResults: ISearchParam[];
  endLocation: ILatLong;
  dwellTime: number;
}
export interface ItinerariesResponse {
  itineraries:IItinineraryResponse[];
}
