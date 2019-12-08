import * as React from "react";
import { render } from "react-dom";
//import { SearchControl } from "./searchControl";
import { SearchCollection } from "./searchCollection";
import { MapsControl } from "./mapsContol";
import { ISearchResult } from "./searchControl";
import { DisplayItineraries } from "./displayItineraries";

function App() {
  return (
    
    <div className="App">
      <h1>Hello CodeSandbox Test</h1>
      <h2>Enter locations</h2>
      
    <DisplayItineraries/>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
