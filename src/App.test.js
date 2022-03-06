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
beforeEach(() => {
  useRefSpy = jest.spyOn(React, 'createRef').mockImplementationOnce(
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
        getBoundingClientRect: () => ({ left: 1, top: 1 })
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
})

test('renders', () => {
  const wrapper = shallow(<App />)
  expect(toJson(wrapper)).toMatchSnapshot();
});

test('will set the cells and canvas size', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ empty: true })
  wrapper.instance().setGrid()
  expect(wrapper.state().cells).toStrictEqual([])
  expect(wrapper.state().canvasWidth).toBe(80)
  expect(wrapper.state().canvasHeight).toBe(80)
});

test('will draw active cells', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ empty: true })
  wrapper.instance().setGrid()
  wrapper.setState({ cells: ['20-20'] })
  wrapper.instance().updateCells()
  expect(clearRect).toHaveBeenCalledTimes(3)
  expect(clearRect).toHaveBeenCalledWith(0, 0, 80, 80)
  expect(fillRect.mock.lastCall).toEqual(['20', '20', 20, 20])
});

test('will refresh active cells', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ empty: true })
  wrapper.instance().setGrid()
  // blinker oscillator
  const liveCells = ['20-20','40-20','60-20']
  wrapper.setState({ cells: liveCells, refresh: true })
  wrapper.instance().updateCells()
  jest.advanceTimersByTime(140);
  const refreshedCells = [
    '40-20',
    '40-0',
    '40-40'
  ]
  expect(wrapper.state().cells).toStrictEqual(refreshedCells)
  expect(wrapper.state().generations).toBe(1)
});

test('will make cells active on click', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ empty: true })
  wrapper.instance().setGrid();
  expect(wrapper.state().cells.includes('20-20')).toBe(false)
  wrapper.instance().handleCanvasClick({ clientX: 33, clientY: 28 })
  expect(wrapper.state().cells.includes('20-20')).toBe(true)
});

test('will handle refreshing cells on play', () => {
  const wrapper = shallow(<App />)
  expect(wrapper.state().refresh).toBe(false)
  const controlTop = wrapper.find('ControlTop')
  controlTop.props().onRefresh()
  expect(wrapper.state().refresh).toBe(true)
});

test('will handle stopping cell refresh on pause', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ refresh: true })
  const controlTop = wrapper.find('ControlTop')
  controlTop.props().onPause()
  expect(wrapper.state().refresh).toBe(false)
});

test('will handle resetting grid', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ refresh: true, generations: 10 })
  const controlTop = wrapper.find('ControlTop')
  controlTop.props().onReset()
  expect(wrapper.state().refresh).toBe(false)
  expect(wrapper.state().generations).toBe(0)
});

test('will handle clearing all live cells in the grid', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ refresh: true, generations: 10, empty: false })
  const controlTop = wrapper.find('ControlTop')
  controlTop.props().onClear()
  expect(wrapper.state().refresh).toBe(false)
  expect(wrapper.state().generations).toBe(0)
});

test('will handle adjusting the cellSize', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ refresh: true, generations: 10, empty: false })
  expect(wrapper.state().cellSize).toBe(20)
  const controlBottom = wrapper.find('ControlBottom')
  controlBottom.props().handleCellSize({ target: { value: 32 } })
  expect(wrapper.state().refresh).toBe(false)
  expect(wrapper.state().cellSize).toBe(32)
});

test('will handle adjusting the refresh rate', () => {
  const wrapper = shallow(<App />)
  expect(wrapper.state().refreshRate).toBe(140)
  const controlBottom = wrapper.find('ControlBottom')
  controlBottom.props().onRefreshRate({ target: { value: 300 } })
  expect(wrapper.state().refresh).toBe(false)
  expect(wrapper.state().refreshRate).toBe(300)
});