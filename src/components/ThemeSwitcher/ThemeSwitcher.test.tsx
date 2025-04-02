import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeSwitcher from './ThemeSwitcher';

// Mock the useTheme hook from next-themes
const setTheme = jest.fn();
const mockUseTheme = jest.fn();
jest.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('ThemeSwitcher', () => {
  // using userEvent due to Radix
  const user = userEvent.setup();

  test('calls setTheme with "light" when icon is clicked and current theme is dark', async () => {
    mockUseTheme.mockReturnValue({ setTheme, theme: 'dark' });
    render(<ThemeSwitcher />);

    // Open the dropdown menu
    await user.click(screen.getByRole('button', { name: /toggle theme/i }));

    // Check if setTheme was called with "light"
    expect(setTheme).toHaveBeenCalledWith('light');
    expect(setTheme).toHaveBeenCalledTimes(1);
  });

  test('calls setTheme with "dark" when icon is clicked and current theme is light', async () => {
    mockUseTheme.mockReturnValue({ setTheme, theme: 'light' });
    render(<ThemeSwitcher />);

    // Open the dropdown menu
    await user.click(screen.getByRole('button', { name: /toggle theme/i }));

    // Check if setTheme was called with "dark"
    expect(setTheme).toHaveBeenCalledWith('dark');
    expect(setTheme).toHaveBeenCalledTimes(1);
  });
});
