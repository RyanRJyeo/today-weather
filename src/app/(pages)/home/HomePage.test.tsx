import { render, screen } from '@testing-library/react';
import React from 'react';
import HomePage from './HomePage';

jest.mock('../../../components/GetWeatherForm', () => () => (
  <div>Mocked GetWeatherForm</div>
));
jest.mock('../../../components/GetWeatherResult', () => () => (
  <div>Mocked GetWeatherResult</div>
));

describe('HomePage', () => {
  test("renders the Today's Weather section title and the mocked components", () => {
    render(<HomePage />);

    expect(screen.getByText("Today's Weather")).toBeInTheDocument();
    expect(screen.getByText('Mocked GetWeatherForm')).toBeInTheDocument();
    expect(screen.getByText('Mocked GetWeatherResult')).toBeInTheDocument();
  });
});
