import React from 'react'
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ControlBottom, ControlTop, Action } from './Controls'

const controlTopProps = {
    width: 80,
    height: 80,
    onRefresh: jest.fn(),
    onPause: jest.fn(),
    isRefreshing: true,
    onReset: jest.fn(),
    onClear: jest.fn(),
    generations: 6
}

const controlBottomProps = {
    width: 80,
    height: 80,
    handleCellSize: jest.fn(),
    onRefreshRate: jest.fn(),
    cellSize: 20,
    refreshRate: 140,
}

test('will render the top control', () => { 
    const wrapper = shallow(<ControlTop {...controlTopProps}/>)
    expect(toJson(wrapper)).toMatchSnapshot();
})

test('will render the bottom control', () => { 
    const wrapper = shallow(<ControlBottom {...controlBottomProps}/>)
    expect(toJson(wrapper)).toMatchSnapshot();
})

test('will render play when not refreshing', () => { 
    const wrapper = shallow(<Action isRefreshing={false}/>)
    expect(toJson(wrapper)).toMatchSnapshot();
})

test('will render pause when refreshing', () => { 
    const wrapper = shallow(<Action isRefreshing={true}/>)
    expect(toJson(wrapper)).toMatchSnapshot();
})