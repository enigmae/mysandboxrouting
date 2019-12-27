import { ISearchResult, ILatLong, ISearchParam } from "../Controls/enterLocationControl";

import * as addsubtractdate from 'add-subtract-date';
import dateformat from 'dateformat';
var dateDiff = require('date-diff');
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
  quantity:Array<number>;
}
export class itineraryItem implements IitineraryItem {
  constructor(
    public name: string,
    public dwellTime: string,
    public location: location,
    public quantity:Array<number>,
    public openingTime?:string,
    public closingTime?:string,
    public startingTime?:string,
    
  ) {}
}
export interface agent {
  name: string;
  capacity:Array<number>;
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
  pickupRiders:number;
}
export class instructionSet{
  constructor(agentItinerary:agentItinerary){
    this.instructions = agentItinerary.instructions;
    this.agent = agentItinerary.agent;
    this.distance = this.calcdistance();
    this.durationMinutes = this.calcMinutes();
     this.instructions.map(i=> this.adjustTimeFormat(i));
  }
  agent:agent;
  instructions:instruction[];
  get startingPoint():string{
    return this.instructions[2].itineraryItem.name;
  }
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
  private adjustTimeFormat(instruction:instruction){
    instruction.startTime = instruction.startTime.replace('P', 'T').replace('A','T');
  }
  private calcMinutes(){
   let diff = new dateDiff(new Date(this.instructions[this.instructions.length-1].startTime), new Date(this.instructions[0].startTime));
    return diff.minutes();
  }
  recalculateDuration(){
  this.instructions.map(i=> this.adjustTimeFormat(i));
   this.durationMinutes = this.calcMinutes();
  }
}
export interface agentItinerary {
  agent: agent;
  instructions: instruction[];
}
export interface resource {
  agentItineraries: agentItinerary[];
  callbackUrl:string;
  callbackInSeconds:number;
}
export interface resourceSet {
  resources: resource[];
}
export interface IItinineraryResponse {
  resourceSets: resourceSet[];
  instructionSets:instructionSet[];
  readjustForArrival(date:Date);
}
export class ItinineraryResponse implements IItinineraryResponse{
  constructor(public resourceSets: resourceSet[]){

  }
  get instructionSets():instructionSet[]{
    return this.resourceSets[0].resources[0].agentItineraries.map(i=> new instructionSet(i));
  }
   add_minutes(dt:Date, minutes:number):Date {
    return new Date(dt.getTime() + minutes*60000);
  }
  readjustForArrival(date:Date){
    this.instructionSets.forEach(instructionSet=>{
      console.log("Readjusting for instruction set:"+JSON.stringify(instructionSet));
    
    let lastInstruction = instructionSet.instructions[instructionSet.instructions.length-1]; 
    var endTime =new Date(lastInstruction.startTime);
    console.log("Readjusting for end time: "+endTime);
    console.log("dateDiff:"+dateDiff);
    let diff:number =  new dateDiff(date, endTime).minutes()+1;
    console.log(`Got difference between '${date}' and ${lastInstruction.startTime} as ${diff}`);
    
    instructionSet.instructions.forEach(instruction=>{
       console.log(`Changing start time for instruction '${instruction.startTime}'`);
   
      let date = new Date(instruction.startTime);
        console.log(`Changing start time for instruction date:'${date}'`);
      let addmin = this.add_minutes(date, diff);
      console.log(`Added '${diff}' minutes to ${date}:${addmin}`);
      instruction.startTime = dateformat(addmin, 'yyyy-mm-ddThh:MM:ss');
      
      if(instruction.endTime){
        date = new Date(instruction.endTime);
        addmin = this.add_minutes(date, diff);
       instruction.endTime = dateformat(addmin, 'yyyy-mm-ddThh:MM:ss');
     }    
          console.log(`Set startTime to ${instruction.startTime}`);
    });
    instructionSet.recalculateDuration();
  });
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
  startTime?:Date;
  endTime?:Date;
  numAgents:number;
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
