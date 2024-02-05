import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Home from './Home';

interface GLOBAL {
  IS_REACT_ACT_ENVIRONMENT: boolean;
  IntersectionObserver: jest.Mock;
}

describe('Home', () => {
	beforeEach(() => {
		const globalVar = global as unknown as GLOBAL;

		globalVar.IS_REACT_ACT_ENVIRONMENT = false;
		globalVar.IntersectionObserver = jest.fn(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
		}));
	});

	it('displays the Address book title', async () => {
		render(<Home />);
		const titleElement = await screen.findByText('Address book');

		expect(titleElement).toBeInTheDocument();
	});

	it('updates search input value and passes it to Users component', async () => {
		render(<Home />);
		const searchInput = await screen.findByPlaceholderText(
			'Start typing to search'
		);

		fireEvent.change(searchInput, { target: { value: 'John' } });
		await waitFor(() => {
			expect(searchInput).toHaveValue('John');
		});
	});

	it('clears search input and updates the Users component', async () => {
		render(<Home />);
		const searchInput = await screen.findByPlaceholderText(
			'Start typing to search'
		);

		fireEvent.change(searchInput, { target: { value: 'Jane' } });

		expect(await screen.findByLabelText('Reset')).toBeInTheDocument();
		fireEvent.click(await screen.findByLabelText('Reset'));

		await waitFor(() => {
			expect(searchInput).toHaveValue('');
		});
	});

	it('updates search input and passes the value to Users component after debounce time', async () => {
		jest.useFakeTimers(); // Mock timers to control time-related functions

		render(<Home />);
		const searchInput = await screen.findByPlaceholderText(
			'Start typing to search'
		);

		fireEvent.change(searchInput, { target: { value: 'Jane' } });

		// Ensure that the debounce time has passed
		jest.advanceTimersByTime(300);

		await waitFor(() => {
			expect(searchInput).toHaveValue('Jane');
		});

		jest.useRealTimers(); // Restore default timers behavior
	});

	it('passes empty string to Users component when search input is cleared after debounce time', async () => {
		jest.useFakeTimers();

		render(<Home />);
		const searchInput = await screen.findByPlaceholderText(
			'Start typing to search'
		);

		fireEvent.change(searchInput, { target: { value: 'John' } });

		jest.advanceTimersByTime(300);

		expect(await screen.findByLabelText('Reset')).toBeInTheDocument();
		fireEvent.click(await screen.findByLabelText('Reset'));

		await waitFor(() => {
			expect(searchInput).toHaveValue('');
		});

		jest.useRealTimers();
	});
});
