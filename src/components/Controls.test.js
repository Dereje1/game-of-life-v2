import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { ControlBottom, ControlTop, Action } from "./Controls";

const controlTopProps = {
  width: 80,
  height: 80,
  handleRefresh: jest.fn(),
  handlePause: jest.fn(),
  isRefreshing: true,
  handleReset: jest.fn(),
  handleClear: jest.fn(),
  generations: 6,
  showGrid: true,
  handleGrid: jest.fn(),
  metrics: {
    generationsPerSecond: 7,
    refreshVal: 3
  },
  handleSettingsDialog: jest.fn()
};

const controlBottomProps = {
  width: 80,
  height: 80,
  handleCellSize: jest.fn(),
  handleRefreshRate: jest.fn(),
  cellSize: 20,
  refreshVal: 3
};

test("will render the top control", () => {
  const wrapper = shallow(<ControlTop {...controlTopProps} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test("will render the bottom control", () => {
  const wrapper = shallow(<ControlBottom {...controlBottomProps} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test("will render play when not refreshing", () => {
  const wrapper = shallow(<Action isRefreshing={false} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test("will render pause when refreshing", () => {
  const wrapper = shallow(<Action isRefreshing={true} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});

test("The linear progress bar will display 100% for rates exceeding 50 gen/sec on max setting", () => {
  const updatedProps = {
    ...controlTopProps,
    metrics: {
      generationsPerSecond: 50,
      refreshVal: 6
    }
  };
  const wrapper = shallow(<ControlTop {...updatedProps} />);
  const progressBar = wrapper.find("ForwardRef(LinearProgress)");
  const emptyDiv = wrapper.find({ id: "empty-progress-div" });
  expect(progressBar.props().value).toBe(100);
  expect(emptyDiv.exists()).toBe(false);
});

test("The linear progress bar will display an empty div if not currently refreshing", () => {
  const updatedProps = {
    ...controlTopProps,
    isRefreshing: false
  };
  const wrapper = shallow(<ControlTop {...updatedProps} />);
  const progressBar = wrapper.find("ForwardRef(LinearProgress)");
  const emptyDiv = wrapper.find({ id: "empty-progress-div" });
  expect(progressBar.exists()).toBe(false);
  expect(emptyDiv.exists()).toBe(true);
});

test("The refresh rate slider will set an exponential scale", () => {
  const wrapper = shallow(<ControlBottom {...controlBottomProps} />);
  const refreshRateSlider = wrapper.find({ "aria-label": "Refreshrate" });
  const scaledUpVal = refreshRateSlider.props().scale(5);
  expect(scaledUpVal).toBe(32);
});

test("The refresh rate slider will print 'Max' for the label at the highest level", () => {
  const updatedProps = {
    ...controlBottomProps,
    refreshVal: 6
  };
  const wrapper = shallow(<ControlBottom {...updatedProps} />);
  const refreshRateSliderLabel = wrapper.find({ id: "non-linear-slider" });
  expect(refreshRateSliderLabel.text()).toBe("Max generations / sec");
});
