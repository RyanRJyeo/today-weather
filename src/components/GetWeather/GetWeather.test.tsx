import { render, screen } from '@testing-library/react';
import React from 'react';
import GetWeather from './GetWeather';

jest.mock('./GetWeatherForm', () => () => <div>Mocked GetWeatherForm</div>);
jest.mock('./GetWeatherResult', () => () => <div>Mocked GetWeatherResult</div>);

describe('GetWeather', () => {
  test('renders the mocked GetWeatherForm', () => {
    render(<GetWeather />);

    expect(screen.getByText('Mocked GetWeatherForm')).toBeInTheDocument();
  });

  test('renders the mocked GetWeatherResult', () => {
    render(<GetWeather />);

    expect(screen.getByText('Mocked GetWeatherResult')).toBeInTheDocument();
  });
});
