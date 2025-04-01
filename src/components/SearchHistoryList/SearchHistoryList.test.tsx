import { DataContext } from '@/contexts/Data/DataContext';
import { render, screen } from '@testing-library/react';
import SearchHistoryList from './SearchHistoryList';

// Mock the DataContext
const mockSearchHistory = [
  { key: 'London', date: '2024-04-01' },
  { key: 'New York', date: '2024-04-02' },
];

const mockContextValue = {
  searchHistory: mockSearchHistory,
  setSearchHistory: jest.fn(),
};

const mockEmptyContextValue = {
  searchHistory: [],
  setSearchHistory: jest.fn(),
};

describe('SearchHistoryList', () => {
  it('renders search history items correctly', () => {
    render(
      <DataContext.Provider value={mockContextValue}>
        <SearchHistoryList />
      </DataContext.Provider>,
    );

    // Check if all search history items are rendered
    for (const item of mockSearchHistory) {
      expect(screen.getByText(item.key)).toBeInTheDocument();
      expect(screen.getByText(item.date)).toBeInTheDocument();
    }
  });

  it('displays "No Record" when search history is empty', () => {
    render(
      <DataContext.Provider value={mockEmptyContextValue}>
        <SearchHistoryList />
      </DataContext.Provider>,
    );

    expect(screen.getByText('No Record')).toBeInTheDocument();
  });

  it('renders table with correct structure', () => {
    render(
      <DataContext.Provider value={mockContextValue}>
        <SearchHistoryList />
      </DataContext.Provider>,
    );

    // Check if table is rendered
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('min-w-[450px]');
  });
});
