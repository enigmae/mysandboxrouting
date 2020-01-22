import * as React from 'react';
import { instructionSet, condensedInstructionSet } from '../Services/itinerary';
import { totalmem } from 'os';
import { ItineraryInstructionsControl } from './itineraryInstructionsControl';
import Collapsible from 'react-collapsible';
export interface IInstructionSummaryControlProps{
    condensedInstructionSet:condensedInstructionSet;
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
 
        this.state = {...collapsed, ...this.calculateState(), startingPoint:''};
    }
    calculateState(){
        let calc = {totalHours:Math.floor(this.props.condensedInstructionSet.durationMinutes/60), 
            totalMinutes:this.props.condensedInstructionSet.durationMinutes%60, totalDistance:this.props.condensedInstructionSet.totalMiles};
        return calc;
    }
    componentDidUpdate(){
        let calc = this.calculateState();
            if(this.state.totalDistance!=calc.totalDistance || this.state.totalHours!=calc.totalHours || this.state.totalMinutes!=calc.totalMinutes){
                this.setState(calc);        
            }
        }
    render(){
        let citiesMissed='';
        if(this.props.condensedInstructionSet.missedCities && this.props.condensedInstructionSet.missedCities.length>0){
            citiesMissed=' Cities Missed:[';
            for(let missed of this.props.condensedInstructionSet.missedCities){
                citiesMissed+=missed.city+` - Riders: ${missed.riders}, `;
            }
            citiesMissed = citiesMissed.substr(0, citiesMissed.length-2);
            citiesMissed+=']';
        }
         
        let fullSummary = `Total Time:${this.state.totalHours} hrs ${this.state.totalMinutes.toFixed()} min Total Distance:${this.props.condensedInstructionSet.totalMiles.toFixed(1)} mi #Buses:${this.props.condensedInstructionSet.numAgents} Min Dist:${this.props.condensedInstructionSet.minDistance.toFixed(1)} mi Max Dist:${this.props.condensedInstructionSet.maxDistance.toFixed(1)} mi ${citiesMissed}`;
        return <Collapsible trigger={fullSummary}>
                <ItineraryInstructionsControl condensedInstructions={this.props.condensedInstructionSet}/>
            </Collapsible>
    }
}