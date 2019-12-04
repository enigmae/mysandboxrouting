import * as React from "react";
import { instruction, instructionSet } from "./itinerary";
export interface InstructionControlProps{
    instructions:instructionSet
}
export class InstructionControl extends React.Component<InstructionControlProps>{
    render(){
        return this.props.instructions.instructions.map(
            i => {
              let loc;
              let place;
              let endtime;
              let duration;
              if (i.itineraryItem) {
                loc =
                  "Location:(" +
                  i.itineraryItem.location.latitude +
                  ", " +
                  i.itineraryItem.location.longitude +
                  ")";
                if (i.itineraryItem.name) {
                  place = (
                    <span>
                      <b>Place:</b>
                      <label>{i.itineraryItem.name}</label>
                    </span>
                  );
                }
              }
              if (i.endTime) {
                endtime = (
                  <span>
                    <b>EndTime:</b> {i.endTime}
                  </span>
                );
              }
              if (i.duration) {
                duration = (
                  <span>
                    {" "}
                    <b>Duration:</b>
                    {i.duration}
                  </span>
                );
              }
              return (
                <li key={i.startTime + i.instructionType}>
                  <b>Start:</b>
                  {i.startTime} {place}
                  <br />
                  <b> Type:</b>
                  {i.instructionType} {endtime} {duration}
                </li>
              );
            }
          );
    }
}