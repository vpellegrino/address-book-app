import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Settings from './Settings';

describe('Settings', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	test('renders Settings page with initial selected nationality', () => {
		render(
			<BrowserRouter>
				<Settings />
			</BrowserRouter>
		);
		const selectNationality = screen.getByText('Select Nationality');
		expect(selectNationality).toBeInTheDocument();
	});

	test('selects a nationality from the dropdown', () => {
		render(
			<BrowserRouter>
				<Settings />
			</BrowserRouter>
		);

		let dropdownToggle: HTMLElement;
		act(() => {
			dropdownToggle = screen.getByText('Select Nationality');
			fireEvent.click(dropdownToggle);
		});
		act(() => {
			const nationalityOption = screen.getByText('Switzerland');
			fireEvent.click(nationalityOption);
		});

		expect(dropdownToggle.textContent).toBe('Switzerland');
	});

	test('displays selected nationality after page refresh', () => {
		const { rerender } = render(
			<BrowserRouter>
				<Settings />
			</BrowserRouter>
		);

		let dropdownToggle: HTMLElement;
		act(() => {
			dropdownToggle = screen.getByText('Select Nationality');
			fireEvent.click(dropdownToggle);
		});
		act(() => {
			const nationalityOption = screen.getByText('France');
			fireEvent.click(nationalityOption);
		});

		expect(dropdownToggle.textContent).toBe('France');

		act(() => {
			window.localStorage.setItem(
				'nationality',
				JSON.stringify({ code: 'FR', name: 'France' })
			);
			// Simulating page refresh
			rerender(
				<BrowserRouter>
					<Settings />
				</BrowserRouter>
			);
		});
		expect(screen.getByText('France')).toBeInTheDocument();
	});

	test('displays reset option and resets selected nationality', () => {
		render(
			<BrowserRouter>
				<Settings />
			</BrowserRouter>
		);

		let dropdownToggle: HTMLElement;
		act(() => {
			dropdownToggle = screen.getByText('Select Nationality');
			fireEvent.click(dropdownToggle);
		});
		act(() => {
			const resetOption = screen.getByText('Reset selection');
			fireEvent.click(resetOption);
		});

		expect(dropdownToggle.textContent).toBe('Select Nationality');
	});
});
