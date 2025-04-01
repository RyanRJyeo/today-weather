import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GetWeatherForm from './GetWeatherForm';

describe('GetWeatherForm', () => {
  test('renders the form with all required elements', () => {
    render(<GetWeatherForm />);

    // Check if all form elements are present
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  test('shows validation errors for invalid inputs', async () => {
    render(<GetWeatherForm />);

    // Try to submit empty form
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    // Check for validation messages
    expect(
      await screen.findByText(/city must be at least 2 characters/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/country code must be 2 characters/i),
    ).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<GetWeatherForm />);

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/city/i), 'London');
    await userEvent.type(screen.getByLabelText(/country/i), 'GB');

    // Submit the form
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    // Check if console.log was called with correct values
    expect(consoleSpy).toHaveBeenCalledWith({
      values: {
        city: 'London',
        country: 'GB',
      },
    });

    consoleSpy.mockRestore();
  });

  test('clears form when clear button is clicked', async () => {
    render(<GetWeatherForm />);

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
});
