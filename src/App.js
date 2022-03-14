import React, { Component } from "react";
import { ControlTop, ControlBottom } from "./components/Controls";
import PatternsDialog from "./components/PatternsDialog";
import {
  getLiveCells,
  getPattern,
  getIndexFromCoordinates,
  getCoordinatesFromIndex
} from "./utils/utils";
import "./App.css";

const MAX_ELEMENTS = 38000;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      cellSize: 15,
      refreshRate: 100,
      generations: 0,
      showGrid: true,
      showPatternDialog: false,
      patternName: "random"
    };
    this.Canvas = React.createRef();
    this.radioGroupRef = React.createRef();
  }

  componentDidMount() {
    this.loadCanvas();
  }

  handleClear = () => {
    clearTimeout(this.timeoutId);
    this.setState(
      {
        refresh: false,
        generations: 0,
        patternName: "none",
        showPatternDialog: false
      },
      this.handlePattern
    );
  };

  handleCellSize = ({ target: { value } }) => {
    clearTimeout(this.timeoutId);
    this.setState({ refresh: false, cellSize: value, generations: 0 }, this.loadCanvas);
  };

  handleRefreshRate = ({ target: { value } }) => {
    clearTimeout(this.timeoutId);
    this.setState({ refreshRate: value * -1 }, this.updateCells);
  };

  handlePattern = () => {
    const { patternName, cellSize, canvasWidth: width, canvasHeight: height } = this.state;
    clearTimeout(this.timeoutId);
    const { cells } = getPattern({
      patternName,
      cellSize,
      width,
      height
    });
    this.setState(
      {
        refresh: patternName !== "none",
        generations: 0,
        showPatternDialog: false,
        cells
      },
      this.updateCells
    );
  };

  handleEntering = () => {
    if (this.radioGroupRef.current) {
      this.radioGroupRef.current.focus();
    }
  };

  handleCanvasClick = (e) => {
    const { clientX, clientY } = e;
    e.preventDefault();
    const { cells, cellSize, canvasWidth: width, canvasHeight: height } = this.state;
    const Canvas = this.Canvas.current;
    const { left, top } = Canvas.getBoundingClientRect();
    const trueX = clientX - left;
    const trueY = clientY - top;
    const index = getIndexFromCoordinates({
      x: trueX,
      y: trueY,
      width,
      height,
      cellSize
    });

    let newCells = [];
    if (cells.includes(index)) {
      newCells = cells.filter((c) => c !== index);
    } else {
      newCells = [...cells, index];
    }
    this.setState({ cells: newCells }, this.updateCells);
  };

  refreshCells = () => {
    const {
      cells: oldCells,
      cellSize,
      canvasWidth: width,
      canvasHeight: height,
      generations,
      refresh,
      patternName
    } = this.state;
    const newLiveCells = getLiveCells({
      oldCells,
      cellSize,
      width,
      height
    });
    const hasLiveCells = Boolean(newLiveCells.length);
    this.setState(
      {
        cells: newLiveCells,
        generations: hasLiveCells ? generations + 1 : generations,
        refresh: refresh && hasLiveCells,
        patternName: hasLiveCells ? patternName : "none"
      },
      this.updateCells
    );
  };

  updateCells = () => {
    const { cells, canvasWidth, canvasHeight, refresh, cellSize, refreshRate } = this.state;
    const context = this.canvasContext;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    cells.forEach((cell) => {
      const [x, y] = getCoordinatesFromIndex({
        index: cell,
        width: canvasWidth,
        cellSize
      });
      context.fillStyle = "yellow";
      context.fillRect(x, y, cellSize, cellSize);
    });
    this.refreshGrid();
    if (refresh) {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(this.refreshCells, refreshRate);
    }
  };

  refreshGrid = () => {
    const { canvasWidth, canvasHeight, cellSize, showGrid } = this.state;
    if (!showGrid) return null;
    const context = this.canvasContext;
    for (let x = 0; x <= canvasWidth; x += cellSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvasHeight);
      context.strokeStyle = "#3b3b3b";
      context.stroke();
    }
    for (let y = 0; y <= canvasHeight; y += cellSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvasWidth, y);
      context.strokeStyle = "#3b3b3b";
      context.stroke();
    }
  };

  loadCanvas = () => {
    const { innerWidth, innerHeight } = window;
    let { cellSize } = this.state;
    const totalCellsX = Math.floor(innerWidth / cellSize);
    const totalCellsY = Math.floor((innerHeight * 0.8) / cellSize);
    const totalElements = totalCellsX * totalCellsY;
    let canvasWidth = totalCellsX * cellSize;
    let canvasHeight = totalCellsY * cellSize;

    if (totalElements > MAX_ELEMENTS) {
      canvasWidth = 1440;
      canvasHeight = 655;
      cellSize = 5;
    }

    const canvas = this.Canvas.current;
    canvas.style.backgroundColor = "black";
    this.canvasContext = canvas.getContext("2d");

    this.setState(
      {
        canvasWidth,
        canvasHeight,
        canvasLeft: (innerWidth - canvasWidth) / 2,
        cellSize
      },
      this.handlePattern
    );
  };

  render() {
    const {
      canvasWidth,
      canvasHeight,
      canvasLeft,
      cellSize,
      refreshRate,
      showGrid,
      refresh,
      generations,
      showPatternDialog,
      patternName
    } = this.state;
    return (
      <>
        <>
          <ControlTop
            height={window.innerHeight * 0.1}
            isRefreshing={refresh}
            generations={generations}
            showGrid={showGrid}
            handleRefresh={() => this.setState({ refresh: true }, this.refreshCells)}
            handlePause={() => this.setState({ refresh: false })}
            handlePattern={() => this.setState({ showPatternDialog: true })}
            handleClear={this.handleClear}
            handleGrid={() => this.setState({ showGrid: !showGrid }, this.updateCells)}
          />

          <ControlBottom
            height={window.innerHeight * 0.1}
            cellSize={cellSize}
            refreshRate={refreshRate * -1}
            handleCellSize={this.handleCellSize}
            handleRefreshRate={this.handleRefreshRate}
          />
        </>
        <div style={{ paddingLeft: canvasLeft, background: "black" }}>
          <canvas
            ref={this.Canvas}
            width={canvasWidth}
            height={canvasHeight}
            tabIndex="0"
            onClick={this.handleCanvasClick}
          />
        </div>
        <PatternsDialog
          open={showPatternDialog}
          value={patternName}
          handleCancel={() => this.setState({ showPatternDialog: false })}
          handleOk={this.handlePattern}
          handlePatternChange={({ target: { value } }) => this.setState({ patternName: value })}
          radioGroupRef={this.radioGroupRef}
          handleEntering={this.handleEntering}
        />
      </>
    );
  }
}

export default App;
