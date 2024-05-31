import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import SettingsDialog, { Links } from "./SettingsDialog";

let props;
let windowSpy;
let open = jest.fn();
beforeEach(() => {
  props = {
    open: true,
    values: [
      { title: "Info 1", value: "Info 1 value" },
      { title: "Info 2", value: "Info 2 value" }
    ],
    handleClose: jest.fn(),
    showGrid: true,
    handleGrid: jest.fn(),
    activePattern: "random",
    refreshPattern: jest.fn(),
    handleColorPicker: jest.fn(),
    handlePatternDialog: jest.fn(),
    isColorPickerVisible: false,
    disableColorRestore: true,
    restoreColors: jest.fn()
  };
  windowSpy = jest.spyOn(global, "window", "get");
  windowSpy.mockImplementation(() => ({ open }));
});

afterEach(() => {
  props = null;
  jest.clearAllMocks();
});

test("will render the settings dialog", () => {
  const wrapper = shallow(<SettingsDialog {...props} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test("will render the settings dialog for no pattern or grid", () => {
  const updatedProps = {
    ...props,
    activePattern: "none",
    showGrid: false
  };
  const wrapper = shallow(<SettingsDialog {...updatedProps} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test("will render links", () => {
  const wrapper = shallow(<Links />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test("will render link to open the information page", () => {
  const wrapper = shallow(<Links />);
  const info = wrapper.find("ForwardRef(IconButton)").at(0);
  info.props().onClick();
  expect(open).toHaveBeenCalledWith("https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life");
});

test("will render link to open the github source page", () => {
  const wrapper = shallow(<Links />);
  const github = wrapper.find("ForwardRef(IconButton)").at(1);
  github.props().onClick();
  expect(open).toHaveBeenCalledWith("https://github.com/Dereje1/game-of-life-v2");
});
