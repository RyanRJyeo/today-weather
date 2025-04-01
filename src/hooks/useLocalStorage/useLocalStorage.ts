import { useEffect, useState } from 'react';

type useLocalStorageType<T> = [T | undefined, (value?: T) => void];

export const useLocalStorage = <T>(
  key: string,
  initialValue?: T,
): useLocalStorageType<T> => {
  const [state, setState] = useState<T | undefined>();

  const getValue = () => {
    try {
      if (typeof window !== 'undefined') {
        const value = window.localStorage.getItem(key);
        // Check if the local storage already has any values,
        // parse and return it if yes, return undefined if no.
        return value ? (JSON.parse(value) as T) : undefined;
      }
    } catch (error) {
      console.log({ errLocalStorageGetter: error });
    }
  };

  useEffect(() => {
    const firstValueToSet = getValue() ?? initialValue;
    setState(firstValueToSet);
  }, []);

  const setValue = (value?: T) => {
    try {
      // If the passed value is falsy, remove the item
      if (!value) {
        window.localStorage.removeItem(key);
      } else {
        // If the passed value is truthy, set the value of the item
        window.localStorage.setItem(key, JSON.stringify(value));
      }
      setState(value);
    } catch (error) {
      console.log({ errLocalStorageSetter: error });
    }
  };

  return [state, setValue];
};
