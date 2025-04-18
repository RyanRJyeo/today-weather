import { DataContext } from '@/contexts/Data';
import { MOCK_SEARCH_HISTORY_LIST } from '@/lib/mocks';
import { fireEvent, render, screen } from '@testing-library/react';
import SearchHistoryList from './SearchHistoryList';

const mockRemoveSearch = jest.fn();
const mockSetSearchValues = jest.fn();
const mockContextValue = {
  searchHistory: MOCK_SEARCH_HISTORY_LIST,
  removeSearch: mockRemoveSearch,
  setSearchValues: mockSetSearchValues,
};

const mockEmptyContextValue = {
  searchHistory: [],
};

describe('SearchHistoryList', () => {
  test('renders search history items correctly', () => {
    render(
      <DataContext.Provider value={mockContextValue}>
        <SearchHistoryList />
      </DataContext.Provider>,
    );

    // Check if all search history items are rendered
    MOCK_SEARCH_HISTORY_LIST.forEach((item, index) => {
      expect(screen.getByText(`${index + 1}. ${item.key}`)).toBeInTheDocument();
      expect(screen.getByText(item.time)).toBeInTheDocument();
    });
  });

  test('displays "No Record" when search history is empty', () => {
    render(
      <DataContext.Provider value={mockEmptyContextValue}>
        <SearchHistoryList />
      </DataContext.Provider>,
    );

    expect(screen.getByText('No Record')).toBeInTheDocument();
  });

  test('renders table with correct structure', () => {
    render(
      <DataContext.Provider value={mockContextValue}>
        <SearchHistoryList />
      </DataContext.Provider>,
    );

    // Check if table is rendered
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('min-w-[346px]');
  });

  test('mockRemoveSearch is called when the delete button is clicked', () => {
    render(
      <DataContext.Provider value={mockContextValue}>
        <SearchHistoryList />
      </DataContext.Provider>,
    );

    const deleteButton = screen.getByRole('button', {
      name: 'delete-New York, US',
    });
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    expect(mockRemoveSearch).toHaveBeenCalledTimes(1);
    expect(mockRemoveSearch).toHaveBeenCalledWith('New York, US');
  });

  test('mockSetSearchValues is called when the search button is clicked', () => {
    render(
      <DataContext.Provider value={mockContextValue}>
        <SearchHistoryList />
      </DataContext.Provider>,
    );

    const searchButton = screen.getByRole('button', {
      name: 'search-New York, US',
    });
    expect(searchButton).toBeInTheDocument();

    fireEvent.click(searchButton);

    expect(mockSetSearchValues).toHaveBeenCalledTimes(1);
    expect(mockSetSearchValues).toHaveBeenCalledWith({
      city: 'New York',
      country: 'US',
    });
  });
});
