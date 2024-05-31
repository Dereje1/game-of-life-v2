import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import App from "./App";

jest.useFakeTimers();

const initialProps = {
  isRefreshing: false,
  cellSize: 15,
  refreshRate: 125,
  totalGenerations: 0,
  showGrid: true,
  isPatternDialogVisible: false,
  activePattern: "none",
  lastSelectedPattern: "none",
  refreshVal: 3,
  isSettingsDialogVisible: false,
  liveCells: [],
  generationsPerSecond: 0,
  canvasWidth: 0, // width of the canvas set after CDM
  canvasHeight: 0, // height of the canvas set after CDM
  canvasLeftPadding: 0, // left padding of the canvas set after CDM
  hasReachedMaxElements: false, // true if total cells exceeds allotted
  metricTimeStamp: Date.now(), // timestamp used for metrics/perf display
  colors: {
    canvasBackground: "#000000",
    liveCellColor: "#ffff00",
    gridColor: "#3b3b3b"
  },
  isColorPickerVisible: false,
  selectedColorType: "canvasBackground"
};

let useRefSpy;
const clearRect = jest.fn();
const fillRect = jest.fn();
const focus = jest.fn();

/*
a canvas width 90 X 90 and cell size of 15 
produces: 6 X 6 elements with indices:
|0 |1 |2 |3 |4 |5 |
|6 |7 |8 |9 |10|11|
|12|13|14|15|16|17|
|18|19|20|21|22|23|
|24|25|26|27|28|29|
|30|31|32|33|34|35|
where index 8 for ex. will have coordiantes (30,15)
*/
beforeEach(() => {
  useRefSpy = jest.spyOn(React, "createRef").mockImplementation(() => ({
    current: {
      style: {},
      getContext: () => ({
        clearRect,
        fillRect,
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn()
      }),
      getBoundingClientRect: () => ({ left: 1, top: 1 }),
      focus
    }
  }));
  global.innerWidth = 90;
  global.innerHeight = 120;
});
afterEach(() => {
  useRefSpy.mockClear();
  clearRect.mockClear();
  fillRect.mockClear();
  focus.mockClear();
  global.innerWidth = 0;
  global.innerHeight = 0;
});

describe("The app component", () => {
  test("renders", () => {
    const wrapper = shallow(<App {...initialProps} />);
    expect(wrapper.state().colors).toStrictEqual({
      canvasBackground: "#000000",
      liveCellColor: "#ffff00",
      gridColor: "#3b3b3b"
    });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("will use colors from local storage if present", () => {
    localStorage.setItem(
      "colors",
      JSON.stringify({
        canvasBackground: "#stored_background",
        liveCellColor: "#stored_cell",
        gridColor: "#stored_grid"
      })
    );
    const wrapper = shallow(<App {...initialProps} />);
    expect(wrapper.state().colors).toStrictEqual({
      canvasBackground: "#stored_background",
      liveCellColor: "#stored_cell",
      gridColor: "#stored_grid"
    });
  });
  test("will set the size of the canvas and cells", () => {
    const wrapper = shallow(<App {...initialProps} />);
    expect(wrapper.state().liveCells).toStrictEqual([]);
    expect(wrapper.state().canvasWidth).toBe(90);
    expect(wrapper.state().canvasHeight).toBe(90);
    expect(wrapper.state().cellSize).toBe(15);
  });
  test("will limit the canvas size if # elements exceeds allotted", () => {
    global.innerWidth = 3500;
    global.innerHeight = 3500;
    const wrapper = shallow(<App {...initialProps} />);
    expect(wrapper.state().liveCells).toStrictEqual([]);
    expect(wrapper.state().canvasWidth).toBe(1440);
    expect(wrapper.state().canvasHeight).toBe(655);
    expect(wrapper.state().cellSize).toBe(5);
  });
  test("will draw active liveCells on canvas", () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({ liveCells: [8] });
    wrapper.instance().updateCells();
    //first call for clearRect on CDM, second one on updateCells
    expect(clearRect).toHaveBeenCalledTimes(2);
    expect(clearRect).toHaveBeenCalledWith(0, 0, 90, 90);
    expect(fillRect).toHaveBeenCalledTimes(1);
    expect(fillRect.mock.lastCall).toEqual([30, 15, 15, 15]);
  });
  test("will refresh active cells", () => {
    const wrapper = shallow(<App {...initialProps} />);
    // blinker oscillator sample
    wrapper.setState({
      liveCells: [6, 7, 8],
      isRefreshing: true,
      totalGenerations: 4,
      activePattern: "xyz"
    });
    wrapper.instance().updateCells();
    jest.advanceTimersByTime(140);
    expect(wrapper.state().liveCells).toStrictEqual([1, 7, 13]);
    expect(wrapper.state().isRefreshing).toBe(true);
    expect(wrapper.state().activePattern).toBe("xyz");
    expect(wrapper.state().totalGenerations).toBe(5);
  });
  test("will stop refresh of active cells if no live cells found", () => {
    const wrapper = shallow(<App {...initialProps} />);
    const liveCells = [7];
    wrapper.setState({
      liveCells,
      isRefreshing: true,
      totalGenerations: 4,
      activePattern: "xyz"
    });
    wrapper.instance().updateCells();
    jest.advanceTimersByTime(140);
    expect(wrapper.state().liveCells).toStrictEqual([]);
    expect(wrapper.state().isRefreshing).toBe(false);
    expect(wrapper.state().totalGenerations).toBe(4);
  });
  test("will make in-active cells active on canvas click", () => {
    const wrapper = shallow(<App {...initialProps} />);
    expect(wrapper.state().liveCells.includes(7)).toBe(false);
    wrapper.instance().handleCanvasClick({ clientX: 18, clientY: 18 });
    expect(wrapper.state().liveCells.includes(7)).toBe(true);
  });
  test("will make active cells in-active on canvas click", () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({ liveCells: [7, 8] });
    wrapper.instance().handleCanvasClick({ clientX: 18, clientY: 18 });
    expect(wrapper.state().liveCells).toEqual([8]);
  });
});

describe("The top control", () => {
  test("will handle refreshing cells on play", () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({ isRefreshing: false, liveCells: [6, 7, 8] });
    const controlTop = wrapper.find("ControlTop");
    controlTop.props().handleRefresh();
    expect(wrapper.state().isRefreshing).toBe(true);
  });
  test("will handle stopping cell refresh on pause", () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({ isRefreshing: true });
    const controlTop = wrapper.find("ControlTop");
    controlTop.props().handlePause();
    expect(wrapper.state().isRefreshing).toBe(false);
  });
  test("will handle clearing all live cells in the canvas", () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({ isRefreshing: true, totalGenerations: 10 });
    const controlTop = wrapper.find("ControlTop");
    controlTop.props().handleClear();
    expect(wrapper.state().isRefreshing).toBe(false);
    expect(wrapper.state().totalGenerations).toBe(0);
  });
  test("will handle showing the settings dialog", () => {
    const wrapper = shallow(<App {...initialProps} />);
    expect(wrapper.state().isSettingsDialogVisible).toBe(false);
    const controlTop = wrapper.find("ControlTop");
    controlTop.props().handleSettingsDialog();
    expect(wrapper.state().isSettingsDialogVisible).toBe(true);
  });
});

describe("The bottom control", () => {
  test("will handle adjusting the cellSize", () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({ isRefreshing: true, totalGenerations: 10 });
    expect(wrapper.state().cellSize).toBe(15);
    const controlBottom = wrapper.find("ControlBottom");
    controlBottom.props().handleCellSize({ target: { value: 32 } });
    expect(wrapper.state().cellSize).toBe(32);
  });
  test("will handle adjusting the refresh rate", () => {
    const wrapper = shallow(<App {...initialProps} />);
    expect(wrapper.state().refreshRate).toBe(125);
    const controlBottom = wrapper.find("ControlBottom");
    controlBottom.props().handleRefreshRate({ target: { value: 2 } });
    expect(wrapper.state().refreshRate).toBe(250);
  });
});

describe("The settings dialog", () => {
  test("will handle showing the pattern dialog", () => {
    const wrapper = shallow(<App {...initialProps} />);
    const controlTop = wrapper.find("SettingsDialog");
    controlTop.props().handlePatternDialog();
    expect(wrapper.state().isPatternDialogVisible).toBe(true);
  });
  test("will toggle the grid", () => {
    const wrapper = shallow(<App {...initialProps} />);
    expect(wrapper.state().showGrid).toBe(true);
    const controlTop = wrapper.find("SettingsDialog");
    controlTop.props().handleGrid();
    expect(wrapper.state().showGrid).toBe(false);
  });
  test("will handle showing the color picker and hiding the settings dialog", () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({ isSettingsDialogVisible: true });
    const settingsDialog = wrapper.find("SettingsDialog");
    settingsDialog.props().handleColorPicker();
    expect(wrapper.state().isColorPickerVisible).toBe(true);
    expect(wrapper.state().isSettingsDialogVisible).toBe(false);
  });
  test("will handle restoring colors", () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({
      colors: {
        canvasBackground: "any",
        liveCellColor: "any",
        gridColor: "any"
      }
    });
    const settingsDialog = wrapper.find("SettingsDialog");
    settingsDialog.props().restoreColors();
    expect(wrapper.state().colors).toStrictEqual({
      canvasBackground: "#000000",
      liveCellColor: "#ffff00",
      gridColor: "#3b3b3b"
    });
  });
  test("will handle hiding the settings dialog", () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({ isSettingsDialogVisible: true });
    const settingsDialog = wrapper.find("SettingsDialog");
    settingsDialog.props().handleClose();
    expect(wrapper.state().isSettingsDialogVisible).toBe(false);
  });
});

describe("The patterns dialog", () => {
  test("will update the selected pattern", () => {
    const wrapper = shallow(<App {...initialProps} />);
    expect(wrapper.state().activePattern).toBe("none");
    const patternsDialog = wrapper.find("PatternsDialog");
    patternsDialog.props().handlePatternChange({ target: { value: "new pattern" } });
    expect(wrapper.state().lastSelectedPattern).toBe("new pattern");
    expect(wrapper.state().activePattern).toBe("none");
  });
  test("will cancel the pattern dialog", () => {
    const wrapper = shallow(<App {...initialProps} />);
    const controlTop = wrapper.find("SettingsDialog");
    controlTop.props().handlePatternDialog();
    expect(wrapper.state().isPatternDialogVisible).toBe(true);
    const patternsDialog = wrapper.find("PatternsDialog");
    patternsDialog.props().handlePatternChange({ target: { value: "new pattern" } });
    patternsDialog.props().handleCancel();
    expect(wrapper.state().isPatternDialogVisible).toBe(false);
    expect(wrapper.state().lastSelectedPattern).toBe("none");
  });

  test("will hide the settings dialog when a new pattern is selected", async () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({ isSettingsDialogVisible: true });
    const patternsDialog = wrapper.find("PatternsDialog");
    patternsDialog.props().handlePatternChange({ target: { value: "new pattern" } });
    expect(wrapper.state().lastSelectedPattern).toBe("new pattern");
    patternsDialog.props().handleOk();
    setTimeout(() => {
      expect(wrapper.state().isSettingsDialogVisible).toBe(false);
      expect(wrapper.state().activePattern).toBe("new pattern");
    }, 0);
  });
  test("will handle focus on entering of the pattern dialog", () => {
    const wrapper = shallow(<App {...initialProps} />);
    const patternsDialog = wrapper.find("PatternsDialog");
    patternsDialog.props().handleEntering();
    expect(focus).toHaveBeenCalledTimes(1);
  });
});

describe("The colors dialog", () => {
  test("will handle setting the change color type", () => {
    const wrapper = shallow(<App {...initialProps} />);
    const colorsDialog = wrapper.find("ColorsDialog");
    colorsDialog.props().updateColorChangeType("liveCellColor");
    expect(wrapper.state().selectedColorType).toBe("liveCellColor");
  });
  test("will handle setting the canvas background color from the color picker", () => {
    const wrapper = shallow(<App {...initialProps} />);
    expect(wrapper.state().colors.canvasBackground).toBe("#000000");
    expect(useRefSpy.mock.results[0].value.current.style).toEqual({ backgroundColor: "#000000" });
    const colorsDialog = wrapper.find("ColorsDialog");
    colorsDialog.props().handleColorChange({ hex: "FFFFFF" });
    expect(wrapper.state().colors.canvasBackground).toBe("FFFFFF");
    expect(useRefSpy.mock.results[0].value.current.style).toEqual({ backgroundColor: "FFFFFF" });
  });
  test("will handle setting the color of livecells from the color picker", () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({ selectedColorType: "liveCellColor", liveCells: [8] });
    const colorsDialog = wrapper.find("ColorsDialog");
    colorsDialog.props().handleColorChange({ hex: "000000" });
    expect(wrapper.state().colors.liveCellColor).toBe("000000");
    expect(fillRect.mock.instances[0].fillStyle).toBe("000000");
  });
  test("will handle setting the color of the grid from the color picker", () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({ selectedColorType: "gridColor", liveCells: [8] });
    const colorsDialog = wrapper.find("ColorsDialog");
    colorsDialog.props().handleColorChange({ hex: "000001" });
    expect(wrapper.state().colors.gridColor).toBe("000001");
    expect(fillRect.mock.instances[0].strokeStyle).toBe("000001");
  });
  test("will handle hiding the colors dialog", () => {
    const wrapper = shallow(<App {...initialProps} />);
    wrapper.setState({ isColorPickerVisible: true });
    const colorsDialog = wrapper.find("ColorsDialog");
    colorsDialog.props().closeColorPicker();
    expect(wrapper.state().isColorPickerVisible).toBe(false);
  });
});
