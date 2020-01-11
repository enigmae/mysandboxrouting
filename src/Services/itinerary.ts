import { ISearchResult, ILatLong, ISearchParam } from "../Controls/enterLocationControl";
import * as Enumerable from 'linq';
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
export interface missedCity{
  city:string;
  riders:number;
}
export class condensedInstructionSet{
  public totalMiles:number=0;
  public numAgents:number;
  
  constructor(public condensedInstructions:condensedInstruction[], public  endLocationName:string, public durationMinutes:number, public minDistance:number,
  public maxDistance:number,
  public minRouteTime:number,
  public maxRouteTime:number,
  public missedCities?:Array<missedCity>
  ){
    let agentNames = new Set<string>();
    
    for(let i = 0; i<condensedInstructions.length;i++){
      this.totalMiles+=condensedInstructions[i].miles;
      agentNames.add(condensedInstructions[i].agent);
    } 
    this.numAgents = agentNames.size;
  }
}
/*
export class condensedInstructionSetCollection{
  public 
  constructor(public condensedInstructionSets:condensedInstructionSet[]){
   // this.condensedInstructionSets = Enumerable.from(this.condensedInstructionSets).selectMany(i=>i.condensedInstructions).orderBy(i=>i.startTime)
  }
}*/
export interface condensedInstruction{
  agent:string;
  startTime: string;
  endTime?: string;
  miles:number;
  location:string;
  passengers:number;
}
export class instructionSet{
  constructor(agentItinerary:agentItinerary, public endLocationName:string){
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
   let diff = new dateDiff(new Date(this.instructions[this.instructions.length-1].startTime), new Date(this.instructions[2].startTime));
    return diff.minutes();
  }
  recalculateDuration(){
  this.instructions.map(i=> this.adjustTimeFormat(i));
   this.durationMinutes = this.calcMinutes();
  }
  get condensedInstructions():condensedInstruction[]{
    let condensed = new Array<condensedInstruction>();
    var mileCount = 0;
    var first = true;
     let skip = 1;
      if(this.instructions[0].instructionType=="LeaveFromStartPoint" && this.instructions[0].distance)
        {
          skip = 2;
        }
    for(let index = skip; index<this.instructions.length-1;index++){
      let visit = this.instructions[index];
     // let travel = this.instructions[index+1];
      if(visit.instructionType=='VisitLocation'){
      condensed.push({agent:this.agent.name, startTime:visit.startTime, endTime:visit.endTime, location: visit.itineraryItem ? visit.itineraryItem.name : '',
      miles:mileCount, passengers:visit.itineraryItem.quantity[0]});
      }
      else{
        if(first){
          mileCount=0;
          first=false;
          continue;
        }
      mileCount+=visit.distance*0.000621371;
      }
    }
    var arrival = this.instructions[this.instructions.length-1];
    condensed.push({agent:this.agent.name, startTime:arrival.startTime, location: this.endLocationName,
      miles:mileCount, passengers:0})
    return condensed;
  }
}
export interface agentItinerary {
  agent: agent;
  instructions: instruction[];
}
export interface resource {
  agentItineraries: agentItinerary[];
  unscheduledItems:IitineraryItem[];
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
  condensedInstructionSet:condensedInstructionSet;
}
export class ItinineraryResponse implements IItinineraryResponse{
  public instructionSets:instructionSet[];
  public condensedInstructionSet:condensedInstructionSet;
  public citiesVisited:Array<string>;
  public citiesMissed:Array<missedCity>;

  constructor(public resourceSets: resourceSet[], public destinationName:string){
    this.instructionSets = Enumerable.from(this.resourceSets[0].resources[0].agentItineraries).where(i=>i.instructions.length>3).toArray()
    .map(i=> {
          return new instructionSet(i, destinationName);
    });
    var instructionsSetsLinq = Enumerable.from(this.instructionSets);
    var orderedInstructions = instructionsSetsLinq.selectMany(i=>i.condensedInstructions).orderBy(i=>i.startTime).toArray();
    this.citiesVisited = instructionsSetsLinq.selectMany(i=>i.condensedInstructions).selectMany(i=>i.location).distinct().toArray();
    this.citiesMissed = Enumerable.from(this.resourceSets[0].resources[0].unscheduledItems).select(i=> {return {city: i.name, riders:i.quantity[0]}}).toArray();
    var duration = instructionsSetsLinq.min(i=>i.durationMinutes);
    this.condensedInstructionSet = new condensedInstructionSet(orderedInstructions, destinationName, duration, instructionsSetsLinq.min(i=>i.distance), instructionsSetsLinq.max(i=>i.distance),duration, instructionsSetsLinq.max(i=>i.durationMinutes), this.citiesMissed);
  }
   add_minutes(dt:Date, minutes:number):Date {
    return new Date(dt.getTime() + minutes*60000);
  }
  readjustForArrival(date:Date){
    Enumerable.from(this.condensedInstructionSet.condensedInstructions).groupBy(i=>i.agent)
      .forEach(condensedInstructionAgent=>{
          let lastInstruction = condensedInstructionAgent.last();
          let endTime =new Date(lastInstruction.startTime);
          console.log("Readjusting for end time: "+endTime);
          console.log("dateDiff:"+dateDiff);
          let diff:number =  new dateDiff(date, endTime).minutes()-1;
          console.log(`Got difference between '${date}' and ${lastInstruction.startTime} as ${diff}`);
          condensedInstructionAgent.forEach(condensedInstruction=>{
            console.log(`Changing start time for instruction '${condensedInstruction.startTime}'`);
            console.log("Readjusting for instruction set:"+JSON.stringify(condensedInstruction));
            let date = new Date(condensedInstruction.startTime);
            console.log(`Changing start time for instruction date:'${date}'`);
            let addmin = this.add_minutes(date, diff);
            console.log(`Added '${diff}' minutes to ${date}:${addmin}`);
            condensedInstruction.startTime = dateformat(addmin, 'yyyy-mm-ddThh:MM:ss');
            if(condensedInstruction.endTime){
              date = new Date(condensedInstruction.endTime);
              addmin = this.add_minutes(date, diff);
              condensedInstruction.endTime = dateformat(addmin, 'yyyy-mm-ddThh:MM:ss');
              console.log(`Set startTime to ${condensedInstruction.startTime}`);        
            }
      });
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
  endLocationName:string;
  busCapacity:number;
}
export interface IItineraryService{
  getItinerary(
    getItineraryRequest: getItineraryRequest
  ): Promise<IItinineraryResponse>;
}
export interface ItinerariesRequest {
  searchResults: ISearchParam[];
  endLocation: ILatLong;
  endLocationName:string;
  dwellTime: number;
  minBuses:number;
  maxBuses:number;
  busCapacity:number;
}
export interface ItinerariesResponse {
  itineraries:IItinineraryResponse[];
}
