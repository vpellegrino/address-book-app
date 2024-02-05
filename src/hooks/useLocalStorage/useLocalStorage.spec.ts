import { act, renderHook } from '@testing-library/react';

import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
	const consoleError = jest
		.spyOn(console, 'error')
		.mockImplementation(() => {});

	beforeEach(() => {
		// Mock localStorage methods
		const localStorageMock = {
			getItem: jest.fn(),
			setItem: jest.fn(),
			removeItem: jest.fn(),
		};
		Object.defineProperty(window, 'localStorage', { value: localStorageMock });
	});

	afterAll(() => {
		consoleError.mockReset();
	});

	it('should initialize with the initial value when localStorage is empty', () => {
		const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

		expect(result.current[0]).toBe('initial');
	});

	it('should read the stored value from localStorage', () => {
		(window.localStorage.getItem as jest.Mock).mockReturnValueOnce(
			JSON.stringify('storedValue')
		);

		const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

		act(() => {
			expect(result.current[0]).toBe('storedValue');
		});
	});

	it('should update localStorage when the value changes', () => {
		const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

		act(() => {
			result.current[1]('newValue');
		});

		expect(window.localStorage.setItem).toHaveBeenCalledWith(
			'testKey',
			JSON.stringify('newValue')
		);
	});

	it('should catch errors when retrieving data from localStorage', () => {
		(window.localStorage.getItem as jest.Mock).mockImplementationOnce(() => {
			throw new Error('LocalStorage error');
		});

		try {
			renderHook(() => useLocalStorage('testKey', 'initial'));
		} catch (error) {
			expect(error).toBeDefined();
			expect(consoleError).toHaveBeenCalled();
		}
	});

	it('should catch errors when storing data in localStorage', () => {
		(window.localStorage.setItem as jest.Mock).mockImplementationOnce(() => {
			throw new Error('LocalStorage error');
		});

		const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
		try {
			result.current[1]('newValue');
		} catch (error) {
			expect(error).toBeDefined();
			expect(consoleError).toHaveBeenCalled();
		}
	});
});
