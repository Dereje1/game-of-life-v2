import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import ColorsDialog from "./ColorsDialog";

let props;
beforeEach(() => {
  props = {
    color: "blue",
    handleColorChange: jest.fn(),
    closeColorPicker: jest.fn(),
    open: true,
    updateColorChangeType: jest.fn(),
    selectedColorType: "canvasBackground",
    showGrid: true
  };
});

afterEach(() => {
  props = null;
  jest.clearAllMocks();
});

test("will render the settings dialog", () => {
  const wrapper = shallow(<ColorsDialog {...props} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test("will update the colorType to change for the canvas", () => {
  const wrapper = shallow(<ColorsDialog {...props} />);
  const canvasChange = wrapper.find({ id: "canvas-color-change" });
  canvasChange.props().onClick();
  expect(props.updateColorChangeType).toHaveBeenCalledWith("canvasBackground");
  expect(canvasChange.props().disabled).toBe(false);
});

test("will update the colorType to change for the live cells", () => {
  const wrapper = shallow(<ColorsDialog {...props} />);
  const cellChange = wrapper.find({ id: "cell-color-change" });
  cellChange.props().onClick();
  expect(props.updateColorChangeType).toHaveBeenCalledWith("liveCellColor");
  expect(cellChange.props().disabled).toBe(false);
});

test("will update the colorType to change for the grid", () => {
  const wrapper = shallow(<ColorsDialog {...props} />);
  const gridChange = wrapper.find({ id: "grid-color-change" });
  gridChange.props().onClick();
  expect(props.updateColorChangeType).toHaveBeenCalledWith("gridColor");
  expect(gridChange.props().disabled).toBe(false);
});

test("will disable grid colorType if grid is not showing", () => {
  const updatedProps = {
    ...props,
    showGrid: false
  };
  const wrapper = shallow(<ColorsDialog {...updatedProps} />);
  const gridChange = wrapper.find({ id: "grid-color-change" });
  expect(gridChange.props().disabled).toBe(true);
});
