import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const props = {
  refresh: false, //True if cells are updating
  cellSize: 15, // Element size in pixels
  refreshRate: 125, // refresh rate in ms
  generations: 0, // Total generations run on the board since last clear
  showGrid: true, // False if canvas grid is not shown
  showPatternDialog: false, // True when user reuests to select a pattern
  patternName: "random", // Name of the last pattern selected
  metricCounter: 0, // generation counter for metrics/perf display
  refreshVal: 3, // mui slider refresh rate val before scaling
  showInfoDialog: false, // True when user selects additional information
  cells: [], // Arr containing the indices of all live cells
  generationsPerSecond: 0 // used for perf/metrics calculations
};

ReactDOM.render(
  <React.StrictMode>
    <App {...props} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
