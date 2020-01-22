import * as React from "react";
import * as NumericInput from "react-numeric-input";
import update from 'immutability-helper';
import { Guid } from 'guid-typescript';
export interface IBusCapacityControlProps{
    handleBusCapacityChanged:(capacities:Array<CapacityKey>)=>void;
    maxBuses?:number;
}
export interface CapacityKey{
    capacity:number;
    key:string;
    index:number;
}
export interface IBusCapacityControlState{
    capacities:Array<CapacityKey>;
}
export class BusCapacityControl extends React.Component<IBusCapacityControlProps, IBusCapacityControlState>{
    constructor(props:IBusCapacityControlProps){
        super(props);
        this.handleBusCapacityChanged = this.handleBusCapacityChanged.bind(this);
        this.handleAddBus = this.handleAddBus.bind(this);
        let state ={capacities:new Array()};
        state.capacities.push({capacity:50, key:Guid.create().toString(), index:0});
        this.state = state;
    }
    handleBusCapacityChanged(e, cap){
        var state = this.state;
        state = update(state, {capacities:{[cap.index]:{$set:{capacity: e, index:cap.index, key:cap.key}}}});
        this.setState(state, ()=>this.props.handleBusCapacityChanged(this.state.capacities));
    }
    handleAddBus(){
        var state = this.state;
        const initialArray = [1, 2, 3];
        const newArray = update(initialArray, {$push: [4]});
        state = update(state, {capacities:{$push:[{capacity:50, key:Guid.create.toString(), index:this.state.capacities.length}]}});
        this.setState(state, ()=>this.props.handleBusCapacityChanged(this.state.capacities));
    }
    render(){
        let numericInputs = this.state.capacities.map(i=> {
           return <NumericInput value={i.capacity} key={i.key} onChange={(e)=> this.handleBusCapacityChanged(e, i.index)} max={100} min={1}/> 
        });
        return    (<div><div>Enter bus capacity:</div>
        {numericInputs}
        <input type="submit" value="Add bus" onClick={this.handleAddBus}/>
   </div>);
  
    }
}