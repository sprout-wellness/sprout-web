import React from 'react';
import { render } from '@testing-library/react';
import { APP } from './App';

test('renders learn react link', () => {
  const { getByText } = render(<APP />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
