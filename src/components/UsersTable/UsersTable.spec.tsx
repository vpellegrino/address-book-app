import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import User from '@models/User';

import UsersTable from './UsersTable';

describe('UsersTable', () => {
	const mockUsers = [
		{
			login: {
				uuid: '1',
				username: 'john_doe',
			},
			name: {
				first: 'John',
				last: 'Doe',
			},
			email: 'john@example.com',
			picture: {
				thumbnail: 'https://example.com/john-thumbnail.jpg',
			},
			location: {
				city: 'Manisa',
				state: 'Amasya',
				country: 'Turkey',
			},
		},
	] as User[];

	it('renders loading message when loading is true', () => {
		const { getByText } = render(
			<UsersTable users={[]} loading={true} endOfCatalog={false} />
		);

		const loadingMessage = getByText('Loading');
		expect(loadingMessage).toBeInTheDocument();
	});

	it('renders end of catalog message when endOfCatalog is true', () => {
		const { getByText } = render(
			<UsersTable users={[]} loading={false} endOfCatalog={true} />
		);

		const endOfCatalogMessage = getByText('End of users catalog');
		expect(endOfCatalogMessage).toBeInTheDocument();
	});

	it('renders user table rows correctly', () => {
		const { getByAltText, getByText } = render(
			<UsersTable users={mockUsers} loading={false} endOfCatalog={false} />
		);

		mockUsers.forEach((user) => {
			const thumbnail = getByAltText('user picture thumbnail');
			expect(thumbnail).toHaveAttribute('src', user.picture.thumbnail);

			expect(getByText(user.name.first)).toBeInTheDocument();
			expect(getByText(user.name.last)).toBeInTheDocument();
			expect(getByText(user.login.username)).toBeInTheDocument();
			expect(getByText(user.email)).toBeInTheDocument();
		});
	});

	test('opens a modal when clicking on a row', () => {
		const { container, queryByRole, getByRole } = render(
			<UsersTable users={mockUsers} loading={false} endOfCatalog={false} />
		);

		expect(queryByRole('dialog')).toBeNull();

		const row = container.querySelector('tbody tr');
		act(() => {
			fireEvent.click(row);
		});

		waitFor(() => {
			expect(getByRole('dialog')).toBeInTheDocument();
		});
	});

	test('closes the modal when clicking on the corresponding close button', () => {
		const { container, getByRole, queryByRole, getByText } = render(
			<UsersTable users={mockUsers} loading={false} endOfCatalog={false} />
		);

		const row = container.querySelector('tbody tr');
		act(() => {
			fireEvent.click(row);
		});

		waitFor(() => {
			expect(getByRole('dialog')).toBeInTheDocument();
		});

		const closeButton = getByText('Close');
		act(() => {
			fireEvent.click(closeButton);
		});

		waitFor(() => {
			expect(queryByRole('dialog')).toBeNull();
		});
	});
});
