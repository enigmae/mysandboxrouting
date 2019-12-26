import * as React from "react";
import { render } from "react-dom";
//import { SearchControl } from "./searchControl";
import { LocationRiderCollectionControl } from "./Controls/locationRiderCollectionControl";
import { MapsControl } from "./mapsContol";
import { ISearchResult } from "./Controls/enterLocationControl";
import { LandingPageControl } from "./Controls/LandingPageControl";

function App() {
  return (
    
    <div className="App">
      <h1>Hello CodeSandbox Test</h1>
      <h2>Enter locations</h2>
      
    <LandingPageControl/>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
