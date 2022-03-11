import React from 'react'
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import PatternsDialog from './PatternsDialog'

let props;
beforeEach(()=>{
    props = {
        open: true,
        value: 'Blinker',
        handleCancel: jest.fn(),
        handleOk: jest.fn(),
        handlePatternChange: jest.fn(),
    }
})

afterEach(()=>{
    props=null
})

test('will render the top control', () => { 
    const wrapper = shallow(<PatternsDialog {...props}/>)
    expect(toJson(wrapper)).toMatchSnapshot();
})