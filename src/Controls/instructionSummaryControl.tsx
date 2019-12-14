import * as React from 'react';
import { instructionSet } from '../Services/itinerary';
import { totalmem } from 'os';
import { ItineraryInstructionsControl } from './itineraryInstructionsControl';
import Collapsible from 'react-collapsible';
export interface IInstructionSummaryControlProps{
    instructionSet:instructionSet;
}
export interface IInstructionSummaryControlState{
    collapsed?:boolean;
    totalHours:number;
    totalMinutes:number;
    totalDistance:number;
    startingPoint:string;
}
export class InstructionSummaryControl extends React.Component<IInstructionSummaryControlProps, IInstructionSummaryControlState>{
    constructor(props){
        super(props);
        let collapsed ={collapsed:true};
 
        this.state = {...collapsed, ...this.calculateState(), startingPoint:this.props.instructionSet.instructions[2].itineraryItem.name};
    }
    calculateState(){
        let calc = {totalHours:Math.floor(this.props.instructionSet.durationMinutes/60), 
            totalMinutes:this.props.instructionSet.durationMinutes%60, totalDistance:this.props.instructionSet.distance};
        return calc;
    }
    componentDidUpdate(){
        let calc = this.calculateState();
            if(this.state.totalDistance!=calc.totalDistance || this.state.totalHours!=calc.totalHours || this.state.totalMinutes!=calc.totalMinutes){
                this.setState(calc);        
            }
        }
    render(){
        let fullSummary = `Total Time:${this.state.totalHours} hrs ${this.state.totalMinutes.toFixed()} min Total Distance:${this.props.instructionSet.distance.toFixed(1)} mi Starting Point:${this.props.instructionSet.instructions[2].itineraryItem.name}`;
        return <Collapsible trigger={fullSummary}>
            <ItineraryInstructionsControl instructions={this.props.instructionSet}/>
        </Collapsible>;
    }
}