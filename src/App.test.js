/**
 * @jest-environment jsdom
 */
import React from 'react'
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import App from './App';

jest.useFakeTimers();

let useRefSpy;
const clearRect = jest.fn();
const fillRect = jest.fn();
const focus = jest.fn()
beforeEach(() => {
  useRefSpy = jest.spyOn(React, 'createRef').mockImplementation(
    () => ({
      current: {
        style: {},
        getContext: () => (
          {
            clearRect,
            fillRect,
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            stroke: jest.fn()
          }
        ),
        getBoundingClientRect: () => ({ left: 1, top: 1 }),
        focus
      },
    }),
  );
  global.innerWidth = 90;
  global.innerHeight = 120;
})
afterEach(() => {
  useRefSpy.mockClear();
  clearRect.mockClear()
  fillRect.mockClear()
  focus.mockClear()
})

test('renders', () => {
  const wrapper = shallow(<App />)
  expect(toJson(wrapper)).toMatchSnapshot();
});

test('will set the cells and canvas size', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ pattern: 'none' })
  wrapper.instance().handlePattern()
  expect(wrapper.state().cells).toStrictEqual([])
  expect(wrapper.state().canvasWidth).toBe(90)
  expect(wrapper.state().canvasHeight).toBe(90)
});

test('will draw active cells', () => {
  const wrapper = shallow(<App />)
  wrapper.instance().handlePattern()
  wrapper.setState({ cells: [7] })
  wrapper.instance().updateCells()
  expect(clearRect).toHaveBeenCalledTimes(3)
  expect(clearRect).toHaveBeenCalledWith(0, 0, 90, 90)
  expect(fillRect.mock.lastCall).toEqual([15, 15, 15, 15])
});

test('will refresh active cells', () => {
  const wrapper = shallow(<App />)
  wrapper.instance().handlePattern()
  // blinker oscillator
  const liveCells = [6, 7, 8]
  wrapper.setState({ cells: liveCells, refresh: true })
  wrapper.instance().updateCells()
  jest.advanceTimersByTime(140);
  const refreshedCells = [
    7,
    1,
    13
  ]
  expect(wrapper.state().cells).toStrictEqual(refreshedCells)
  expect(wrapper.state().generations).toBe(1)
});

test('will make cells active on click', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ pattern: 'none' })
  wrapper.instance().handlePattern();
  expect(wrapper.state().cells.includes(7)).toBe(false)
  wrapper.instance().handleCanvasClick({ clientX: 18, clientY: 18 })
  expect(wrapper.state().cells.includes(7)).toBe(true)
});

test('will make cells in-active on click', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ pattern: 'none' })
  wrapper.instance().handlePattern();
  wrapper.setState({ cells: [7,8] })
  wrapper.instance().handleCanvasClick({ clientX: 18, clientY: 18 })
  expect(wrapper.state().cells).toEqual([8])
});

test('will handle refreshing cells on play', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ refresh: false })
  const controlTop = wrapper.find('ControlTop')
  controlTop.props().handleRefresh()
  expect(wrapper.state().refresh).toBe(true)
});

test('will handle stopping cell refresh on pause', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ refresh: true })
  const controlTop = wrapper.find('ControlTop')
  controlTop.props().handlePause()
  expect(wrapper.state().refresh).toBe(false)
});

test('will handle showing the pattern dialog', () => {
  const wrapper = shallow(<App />)
  const controlTop = wrapper.find('ControlTop')
  controlTop.props().handlePattern()
  expect(wrapper.state().showPatternDialog).toBe(true)
});

test('will handle clearing all live cells in the grid', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ refresh: true, generations: 10 })
  const controlTop = wrapper.find('ControlTop')
  controlTop.props().handleClear()
  expect(wrapper.state().refresh).toBe(false)
  expect(wrapper.state().generations).toBe(0)
});

test('will handle adjusting the cellSize', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ refresh: true, generations: 10 })
  expect(wrapper.state().cellSize).toBe(15)
  const controlBottom = wrapper.find('ControlBottom')
  controlBottom.props().handleCellSize({ target: { value: 32 } })
  expect(wrapper.state().cellSize).toBe(32)
});

test('will handle adjusting the refresh rate', () => {
  const wrapper = shallow(<App />)
  expect(wrapper.state().refreshRate).toBe(140)
  const controlBottom = wrapper.find('ControlBottom')
  controlBottom.props().handleRefreshRate({ target: { value: 300 } })
  expect(wrapper.state().refreshRate).toBe(300)
});

test('will toggle the grid', () => {
  const wrapper = shallow(<App />)
  expect(wrapper.state().showGrid).toBe(true)
  const controlTop = wrapper.find('ControlTop')
  controlTop.props().handleGrid()
  expect(wrapper.state().showGrid).toBe(false)
});

test('will cancel the pattern dialog', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ showPatternDialog: true })
  const controlTop = wrapper.find('PatternsDialog')
  controlTop.props().handleCancel()
  expect(wrapper.state().showPatternDialog).toBe(false)
});

test('will update the selected pattern', () => {
  const wrapper = shallow(<App />)
  expect(wrapper.state().pattern).toBe('random')
  const controlTop = wrapper.find('PatternsDialog')
  controlTop.props().handlePatternChange({ target: { value: 'new pattern' } })
  expect(wrapper.state().pattern).toBe('new pattern')
});

test('will handle focus on entering of the pattern dialog', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ showPatternDialog: true })
  const controlTop = wrapper.find('PatternsDialog')
  controlTop.props().handleEntering()
  expect(focus).toHaveBeenCalledTimes(1)
});