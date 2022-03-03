/**
 * @jest-environment jsdom
 */
import React from 'react'
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import App from './App';

let useRefSpy;
beforeEach(()=>{
  useRefSpy = jest.spyOn(React, 'createRef').mockReturnValueOnce({ current: document.createElement('canvas') });
})
afterEach(()=>{
  useRefSpy.mockClear();
})

test('renders', () => {
  const wrapper = shallow(<App />)
  expect(toJson(wrapper)).toMatchSnapshot();
});
