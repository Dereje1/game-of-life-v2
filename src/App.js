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
    const colors = localStorage.getItem("colors");
    if (colors) {
      this.setState({ colors: JSON.parse(colors) }, this.loadCanvas);
    } else {
      const { colors: defaultColors } = this.props;
      localStorage.setItem("colors", JSON.stringify(defaultColors));
      this.loadCanvas();
    }
  }

  handleClear = () => {
    clearTimeout(this.timeoutId);
    this.setState(
      {
        isRefreshing: false,
        totalGenerations: 0,
        activePattern: "none",
        lastSelectedPattern: "none",
        isPatternDialogVisible: false,
        generationsPerSecond: 0,
        liveCells: []
      },
      this.updateCells
    );
  };

  handleCellSize = ({ target: { value } }) => {
    clearTimeout(this.timeoutId);
    this.setState(
      {
        isRefreshing: false,
        cellSize: value,
        totalGenerations: 0,
        metricTimeStamp: Date.now(),
        generationCounter: 0
      },
      this.loadCanvas
    );
  };

  handleRefreshRate = ({ target: { value } }) => {
    clearTimeout(this.timeoutId);
    // use maximum isRefreshing rate of 1ms for max slider
    const refreshRate = value === 6 ? 0 : 1000 / Math.pow(2, value);
    this.setState(
      {
        refreshRate,
        metricTimeStamp: Date.now(),
        generationCounter: 0,
        refreshVal: value
      },
      this.updateCells
    );
  };

  handlePattern = () => {
    const { activePattern, cellSize, canvasWidth: width, canvasHeight: height } = this.state;
    clearTimeout(this.timeoutId);
    const { liveCells } = getPattern({
      activePattern,
      cellSize,
      width,
      height
    });
    this.setState(
      {
        isRefreshing: activePattern !== "none",
        totalGenerations: 0,
        isPatternDialogVisible: false,
        liveCells,
        metricTimeStamp: Date.now(),
        generationCounter: 0
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
    const { liveCells, cellSize, canvasWidth: width, canvasHeight: height } = this.state;
    const index = getIndexFromClick({
      canvas: this.Canvas.current,
      clientX,
      clientY,
      width,
      height,
      cellSize
    });

    let newCells = [];
    if (liveCells.includes(index)) {
      newCells = liveCells.filter((c) => c !== index);
    } else {
      newCells = binaryInsert(liveCells, index);
    }
    this.setState({ liveCells: newCells }, this.updateCells);
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
    // background color changes can only be applied on canvas
    if (selectedColorType === "canvasBackground") {
      setBackGroundColor({
        canvas: this.Canvas.current,
        backgroundColor: colors[selectedColorType]
      });
    }
    this.updateCells();
    localStorage.setItem("colors", JSON.stringify(colors));
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
      liveCells: oldCells,
      cellSize,
      canvasWidth: width,
      canvasHeight: height,
      totalGenerations: prevGenerations,
      isRefreshing,
      metricTimeStamp: prevMetricTimeStamp,
      generationCounter: prevMetricCounter,
      generationsPerSecond: prevGenerationsPerSecond
    } = this.state;
    const newLiveCells = getLiveCells({
      oldCells,
      cellSize,
      width,
      height
    });
    const hasLiveCells = Boolean(newLiveCells.length);
    // resets metrics counter every hundred totalGenerations
    const resetCounter = prevGenerations % 100 === 0;

    const generationCounter = resetCounter ? 0 : prevMetricCounter + 1;
    const metricTimeStamp = resetCounter ? Date.now() : prevMetricTimeStamp;
    const generationsPerSecond = resetCounter
      ? prevGenerationsPerSecond
      : (generationCounter / (Date.now() - metricTimeStamp)) * 1000;

    this.setState(
      {
        liveCells: newLiveCells,
        totalGenerations: hasLiveCells ? prevGenerations + 1 : prevGenerations,
        isRefreshing: isRefreshing && hasLiveCells,
        generationCounter,
        generationsPerSecond,
        metricTimeStamp
      },
      this.updateCells
    );
  };

  updateCells = () => {
    const { isRefreshing, refreshRate } = this.state;
    drawLiveCells({
      canvas: this.Canvas.current,
      ...this.state
    });
    if (isRefreshing) {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(this.refreshCells, refreshRate);
    }
  };

  loadCanvas = () => {
    const { innerWidth, innerHeight } = window;
    let {
      cellSize,
      colors: { canvasBackground }
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
      backgroundColor: canvasBackground
    });

    this.setState(
      {
        canvasWidth,
        canvasHeight,
        canvasLeftPadding: (innerWidth - canvasWidth) / 2,
        cellSize,
        hasReachedMaxElements: totalElements > MAX_ELEMENTS
      },
      this.handlePattern
    );
  };

  render() {
    const {
      canvasWidth,
      canvasHeight,
      canvasLeftPadding,
      liveCells,
      cellSize,
      showGrid,
      isRefreshing,
      totalGenerations,
      isPatternDialogVisible,
      activePattern,
      lastSelectedPattern,
      hasReachedMaxElements,
      generationsPerSecond,
      refreshVal,
      isSettingsDialogVisible,
      isColorPickerVisible,
      colors,
      selectedColorType,
      colors: { canvasBackground }
    } = this.state;
    const { colors: defaultColors } = this.props;
    const hasLiveCells = Boolean(liveCells.length);
    return (
      <>
        <>
          <ControlTop
            height={window.innerHeight * 0.1}
            isRefreshing={isRefreshing}
            totalGenerations={totalGenerations}
            metrics={{
              generationsPerSecond,
              refreshVal
            }}
            hasLiveCells={hasLiveCells}
            handleRefresh={() =>
              this.setState(
                { isRefreshing: true, metricTimeStamp: Date.now(), generationCounter: 0 },
                this.refreshCells
              )
            }
            handlePause={() => this.setState({ isRefreshing: false })}
            handleClear={this.handleClear}
            handleSettingsDialog={() => this.setState({ isSettingsDialogVisible: true })}
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
          id="canvas-holder"
          style={{
            paddingLeft: canvasLeftPadding,
            background: hasReachedMaxElements ? "white" : canvasBackground,
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
          open={isSettingsDialogVisible}
          showGrid={showGrid}
          activePattern={activePattern}
          values={buildInformation({ ...this.state })}
          handleClose={() => this.setState({ isSettingsDialogVisible: false })}
          handleGrid={() => this.setState({ showGrid: !showGrid }, this.updateCells)}
          refreshPattern={() =>
            this.setState(
              {
                isSettingsDialogVisible: false
              },
              this.handlePattern
            )
          }
          handleColorPicker={() =>
            this.setState({ isColorPickerVisible: true, isSettingsDialogVisible: false })
          }
          handlePatternDialog={() =>
            this.setState({ isPatternDialogVisible: true, isSettingsDialogVisible: false })
          }
          restoreColors={() =>
            this.setState({ colors: { ...defaultColors } }, this.drawColorChange)
          }
          disableColorRestore={this.disableColorRestore()}
        />
        <PatternsDialog
          open={isPatternDialogVisible}
          value={lastSelectedPattern}
          handleCancel={() =>
            this.setState({
              isPatternDialogVisible: false,
              isSettingsDialogVisible: true,
              lastSelectedPattern: activePattern
            })
          }
          handleOk={() => {
            this.setState(
              {
                isPatternDialogVisible: false,
                activePattern: lastSelectedPattern,
                isSettingsDialogVisible: false
              },
              this.handlePattern
            );
          }}
          handlePatternChange={({ target: { value } }) =>
            this.setState({ lastSelectedPattern: value })
          }
          radioGroupRef={this.radioGroupRef}
          handleEntering={this.handleEntering}
        />
        <ColorsDialog
          open={isColorPickerVisible}
          color={colors[selectedColorType]}
          selectedColorType={selectedColorType}
          showGrid={showGrid}
          handleColorChange={this.handleColorChange}
          closeColorPicker={() =>
            this.setState({
              isColorPickerVisible: false,
              isSettingsDialogVisible: true,
              selectedColorType: "canvasBackground"
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
