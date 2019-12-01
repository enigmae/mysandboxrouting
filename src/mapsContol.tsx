
import * as React from "react";
import "./styles.css";

import * as atlas from 'azure-maps-control';

export class MapsControl extends React.Component<{},{}>{
    
    componentDidMount(){
        var map = new atlas.Map('myMap', {
            center: [-122.33, 47.6],
            zoom: 12,
            language: 'en-US',
            authOptions: {
                authType:  atlas.AuthenticationType.subscriptionKey,
                subscriptionKey: 'hJ8cpzhwMRwFJyFSkXyBjhZl6XncZclBUlTRxNvVlLQ'
            }
        });    }
    render(){
        return <div>
             <div id="myMap" style={{position:'relative', width:600,height:400}}></div>
        </div>
    }
}
