import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import App from "./App";

jest.useFakeTimers();

const initialProps = {
  refresh: false,
  cellSize: 15,
  refreshRate: 125,
  generations: 0,
  showGrid: true,
  showPatternDialog: false,
  patternName: "none",
  refreshVal: 3,
  showSettingsDialog: false,
  cells: [],
  generationsPerSecond: 0,
  canvasWidth: 0, // width of the canvas set after CDM
  canvasHeight: 0, // height of the canvas set after CDM
  canvasLeft: 0, // left padding of the canvas set after CDM
  isMaxElemets: false, // true if total cells exceeds allotted
  metricTimeStamp: Date.now(), // timestamp used for metrics/perf display
  colors: {
    canvasBackGround: "black",
    liveCell: "yellow",
    grid: "#3b3b3b"
  },
  showColorPicker: false,
  selectedColorType: "canvasBackGround"
};

let useRefSpy;
const clearRect = jest.fn();
const fillRect = jest.fn();
const focus = jest.fn();

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

test("renders", () => {
  const wrapper = shallow(<App {...initialProps} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test("will set the size of the canvas and cells", () => {
  const wrapper = shallow(<App {...initialProps} />);
  expect(wrapper.state().cells).toStrictEqual([]);
  expect(wrapper.state().canvasWidth).toBe(90);
  expect(wrapper.state().canvasHeight).toBe(90);
  expect(wrapper.state().cellSize).toBe(15);
});

test("will limit the canvas size if # elements exceeds allotted", () => {
  global.innerWidth = 3500;
  global.innerHeight = 3500;
  const wrapper = shallow(<App {...initialProps} />);
  expect(wrapper.state().cells).toStrictEqual([]);
  expect(wrapper.state().canvasWidth).toBe(1440);
  expect(wrapper.state().canvasHeight).toBe(655);
  expect(wrapper.state().cellSize).toBe(5);
});

test("will draw active cells on canvas", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.setState({ cells: [7] });
  wrapper.instance().updateCells();
  //first call for clearRect on CDM, second one on updateCells
  expect(clearRect).toHaveBeenCalledTimes(2);
  expect(clearRect).toHaveBeenCalledWith(0, 0, 90, 90);
  expect(fillRect).toHaveBeenCalledTimes(1);
  expect(fillRect.mock.lastCall).toEqual([15, 15, 15, 15]);
});

test("will refresh active cells", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.instance().handlePattern();
  // blinker oscillator
  const liveCells = [6, 7, 8];
  wrapper.setState({
    cells: liveCells,
    refresh: true,
    generations: 4,
    patternName: "xyz"
  });
  wrapper.instance().updateCells();
  jest.advanceTimersByTime(140);
  const refreshedCells = [7, 1, 13];
  expect(wrapper.state().cells).toStrictEqual(refreshedCells);
  expect(wrapper.state().refresh).toBe(true);
  expect(wrapper.state().patternName).toBe("xyz");
  expect(wrapper.state().generations).toBe(5);
});

test("will stop refresh of active cells if no live cells found", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.instance().handlePattern();
  const liveCells = [7];
  wrapper.setState({
    cells: liveCells,
    refresh: true,
    generations: 4,
    patternName: "xyz"
  });
  wrapper.instance().updateCells();
  jest.advanceTimersByTime(140);
  expect(wrapper.state().cells).toStrictEqual([]);
  expect(wrapper.state().refresh).toBe(false);
  expect(wrapper.state().patternName).toBe("none");
  expect(wrapper.state().generations).toBe(4);
});

test("will make cells active on click", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.instance().handlePattern();
  expect(wrapper.state().cells.includes(7)).toBe(false);
  wrapper.instance().handleCanvasClick({ clientX: 18, clientY: 18, preventDefault: jest.fn() });
  expect(wrapper.state().cells.includes(7)).toBe(true);
});

test("will make cells in-active on click", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.setState({ cells: [7, 8] });
  wrapper.instance().handleCanvasClick({ clientX: 18, clientY: 18, preventDefault: jest.fn() });
  expect(wrapper.state().cells).toEqual([8]);
});

test("will handle refreshing cells on play", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.setState({ refresh: false, cells: [6, 7, 8] });
  const controlTop = wrapper.find("ControlTop");
  controlTop.props().handleRefresh();
  expect(wrapper.state().refresh).toBe(true);
});

test("will handle stopping cell refresh on pause", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.setState({ refresh: true });
  const controlTop = wrapper.find("ControlTop");
  controlTop.props().handlePause();
  expect(wrapper.state().refresh).toBe(false);
});

test("will handle showing the pattern dialog", () => {
  const wrapper = shallow(<App {...initialProps} />);
  const controlTop = wrapper.find("SettingsDialog");
  controlTop.props().handlePatternDialog();
  expect(wrapper.state().showPatternDialog).toBe(true);
});

test("will handle clearing all live cells in the grid", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.setState({ refresh: true, generations: 10 });
  const controlTop = wrapper.find("ControlTop");
  controlTop.props().handleClear();
  expect(wrapper.state().refresh).toBe(false);
  expect(wrapper.state().generations).toBe(0);
});

test("will handle adjusting the cellSize", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.setState({ refresh: true, generations: 10 });
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

test("will toggle the grid", () => {
  const wrapper = shallow(<App {...initialProps} />);
  expect(wrapper.state().showGrid).toBe(true);
  const controlTop = wrapper.find("SettingsDialog");
  controlTop.props().handleGrid();
  expect(wrapper.state().showGrid).toBe(false);
});

test("will cancel the pattern dialog", () => {
  const wrapper = shallow(<App {...initialProps} />);
  const controlTop = wrapper.find("SettingsDialog");
  controlTop.props().handlePatternDialog();
  expect(wrapper.state().showPatternDialog).toBe(true);
  const patternsDialog = wrapper.find("PatternsDialog");
  patternsDialog.props().handleCancel();
  expect(wrapper.state().showPatternDialog).toBe(false);
});

test("will update the selected pattern", () => {
  const wrapper = shallow(<App {...initialProps} />);
  expect(wrapper.state().patternName).toBe("none");
  const patternsDialog = wrapper.find("PatternsDialog");
  patternsDialog.props().handlePatternChange({ target: { value: "new pattern" } });
  expect(wrapper.state().patternName).toBe("new pattern");
});

test("will hide the settings dialog when a new pattern is selected", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.setState({ showSettingsDialog: true });
  const patternsDialog = wrapper.find("PatternsDialog");
  patternsDialog.props().handleOk();
  expect(wrapper.state().showSettingsDialog).toBe(false);
});

test("will handle focus on entering of the pattern dialog", () => {
  const wrapper = shallow(<App {...initialProps} />);
  const patternsDialog = wrapper.find("PatternsDialog");
  patternsDialog.props().handleEntering();
  expect(focus).toHaveBeenCalledTimes(1);
});

test("will handle not showing the settings dialog", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.setState({ showSettingsDialog: true });
  const settingsDialog = wrapper.find("SettingsDialog");
  settingsDialog.props().handleClose();
  expect(wrapper.state().showSettingsDialog).toBe(false);
});

test("will handle showing the color picker and hiding the settings dialog", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.setState({ showSettingsDialog: true });
  const settingsDialog = wrapper.find("SettingsDialog");
  settingsDialog.props().handleColorPicker();
  expect(wrapper.state().showColorPicker).toBe(true);
  expect(wrapper.state().showSettingsDialog).toBe(false);
});

test("will handle not showing the colors dialog", () => {
  const wrapper = shallow(<App {...initialProps} />);
  wrapper.setState({ showColorPicker: true });
  const colorsDialog = wrapper.find("ColorsDialog");
  colorsDialog.props().closeColorPicker();
  expect(wrapper.state().showColorPicker).toBe(false);
});

test("will handle setting the change color type from the colors dialog", () => {
  const wrapper = shallow(<App {...initialProps} />);
  const colorsDialog = wrapper.find("ColorsDialog");
  colorsDialog.props().updateColorChangeType("liveCell");
  expect(wrapper.state().selectedColorType).toBe("liveCell");
});

test("will handle setting the selected color from the color picker", () => {
  const wrapper = shallow(<App {...initialProps} />);
  expect(wrapper.state().colors.canvasBackGround).toBe("black");
  const colorsDialog = wrapper.find("ColorsDialog");
  colorsDialog.props().handleColorChange({ hex: "FFFFFF" });
  expect(wrapper.state().colors.canvasBackGround).toBe("FFFFFF");
});
