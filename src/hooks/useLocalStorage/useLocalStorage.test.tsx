import { fireEvent, render, screen } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

interface TestComponentProps {
  lsKey?: any;
  valueToSet?: any;
}
const TestComponent: React.FC<TestComponentProps> = ({ lsKey, valueToSet }) => {
  const [getValue, setValue] = useLocalStorage<any>(lsKey);

  return (
    <div>
      <p id="test">{getValue}</p>
      <button
        onClick={() => {
          setValue(valueToSet);
        }}
      >
        Set Value
      </button>
    </div>
  );
};

describe('useLocalStorage', () => {
  const key = 'testKey';

  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  test('should return undefined if localStorage is empty', () => {
    render(<TestComponent lsKey={key} />);

    expect(document.getElementById('test')?.textContent).toBe('');
  });

  test('should return value from localStorage if it exists', () => {
    window.localStorage.setItem(key, JSON.stringify('storedValue'));
    render(<TestComponent lsKey={key} />);

    expect(document.getElementById('test')?.textContent).toBe('storedValue');
  });

  test('should set value in localStorage', () => {
    render(<TestComponent lsKey={key} valueToSet={'newValue'} />);

    fireEvent.click(screen.getByRole('button', { name: 'Set Value' }));
    expect(window.localStorage.getItem(key)).toBe(JSON.stringify('newValue'));
  });

  test('should remove item from localStorage when setting falsy value', () => {
    window.localStorage.setItem(key, JSON.stringify('storedValue'));
    render(<TestComponent lsKey={key} valueToSet={null} />);

    expect(window.localStorage.getItem(key)).toBe(
      JSON.stringify('storedValue'),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Set Value' }));
    expect(window.localStorage.getItem(key)).toBe(null);
  });

  test('should handle errors when getting from localStorage', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('Error retrieving');
      });

    render(<TestComponent lsKey={key} />);

    expect(document.getElementById('test')?.textContent).toBe('');
    expect(consoleSpy).toHaveBeenCalledWith({
      errLocalStorageGetter: new Error('Error retrieving'),
    });

    // Restore original implementations
    consoleSpy.mockRestore();
    getItemSpy.mockRestore();
  });

  test('should handle errors when setting to localStorage', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const setItemSpy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Error setting');
      });

    render(<TestComponent lsKey={key} valueToSet={'newValue'} />);

    fireEvent.click(screen.getByRole('button', { name: 'Set Value' }));
    expect(consoleSpy).toHaveBeenCalledWith({
      errLocalStorageSetter: new Error('Error setting'),
    });

    // Restore original implementations
    consoleSpy.mockRestore();
    setItemSpy.mockRestore();
  });
});
