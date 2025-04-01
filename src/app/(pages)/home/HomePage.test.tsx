import { render, screen } from '@testing-library/react';
import React from 'react';
import HomePage from './HomePage';

jest.mock('../../../components/GetWeather', () => () => (
  <div>Mocked GetWeather</div>
));

describe('HomePage', () => {
  test("renders the Today's Weather section title and the mocked section", () => {
    render(<HomePage />);

    expect(screen.getByText("Today's Weather")).toBeInTheDocument();
    expect(screen.getByText('Mocked GetWeather')).toBeInTheDocument();
  });
});
