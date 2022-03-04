/**
 * @jest-environment jsdom
 */
import React from 'react'
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import App from './App';

const cellsStub = {
  '0-0': { isAlive: false },
  '0-20': { isAlive: false },
  '0-40': { isAlive: false },
  '0-60': { isAlive: false },
  '20-0': { isAlive: false },
  '20-20': { isAlive: false },
  '20-40': { isAlive: false },
  '20-60': { isAlive: false },
  '40-0': { isAlive: false },
  '40-20': { isAlive: false },
  '40-40': { isAlive: false },
  '40-60': { isAlive: false },
  '60-0': { isAlive: false },
  '60-20': { isAlive: false },
  '60-40': { isAlive: false },
  '60-60': { isAlive: false },
}
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
  global.innerWidth = 120;
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
  expect(wrapper.state().cells).toStrictEqual(cellsStub)
  expect(wrapper.state().canvasWidth).toBe(80)
  expect(wrapper.state().canvasHeight).toBe(80)
});

test('will draw active cells', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ empty: true })
  wrapper.instance().setGrid()
  const updatedCells = {
    ...cellsStub,
    '20-20': {
      isAlive: true
    }
  }
  wrapper.setState({ cells: updatedCells })
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
  const updatedCells = {
    ...cellsStub,
    '20-20': {
      isAlive: true
    },
    '40-20': {
      isAlive: true
    },
    '60-20': {
      isAlive: true
    }
  }
  wrapper.setState({ cells: updatedCells, refresh: true })
  wrapper.instance().updateCells()
  jest.advanceTimersByTime(140);
  const refreshedCells = {
    ...cellsStub,
    '40-0': {
      isAlive: true
    },
    '40-20': {
      isAlive: true
    },
    '40-40': {
      isAlive: true
    }
  }
  expect(wrapper.state().cells).toStrictEqual(refreshedCells)
  expect(wrapper.state().generations).toBe(1)
});

test('will make cells active on click', () => {
  const wrapper = shallow(<App />)
  wrapper.setState({ empty: true })
  wrapper.instance().setGrid();
  expect(wrapper.state().cells['20-20'].isAlive).toBe(false)
  wrapper.instance().handleCanvasClick({ clientX: 33, clientY: 28 })
  expect(wrapper.state().cells['20-20'].isAlive).toBe(true)
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
