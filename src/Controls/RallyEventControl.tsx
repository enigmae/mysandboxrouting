import * as React from "react";
import {rallyService, rallyTrip} from '../Services/rallyService';
export interface rallyEventControlState{
    eventId:string;
}
export interface rallyEventControlProps{
    rallyTripReceived:(rallyTrips:rallyTrip[])=>void;
}
var rallySvc = new rallyService();
export class RallyEventControl extends React.Component<rallyEventControlProps,rallyEventControlState>{
    constructor(props){
        super(props);
        this.handleEventIdChanged = this.handleEventIdChanged.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {eventId:''};
    }
    handleEventIdChanged(e){
        this.setState({eventId: e.target.value});
    }
    handleSubmit(){
        rallySvc.getTrips(this.state.eventId).then((trip)=> this.props.rallyTripReceived(trip));
    }
    render(){
        return <div>
            <label>Enter Rally Event Id:</label><input value={this.state.eventId} onChange={this.handleEventIdChanged} /><button onClick={this.handleSubmit}>Submit</button>
        </div>
    }
}