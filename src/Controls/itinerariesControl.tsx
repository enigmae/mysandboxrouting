import * as React from "react";
import DateTimePicker from "react-datetime-picker";
import * as dateMath from 'date-arithmetic';
import {ItinerariesResponse} from '../Services/itinerary';
import { InstructionSummaryControl } from "./instructionSummaryControl";
interface ItinerariesControlState{
    Arrivaltime:Date;
}
export interface ItinerariesControlProps{
    ItinerariesResponse?:ItinerariesResponse;
}
export class ItinerariesControl extends React.Component<ItinerariesControlProps,ItinerariesControlState>{
    constructor(props){
        super(props);
        let endOfToday = dateMath.endOf(new Date(),'day');
        let ninePm = dateMath.add(endOfToday, 20, "hours");
        let subtractDay = dateMath.add(ninePm, -1, "day");
     
        this.state = {  Arrivaltime: dateMath.add(subtractDay, 1, "minutes")};
        this.handleArrivalTimeChanged = this.handleArrivalTimeChanged.bind(this);
     }
    handleArrivalTimeChanged(date:Date){
        this.setState({Arrivaltime:date});
      }
render(){
    if(!this.props.ItinerariesResponse)
        return <div/>
        let responseList;
        let instructionList  = this.props.ItinerariesResponse.itineraries.map(m=>
        <li><InstructionSummaryControl instructionSet = {m.instructionSets[0]}/></li>);
         responseList = <ol>{instructionList}</ol>;
    return <div>
        <h1>Itineraries:</h1>
        <ol>{responseList}</ol>
  </div>
}

}