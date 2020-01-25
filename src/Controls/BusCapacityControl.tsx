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
        this.handleDeleteBus = this.handleDeleteBus.bind(this);
        let state ={capacities:new Array()};
        state.capacities.push({capacity:50, key:Guid.create().toString(), index:0});
        this.state = state;
    }
    componentDidMount(){
        this.props.handleBusCapacityChanged(this.state.capacities);
    }
    handleBusCapacityChanged(e, index, key){
        var state = this.state;
        state = update(state, {capacities:{[index]:{$set:{capacity: e, index:index, key:key}}}});
        this.setState(state, ()=>this.props.handleBusCapacityChanged(this.state.capacities));
    }
    handleAddBus(){
        var state = this.state;
        state = update(state, {capacities:{$push:[{capacity:50, key:Guid.create.toString(), index:this.state.capacities.length}]}});
        this.setState(state, ()=>this.props.handleBusCapacityChanged(this.state.capacities));
    }
    handleDeleteBus(){
        var state = this.state;
        state = update(state, {capacities:{$splice:[[this.state.capacities.length-1]]}});
        this.setState(state, ()=>this.props.handleBusCapacityChanged(this.state.capacities));
    }
    render(){
        let numericInputs = this.state.capacities.map(i=> {
           return <div>Bus# {i.index+1}<NumericInput value={i.capacity} key={i.key} onChange={(e)=> this.handleBusCapacityChanged(e, i.index, i.key)} max={100} min={1}/></div> 
        });
        return    (<div><div>Enter bus capacity:</div>
        {numericInputs}
        <input type="submit" value="Add bus" onClick={this.handleAddBus} disabled={this.state.capacities.length>=this.props.maxBuses!}/>
        <input type="submit" value="Delete bus" onClick={this.handleDeleteBus} disabled={this.state.capacities.length==1}/>
   </div>);
  
    } 
    static defaultProps = {
        maxBuses:3
    } 
}
