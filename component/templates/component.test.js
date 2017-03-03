import React from 'react';
import renderer from 'react-test-renderer';
import { <%= proper %> } from './';

test('renders correctly', () => {
  const tree = renderer.create(
    <<%= proper %> />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
