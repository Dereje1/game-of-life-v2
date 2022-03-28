import React, { Component } from "react";
import { ControlTop, ControlBottom } from "./components/Controls";
import PatternsDialog from "./components/PatternsDialog";
import SettingsDialog from "./components/SettingsDialog";
import ColorsDialog from "./components/ColorsDialog";
import {
  getLiveCells,
  getPattern,
  getIndexFromCoordinates,
  getCoordinatesFromIndex,
  buildInformation
} from "./utils/utils";
import "./App.css";

const MAX_ELEMENTS = 38000;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props };
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
        showPatternDialog: false,
        generationsPerSecond: 0,
        cells: []
      },
      this.updateCells
    );
  };

  handleCellSize = ({ target: { value } }) => {
    clearTimeout(this.timeoutId);
    this.setState(
      {
        refresh: false,
        cellSize: value,
        generations: 0,
        metricTimeStamp: Date.now(),
        metricCounter: 0
      },
      this.loadCanvas
    );
  };

  handleRefreshRate = ({ target: { value } }) => {
    clearTimeout(this.timeoutId);
    // use maximum refresh rate of 1ms for max slider
    const refreshRate = value === 6 ? 1 : 1000 / Math.pow(2, value);
    this.setState(
      {
        refreshRate,
        metricTimeStamp: Date.now(),
        metricCounter: 0,
        refreshVal: value
      },
      this.updateCells
    );
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
        cells,
        metricTimeStamp: Date.now(),
        metricCounter: 0
      },
      this.updateCells
    );
  };

  handleEntering = () => {
    if (this.radioGroupRef.current) {
      this.radioGroupRef.current.focus();
    }
  };

  handleCanvasClick = ({ clientX, clientY }) => {
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

  handleColorChange = ({ hex }) => {
    const { selectedColorType } = this.state;
    this.setState(
      {
        colors: {
          ...this.state.colors,
          [selectedColorType]: hex
        }
      },
      this.drawColorChange
    );
  };

  drawColorChange = () => {
    const { selectedColorType, colors } = this.state;
    if (selectedColorType === "canvasBackGround") {
      const canvas = this.Canvas.current;
      canvas.style.backgroundColor = colors[selectedColorType];
    }
    this.updateCells();
    return;
  };

  refreshCells = () => {
    const {
      cells: oldCells,
      cellSize,
      canvasWidth: width,
      canvasHeight: height,
      generations,
      refresh,
      patternName,
      metricTimeStamp,
      metricCounter: prevMetricCounter
    } = this.state;
    const newLiveCells = getLiveCells({
      oldCells,
      cellSize,
      width,
      height
    });
    const hasLiveCells = Boolean(newLiveCells.length);
    const metricCounter = hasLiveCells ? prevMetricCounter + 1 : prevMetricCounter;
    const elapsedTime = Date.now() - metricTimeStamp;
    const generationsPerSecond = (metricCounter / elapsedTime) * 1000;
    this.setState(
      {
        cells: newLiveCells,
        generations: hasLiveCells ? generations + 1 : generations,
        refresh: refresh && hasLiveCells,
        patternName: hasLiveCells ? patternName : "none",
        metricCounter,
        generationsPerSecond
      },
      this.updateCells
    );
  };

  updateCells = () => {
    const {
      cells,
      canvasWidth,
      canvasHeight,
      refresh,
      cellSize,
      refreshRate,
      colors: { liveCell }
    } = this.state;
    const context = this.canvasContext;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    cells.forEach((cell) => {
      const [x, y] = getCoordinatesFromIndex({
        index: cell,
        width: canvasWidth,
        cellSize
      });
      context.fillStyle = liveCell;
      context.fillRect(x, y, cellSize, cellSize);
    });
    this.refreshGrid();
    if (refresh) {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(this.refreshCells, refreshRate);
    }
  };

  refreshGrid = () => {
    const {
      canvasWidth,
      canvasHeight,
      cellSize,
      showGrid,
      colors: { grid }
    } = this.state;
    if (!showGrid) return null;
    const context = this.canvasContext;
    for (let x = 0; x <= canvasWidth; x += cellSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvasHeight);
      context.strokeStyle = grid;
      context.stroke();
    }
    for (let y = 0; y <= canvasHeight; y += cellSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvasWidth, y);
      context.strokeStyle = grid;
      context.stroke();
    }
  };

  loadCanvas = () => {
    const { innerWidth, innerHeight } = window;
    let {
      cellSize,
      colors: { canvasBackGround }
    } = this.state;
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
    canvas.style.backgroundColor = canvasBackGround;
    this.canvasContext = canvas.getContext("2d");

    this.setState(
      {
        canvasWidth,
        canvasHeight,
        canvasLeft: (innerWidth - canvasWidth) / 2,
        cellSize,
        isMaxElements: totalElements > MAX_ELEMENTS
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
      showGrid,
      refresh,
      generations,
      showPatternDialog,
      patternName,
      isMaxElements,
      generationsPerSecond,
      refreshVal,
      showSettingsDialog,
      showColorPicker,
      colors,
      selectedColorType,
      colors: { canvasBackGround }
    } = this.state;
    return (
      <>
        <>
          <ControlTop
            height={window.innerHeight * 0.1}
            isRefreshing={refresh}
            generations={generations}
            generationsPerSecond={generationsPerSecond}
            metrics={{
              generationsPerSecond,
              refreshVal
            }}
            handleRefresh={() =>
              this.setState(
                { refresh: true, metricTimeStamp: Date.now(), metricCounter: 0 },
                this.refreshCells
              )
            }
            handlePause={() => this.setState({ refresh: false })}
            handleClear={this.handleClear}
            handleSettingsDialog={() => this.setState({ showSettingsDialog: true })}
          />

          <ControlBottom
            height={window.innerHeight * 0.1}
            cellSize={cellSize}
            refreshVal={refreshVal}
            handleCellSize={this.handleCellSize}
            handleRefreshRate={this.handleRefreshRate}
          />
        </>
        <div
          style={{
            paddingLeft: canvasLeft,
            background: isMaxElements ? "white" : canvasBackGround,
            height: window.innerHeight * 0.8
          }}
        >
          <canvas
            ref={this.Canvas}
            width={canvasWidth}
            height={canvasHeight}
            tabIndex="0"
            onClick={this.handleCanvasClick}
          />
        </div>
        <SettingsDialog
          open={showSettingsDialog}
          showGrid={showGrid}
          patternName={patternName}
          values={buildInformation({ ...this.state })}
          handleClose={() => this.setState({ showSettingsDialog: false })}
          handleGrid={() => this.setState({ showGrid: !showGrid }, this.updateCells)}
          refreshPattern={() => this.setState({ showSettingsDialog: false }, this.handlePattern)}
          handleColorPicker={() =>
            this.setState({ showColorPicker: true, showSettingsDialog: false })
          }
          handlePatternDialog={() => this.setState({ showPatternDialog: true })}
          restoreColors={() =>
            this.setState(
              {
                colors: {
                  canvasBackGround: "#000000",
                  liveCell: "#ffff00",
                  grid: "#3b3b3b"
                }
              },
              this.drawColorChange
            )
          }
          currentColors={colors}
        />
        <PatternsDialog
          open={showPatternDialog}
          value={patternName}
          handleCancel={() => this.setState({ showPatternDialog: false })}
          handleOk={() => this.setState({ showSettingsDialog: false }, this.handlePattern)}
          handlePatternChange={({ target: { value } }) => this.setState({ patternName: value })}
          radioGroupRef={this.radioGroupRef}
          handleEntering={this.handleEntering}
        />
        <ColorsDialog
          open={showColorPicker}
          color={colors[selectedColorType]}
          selectedColorType={selectedColorType}
          showGrid={showGrid}
          handleColorChange={this.handleColorChange}
          closeColorPicker={() =>
            this.setState({
              showColorPicker: false,
              showSettingsDialog: true,
              selectedColorType: "canvasBackGround"
            })
          }
          updateColorChangeType={(type) => this.setState({ selectedColorType: type })}
        />
      </>
    );
  }
}

export default App;
