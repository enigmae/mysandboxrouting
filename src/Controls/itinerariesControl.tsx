import * as React from "react";
import * as dateMath from "date-arithmetic";
import { ItinerariesResponse, IItinineraryResponse } from "../Services/itinerary";
import { InstructionSummaryControl } from "./instructionSummaryControl";

interface ItinerariesControlState {
    Arrivaltime: Date;
}

export interface ItinerariesControlProps {
    ItinerariesResponse?: ItinerariesResponse;
}

export class ItinerariesControl extends React.Component<ItinerariesControlProps, ItinerariesControlState> {
    constructor(props) {
        super(props);
        const endOfToday = dateMath.endOf(new Date(), "day");
        const ninePm = dateMath.add(endOfToday, 20, "hours");
        const subtractDay = dateMath.add(ninePm, -1, "day");
        this.state = { Arrivaltime: dateMath.add(subtractDay, 1, "minutes") };
        this.handleArrivalTimeChanged = this.handleArrivalTimeChanged.bind(this);
    }

    handleArrivalTimeChanged(date: Date) {
        this.setState({ Arrivaltime: date });
    }

    render() {
        if (!this.props.ItinerariesResponse)
            return <div/>;
        let responseList: Object;
        var filteredItineraries:{[id:string]:IItinineraryResponse} = {};
        var values = new Array<IItinineraryResponse>();
        this.props.ItinerariesResponse.itineraries.forEach(i=>{
          if(filteredItineraries[i.condensedInstructionSet.key]){
            return;
          }
          values.push(i);
          filteredItineraries[i.condensedInstructionSet.key] = i;
        });
        const instructionList = values.map(m =>
            <li>
                <InstructionSummaryControl condensedInstructionSet={m.condensedInstructionSet}/>
            </li>);
        responseList = <ol>{instructionList}</ol>;
        return <div>
                   <h1>Itineraries:</h1>
                   <ol>{responseList}</ol>
               </div>;
    }
}