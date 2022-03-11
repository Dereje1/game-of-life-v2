import React from 'react'
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ControlBottom, ControlTop, Action, Links } from './Controls'

const controlTopProps = {
    width: 80,
    height: 80,
    handleRefresh: jest.fn(),
    handlePause: jest.fn(),
    isRefreshing: true,
    handleReset: jest.fn(),
    handleClear: jest.fn(),
    generations: 6
}

const controlBottomProps = {
    width: 80,
    height: 80,
    handleCellSize: jest.fn(),
    handleRefreshRate: jest.fn(),
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

test('will render links', () => { 
    const wrapper = shallow(<Links />)
    expect(toJson(wrapper)).toMatchSnapshot();
})