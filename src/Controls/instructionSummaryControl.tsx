import * as React from 'react';
import { instructionSet } from '../Services/itinerary';
import { totalmem } from 'os';

export interface IInstructionSummaryControlProps{
    instructionSet:instructionSet;
}
export interface IInstructionSummaryControlState{
    collapsed?:boolean;
    totalHours:number;
    totalMinutes:number;
    totalDistance:number;
}
export class InstructionSummaryControl extends React.Component<IInstructionSummaryControlProps, IInstructionSummaryControlState>{
    constructor(props){
        super(props);
        let collapsed ={collapsed:true};
 
        this.state = {...collapsed, ...this.calculateState()};
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
        let showExpand = 
        return <div>
            Total Time:{this.state.totalHours} hrs {this.state.totalMinutes.toFixed()} min Total Distance:{this.props.instructionSet.distance.toFixed(1)} mi
        </div>;
    }
}