import { DataContext } from '@/contexts/Data';
import { MOCK_WEATHER_SUCCESS } from '@/lib/mocks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { logger } from '../../lib/logger';
import GetWeatherForm from './GetWeatherForm';

// mock logger lib
jest.mock('../../lib/logger');

// mock fetch API
global.fetch = jest.fn();

describe('GetWeatherForm', () => {
  const mockSetWeather = jest.fn();

  test('renders the form with all required elements', () => {
    render(
      <DataContext.Provider value={{ setWeather: mockSetWeather }}>
        <GetWeatherForm />
      </DataContext.Provider>,
    );

    // Check if all form elements are present
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  test('shows validation errors if city input is not filled', async () => {
    render(
      <DataContext.Provider value={{ setWeather: mockSetWeather }}>
        <GetWeatherForm />
      </DataContext.Provider>,
    );

    // Try to submit empty form
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    // Check for validation messages
    expect(
      await screen.findByText(/city must be at least 2 characters/i),
    ).toBeInTheDocument();
  });

  test('shows validation errors if country input is not 2 characters', async () => {
    render(
      <DataContext.Provider value={{ setWeather: mockSetWeather }}>
        <GetWeatherForm />
      </DataContext.Provider>,
    );

    // Try to submit empty form
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/city/i), 'London');
    await userEvent.type(screen.getByLabelText(/country/i), 'GBBB');

    // Check for validation messages
    expect(
      await screen.findByText(/country code must be 2 characters/i),
    ).toBeInTheDocument();
  });

  test('submits form with fetch error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce('Test Error');
    render(
      <DataContext.Provider value={{ setWeather: mockSetWeather }}>
        <GetWeatherForm />
      </DataContext.Provider>,
    );

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/city/i), 'London');
    await userEvent.type(screen.getByLabelText(/country/i), 'GB');

    // Submit the form
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/weather?city=London&country=GB',
      { method: 'GET' },
    );
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      'error in create inventory',
      'Test Error',
    );
    expect(mockSetWeather).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    const mockResponse = { ok: true, json: async () => MOCK_WEATHER_SUCCESS };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
    render(
      <DataContext.Provider value={{ setWeather: mockSetWeather }}>
        <GetWeatherForm />
      </DataContext.Provider>,
    );

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/city/i), 'London');
    await userEvent.type(screen.getByLabelText(/country/i), 'GB');

    // Submit the form
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/weather?city=London&country=GB',
      { method: 'GET' },
    );
    expect(logger.error).not.toHaveBeenCalled();
    expect(mockSetWeather).toHaveBeenCalledTimes(1);
    expect(mockSetWeather).toHaveBeenCalledWith(MOCK_WEATHER_SUCCESS);
  });

  test('clears form when clear button is clicked', async () => {
    render(
      <DataContext.Provider value={{ setWeather: mockSetWeather }}>
        <GetWeatherForm />
      </DataContext.Provider>,
    );

    // Fill in the form
    const cityInput = screen.getByLabelText(/city/i);
    const countryInput = screen.getByLabelText(/country/i);

    await userEvent.type(cityInput, 'London');
    await userEvent.type(countryInput, 'GB');

    // Click clear button
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await userEvent.click(clearButton);

    // Check if inputs are cleared
    expect(cityInput).toHaveValue('');
    expect(countryInput).toHaveValue('');
  });

  test('renders the form with prefilled inputs if searchValues is given', () => {
    render(
      <DataContext.Provider
        value={{
          setWeather: mockSetWeather,
          searchValues: { city: 'New York', country: 'US' },
        }}
      >
        <GetWeatherForm />
      </DataContext.Provider>,
    );

    expect(screen.getByLabelText(/city/i)).toHaveValue('New York');
    expect(screen.getByLabelText(/country/i)).toHaveValue('US');
  });
});
