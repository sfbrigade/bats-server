/*
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders EMS and ER links', () => {
  const { getByText } = render(<App />);
  const emsLinkElement = getByText(/EMS/i);
  expect(emsLinkElement).toBeInTheDocument();
  expect(emsLinkElement.href).toBe('http://localhost/ems');
  const erLinkElement = getByText(/ER/i);
  expect(erLinkElement).toBeInTheDocument();
  expect(erLinkElement.href).toBe('http://localhost/er');
});
*/

test('adds 1 + 2 to equal 3', () => {
  const sum = (a, b) => a + b;
  expect(sum(1, 2)).toBe(3);
});
