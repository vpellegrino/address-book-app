import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type StoredValue<T> = [T, Dispatch<SetStateAction<T>>];

export default function useLocalStorage<T>(
	key: string,
	initialValue: T
): StoredValue<T> {
	const [storedValue, setStoredValue] = useState<T>(getStoredValue);

	function getStoredValue(): T {
		try {
			const item = localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.error('Error retrieving data from localStorage:', error);
			return initialValue;
		}
	}

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(storedValue));
		} catch (error) {
			console.error('Error storing data in localStorage:', error);
		}
	}, [key, storedValue]);

	return [storedValue, setStoredValue];
}
