import * as React from "react";
import { instruction, instructionSet, condensedInstruction, condensedInstructionSet } from "../Services/itinerary";
import * as linq from "linq";
export interface InstructionControlProps{
    condensedInstructions:condensedInstructionSet;
}
class HoursMinutes{
    hours:number;
    minutes:number;
    constructor(totalMinutes:number){
        this.hours = Math.floor(totalMinutes/60);
        this.minutes = Math.round(totalMinutes%60+0);
    }
}
export class ItineraryInstructionsControl extends React.Component<InstructionControlProps>{
  formatDate(date:string){
    if(!date)
    return '';
    return new Date(this.fixPM(date)).toLocaleDateString();
  }
  formatTime(date:string){
    if(!date)
    return '';
    return new Date(this.fixPM(date)).toLocaleTimeString();
  }
  fixPM(date:string){
    if(date.includes('P')){
      return date.replace('P', ' ')+' PM';
      }
      return date;
  }
    render(){
      let minHoursMinutes = new HoursMinutes(this.props.condensedInstructions.minRouteTime);
        let maxHoursMinutes = new HoursMinutes(this.props.condensedInstructions.maxRouteTime);
         let fullSummary = `Min Dist:${this.props.condensedInstructions.minDistance.toFixed(1)} mi Max Dist:${this.props.condensedInstructions.maxDistance.toFixed(1)} mi Min Time:${minHoursMinutes.hours} hrs ${minHoursMinutes.minutes} min Max Time:${maxHoursMinutes.hours} hrs ${maxHoursMinutes.minutes} min`;
       
        let instructionRenders = linq.from(this.props.condensedInstructions.condensedInstructions).toArray().map(
            (i) => {
              let loc;
              let place;
              let endtime;
              let duration;
              let quantity;
              let agent;
              let location;
              let arrive;
              let leave;
              let miles;
              agent = <td>{i.agent}</td>;
              location = <td>{i.location}</td>;
              arrive = <td>{this.formatDate(i.startTime)}&nbsp;{this.formatTime(i.startTime)}</td>;
              leave = <td>{i.endTime ? this.formatDate(i.endTime) :''}&nbsp;{i.endTime ? this.formatTime(i.endTime) :''}</td>;
              quantity =<td>{i.passengers}</td>;
              miles = <td>{i.miles.toFixed(2)}</td>;
              return <tr>{agent}{location}{arrive}{leave}{quantity}{miles}</tr>;
            }
          );
        return <div>
        <h3>{fullSummary}</h3>
        <table>
    <tr>
    <th>Agent</th>
    <th>Location</th>
    <th>Arrive</th>
    <th>Leave</th>
    <th># Riders</th>
    <th>Miles</th>
  </tr>
    {instructionRenders}
    </table></div>
    }
}