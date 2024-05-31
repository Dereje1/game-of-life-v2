import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const props = {
  // Indicates whether cells are currently being updated
  isRefreshing: false,

  // Size of each cell element in pixels
  cellSize: 15,

  // Refresh rate for updating the board (in milliseconds)
  refreshRate: 125,

  // Total generations run on the board since the last clear
  totalGenerations: 0,

  // Determines whether the canvas grid is shown
  showGrid: true,

  // Indicates whether the user has requested to select a pattern
  isPatternDialogVisible: false,

  // Name of the last selected pattern
  lastSelectedPattern: "random",

  // Name of the currently active pattern
  activePattern: "random",

  // Counter for tracking generations (used for metrics/performance display)
  generationCounter: 0,

  // Value of the refresh rate slider before scaling
  refreshVal: 3,

  // Indicates whether the settings dialog is open
  isSettingsDialogVisible: false,

  // Array containing indices of all live cells
  liveCells: [],

  // Generations per second (used for performance calculations)
  generationsPerSecond: 0,

  // Width of the canvas (set after component did mount)
  canvasWidth: 0,

  // Height of the canvas (set after component did mount)
  canvasHeight: 0,

  // Left padding of the canvas (set after component did mount)
  canvasLeftPadding: 0,

  // Indicates whether the total number of cells exceeds the allotted limit
  hasReachedMaxElements: false,

  // Timestamp used for metrics/performance display
  metricTimestamp: Date.now(),

  // Default colors for various elements
  colors: {
    canvasBackground: "#000000",
    liveCellColor: "#ffff00",
    gridColor: "#3b3b3b"
  },

  // Indicates whether the color picker is currently visible
  isColorPickerVisible: false,

  // Default color change type (e.g., canvas background color)
  selectedColorType: "canvasBackground"
};

ReactDOM.render(
  <React.StrictMode>
    <App {...props} />
  </React.StrictMode>,
  document.getElementById("root")
);
