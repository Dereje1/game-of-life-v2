import React, { Component } from "react";
import PropTypes from "prop-types";
import { ControlTop, ControlBottom } from "./components/Controls";
import PatternsDialog from "./components/PatternsDialog";
import SettingsDialog from "./components/SettingsDialog";
import ColorsDialog from "./components/ColorsDialog";
import { getLiveCells, getPattern, binaryInsert, buildInformation } from "./utils/utils";
import { getIndexFromClick, setBackGroundColor, drawLiveCells } from "./utils/canvas";
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
        selectedPatternName: "none",
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
    const refreshRate = value === 6 ? 0 : 1000 / Math.pow(2, value);
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
    const index = getIndexFromClick({
      canvas: this.Canvas.current,
      clientX,
      clientY,
      width,
      height,
      cellSize
    });

    let newCells = [];
    if (cells.includes(index)) {
      newCells = cells.filter((c) => c !== index);
    } else {
      newCells = binaryInsert(cells, index);
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
      setBackGroundColor({
        canvas: this.Canvas.current,
        backgroundColor: colors[selectedColorType]
      });
    }
    this.updateCells();
    return;
  };

  disableColorRestore = () => {
    const { colors: currentColors } = this.state;
    const { colors: defaultColors } = this.props;
    for (const colorType of Object.keys(currentColors)) {
      if (currentColors[colorType] !== defaultColors[colorType]) return false;
    }
    return true;
  };

  refreshCells = () => {
    const {
      cells: oldCells,
      cellSize,
      canvasWidth: width,
      canvasHeight: height,
      generations: prevGenerations,
      refresh,
      metricTimeStamp: prevMetricTimeStamp,
      metricCounter: prevMetricCounter,
      generationsPerSecond: prevGenerationsPerSecond
    } = this.state;
    const newLiveCells = getLiveCells({
      oldCells,
      cellSize,
      width,
      height
    });
    const hasLiveCells = Boolean(newLiveCells.length);
    // resets metrics counter every hundred generations
    const resetCounter = prevGenerations % 100 === 0;

    const metricCounter = resetCounter ? 0 : prevMetricCounter + 1;
    const metricTimeStamp = resetCounter ? Date.now() : prevMetricTimeStamp;
    const generationsPerSecond = resetCounter
      ? prevGenerationsPerSecond
      : (metricCounter / (Date.now() - metricTimeStamp)) * 1000;

    this.setState(
      {
        cells: newLiveCells,
        generations: hasLiveCells ? prevGenerations + 1 : prevGenerations,
        refresh: refresh && hasLiveCells,
        metricCounter,
        generationsPerSecond,
        metricTimeStamp
      },
      this.updateCells
    );
  };

  updateCells = () => {
    const { cells, canvasWidth, canvasHeight, refresh, cellSize, refreshRate, colors, showGrid } =
      this.state;
    drawLiveCells({
      canvas: this.Canvas.current,
      cells,
      canvasWidth,
      canvasHeight,
      cellSize,
      colors,
      showGrid
    });
    if (refresh) {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(this.refreshCells, refreshRate);
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

    setBackGroundColor({
      canvas: this.Canvas.current,
      backgroundColor: canvasBackGround
    });

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
      cells,
      cellSize,
      showGrid,
      refresh,
      generations,
      showPatternDialog,
      patternName,
      selectedPatternName,
      isMaxElements,
      generationsPerSecond,
      refreshVal,
      showSettingsDialog,
      showColorPicker,
      colors,
      selectedColorType,
      colors: { canvasBackGround }
    } = this.state;
    const { colors: defaultColors } = this.props;
    const hasLiveCells = Boolean(cells.length);
    return (
      <>
        <>
          <ControlTop
            height={window.innerHeight * 0.1}
            isRefreshing={refresh}
            generations={generations}
            metrics={{
              generationsPerSecond,
              refreshVal
            }}
            hasLiveCells={hasLiveCells}
            handleRefresh={() =>
              this.setState(
                { refresh: true, metricTimeStamp: Date.now(), metricCounter: 0 },
                this.refreshCells
              )
            }
            handlePause={() => this.setState({ refresh: false })}
            handleClear={this.handleClear}
            handleSettingsDialog={() => this.setState({ showSettingsDialog: true })}
            handleNextStep={this.refreshCells}
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
          handlePatternDialog={() =>
            this.setState({ showPatternDialog: true, showSettingsDialog: false })
          }
          restoreColors={() =>
            this.setState({ colors: { ...defaultColors } }, this.drawColorChange)
          }
          disableColorRestore={this.disableColorRestore()}
        />
        <PatternsDialog
          open={showPatternDialog}
          value={selectedPatternName}
          handleCancel={() =>
            this.setState({
              showPatternDialog: false,
              showSettingsDialog: true,
              selectedPatternName: patternName
            })
          }
          handleOk={() => {
            this.setState(
              {
                showPatternDialog: false,
                patternName: this.state.selectedPatternName, //TODO: UT failing with destructured val
                showSettingsDialog: false
              },
              this.handlePattern
            );
          }}
          handlePatternChange={({ target: { value } }) =>
            this.setState({ selectedPatternName: value })
          }
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

App.propTypes = {
  colors: PropTypes.object.isRequired
};
