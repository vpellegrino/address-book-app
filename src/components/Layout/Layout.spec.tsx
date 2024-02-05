import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Layout from './Layout';

describe('Layout', () => {
	const TEST_CHILDREN = <div>Test Children</div>;

	it('renders children properly', () => {
		render(
			<MemoryRouter>
				<Layout>{TEST_CHILDREN}</Layout>
			</MemoryRouter>
		);

		expect(screen.getByText('Test Children')).toBeInTheDocument();
	});

	it('toggles sidebar visibility when masthead button is clicked', () => {
		render(
			<MemoryRouter>
				<Layout>{TEST_CHILDREN}</Layout>
			</MemoryRouter>
		);

		// Initially, sidebar is open
		const sidebar = screen.getByText('Home');
		expect(sidebar).toBeInTheDocument();

		// Click masthead button to close sidebar
		const mastheadButton = screen.getByRole('button', {
			name: 'Global navigation',
		});
		fireEvent.click(mastheadButton);

		// Sidebar should be closed
		expect(sidebar).not.toBeInTheDocument();

		// Click masthead button again to open sidebar
		fireEvent.click(mastheadButton);

		// Sidebar should be open again
		waitFor(() => {
			expect(sidebar).toBeInTheDocument();
		});
	});

	it('navigates to Home when Home link is clicked', () => {
		assertNavigation({ currentLocation: '/settings', link: 'Home', url: '/' });
	});

	it('navigates to Settings when Settings link is clicked', () => {
		assertNavigation({
			currentLocation: '/',
			link: 'Settings',
			url: '/settings',
		});
	});

	function assertNavigation({ currentLocation = '', link = '', url = '' }) {
		const history = createMemoryHistory();
		history.push = jest.fn();

		render(
			<Router location={currentLocation} navigator={history}>
				<Layout>{TEST_CHILDREN}</Layout>
			</Router>
		);

		fireEvent.click(screen.getByText(link));

		expect(history.push).toHaveBeenCalledWith(
			expect.objectContaining({
				hash: '',
				pathname: url,
				search: '',
			}),
			undefined,
			expect.anything()
		);
	}
});
