import * as React from "react";
import { render } from "react-dom";
//import { SearchControl } from "./searchControl";
import { SearchCollectionControl } from "./Controls/searchCollectionControl";
import { MapsControl } from "./mapsContol";
import { ISearchResult } from "./Controls/enterLocationControl";
import { EnterLocationsControl } from "./Controls/enterLocationsControl";

function App() {
  return (
    
    <div className="App">
      <h1>Hello CodeSandbox Test</h1>
      <h2>Enter locations</h2>
      
    <EnterLocationsControl/>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
