import * as React from "react";
import { instruction, instructionSet, condensedInstruction, condensedInstructionSet } from "../Services/itinerary";
import * as linq from "linq";
import { RadioGroup, RadioButton } from 'react-radio-buttons';
export interface InstructionControlProps {
    condensedInstructions: condensedInstructionSet;
}
class HoursMinutes {
    hours: number;
    minutes: number;
    constructor(totalMinutes: number) {
        this.hours = Math.floor(totalMinutes / 60);
        this.minutes = Math.round(totalMinutes % 60 + 0);
    }
}
export class ItineraryViewType {
    static Arrival = "Arrival";
    static Bus = "Bus;"
}
export interface ItineraryInstructionsControlState {
    ViewType: string;
}
export class ItineraryInstructionsControl extends React.Component<InstructionControlProps, ItineraryInstructionsControlState>{
    constructor(props) {
        super(props);
        this.handleArrivalViewTypeChanged = this.handleArrivalViewTypeChanged.bind(this);
        this.handleBusViewTypeChanged = this.handleBusViewTypeChanged.bind(this);
        this.state = { ViewType: ItineraryViewType.Arrival };
        this.renderByBus = this.renderByBus.bind(this);
        this.renderByArrival = this.renderByArrival.bind(this);
        this.handleViewTypeChanged = this.handleViewTypeChanged.bind(this);
    }
    formatDate(date: string) {
        if (!date)
            return '';
        return new Date(this.fixAMPM(date)).toLocaleDateString();
    }
    formatTime(date: string) {
        if (!date)
            return '';
        return new Date(this.fixAMPM(date)).toLocaleTimeString();
    }
    fixAMPM(date: string) {
        if (date.includes('P')) {
            return date.replace('P', ' ') + ' PM';
        }
        if (date.includes('A')) {
            return date.replace('A', ' ') + ' AM';
        }
        return date;
    }
    handleArrivalViewTypeChanged(e) {
        this.setState({ ViewType: ItineraryViewType.Arrival });
    }
    handleBusViewTypeChanged(e) {
        this.setState({ ViewType: ItineraryViewType.Bus });
    }
    renderByArrival() {
        let instructionRenders = linq.from(this.props.condensedInstructions.condensedInstructions)
            .orderBy(i => new Date(this.fixAMPM(i.startTime)).valueOf()).toArray().map(
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
                    leave = <td>{i.endTime ? this.formatDate(i.endTime) : ''}&nbsp;{i.endTime
                                ? this.formatTime(i.endTime)
                                : ''}</td>;
                    quantity = <td>{i.passengers}</td>;
                    miles = <td>{i.miles.toFixed(2)}</td>;
                    return <tr>{agent}{location}{arrive}{leave}{quantity}{miles}</tr>;
                }
            );
        return instructionRenders;
    }

    renderByBus() {
        let instructionRenders = linq.from(this.props.condensedInstructions.condensedInstructions)
            .orderBy(i => i.agent).thenBy(i => new Date(this.fixAMPM(i.startTime)).valueOf()).toArray().map(i => {
                let quantity;
                let agent;
                let location;
                let arrive;
                let leave;
                let miles;
                agent = <td>{i.agent}</td>;
                location = <td>{i.location}</td>;
                arrive = <td>{this.formatDate(i.startTime)}&nbsp;{this.formatTime(i.startTime)}</td>;
                leave = <td>{i.endTime ? this.formatDate(i.endTime) : ''}&nbsp;{i.endTime
                            ? this.formatTime(i.endTime)
                            : ''}</td>;
                quantity = <td>{i.passengers}</td>;
                miles = <td>{i.miles.toFixed(2)}</td>;
                return <tr>{agent}{location}{arrive}{leave}{quantity}{miles}</tr>;
            });
        return instructionRenders;
    }
    handleViewTypeChanged(e) {
        this.setState({ViewType:e.target.value});
    }
    render() {
        let minHoursMinutes = new HoursMinutes(this.props.condensedInstructions.minRouteTime);
        let maxHoursMinutes = new HoursMinutes(this.props.condensedInstructions.maxRouteTime);
        let fullSummary =
            `Min Dist:${this.props.condensedInstructions.minDistance.toFixed(1)} mi Max Dist:${
            this.props.condensedInstructions.maxDistance.toFixed(1)} mi Min Time:${minHoursMinutes.hours} hrs ${
            minHoursMinutes.minutes} min Max Time:${maxHoursMinutes.hours} hrs ${maxHoursMinutes.minutes} min`;
        let orderByStartTimes = linq.from(this.props.condensedInstructions.condensedInstructions).orderBy(i => {
            let orderby = new Date(this.fixAMPM(i.startTime)).valueOf();
            return orderby;
        }).toArray();
        /* if (orderByStartTimes[orderByStartTimes.length - 1].location == "1500 Southwest 8th Street") {
             console.log(JSON.stringify(orderByStartTimes));
         }*/
        let instructionRenders = this.state.ViewType === ItineraryViewType.Arrival ? this.renderByArrival() : this.renderByBus();
        return <div>
            <h3>{fullSummary}</h3>
            <div>
                <h4>View By</h4>
                <select onChange={this.handleViewTypeChanged} value={this.state.ViewType}>
                    <option value="Arrival" selected={true}>Arrival</option>
                    <option value="Bus">Bus</option>
                </select>
                </div>
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
            </table></div>;
    }
}