import React from 'react';
import { act, render, screen } from '@testing-library/react';

import Users from './Users';
import useFetchUsers from './hooks/useFetchUsers';

jest.mock('./hooks/useFetchUsers');

describe('Users', () => {
	const mockUsers = [
		{
			name: {
				first: 'Mark',
				last: 'Owen',
			},
			login: {
				uuid: '123',
				username: 'mark',
			},
		},
		{
			name: {
				first: 'George',
				last: 'Gallagher',
			},
			login: {
				uuid: '456',
				username: 'gallag',
			},
		},
	];

	beforeEach(() => {
		(global.IntersectionObserver as jest.Mock) = jest.fn(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
		}));
	});

	it('renders error state when error is present', () => {
		(useFetchUsers as jest.Mock).mockReturnValue({
			users: [],
			error: new Error('Test error'),
			loading: false,
			endOfCatalog: false,
			fetchNextUsersPage: jest.fn(),
		});

		render(<Users />);
		const errorMessage = screen.getByText('Unexpected error');
		expect(errorMessage).toBeInTheDocument();
	});

	it('renders user table when no error', () => {
		(useFetchUsers as jest.Mock).mockReturnValue({
			users: mockUsers,
			error: null,
			loading: false,
			endOfCatalog: false,
			fetchNextUsersPage: jest.fn(),
		});

		render(<Users />);

		const table = screen.getByRole('grid', { name: 'Users list' });
		expect(table).toBeInTheDocument();
		mockUsers.forEach((user) => {
			const name = screen.getByText(user.name.first);
			const surname = screen.getByText(user.name.last);
			expect(name).toBeInTheDocument();
			expect(surname).toBeInTheDocument();
		});
		expect(screen.queryByText('Unexpected error')).toBeNull();
	});

	it('fetches further users when scrolled to observer target', async () => {
		const fetchNextUsersPage = jest.fn();
		(useFetchUsers as jest.Mock).mockReturnValue({
			users: mockUsers,
			error: null,
			loading: false,
			endOfCatalog: false,
			fetchNextUsersPage,
		});
		await mockScrolledToObserverTarget();

		render(<Users />);

		expect(fetchNextUsersPage).toHaveBeenCalled();
	});

	test('renders alert when search in progress', () => {
		render(<Users clientSideSearch="John" />);
		const alertElement = screen.getByRole('heading');
		expect(alertElement).toBeInTheDocument();

		const alertTitle = screen.getByText('Search in progress');
		expect(alertTitle).toBeInTheDocument();

		const alertContent = screen.getByText(
			'The loading mechanism is paused while the filter is active'
		);
		expect(alertContent).toBeInTheDocument();
	});

	test('does not render alert when no search in progress', () => {
		render(<Users />);
		const alertElement = screen.queryByRole('alert');
		expect(alertElement).toBeNull();
	});
});

async function mockScrolledToObserverTarget() {
	await act(async () => {
		(global.IntersectionObserver as unknown) = class IntersectionObserver {
			constructor(
        public func: (
          p: { isIntersecting: boolean; target: HTMLElement }[]
        ) => void,
        private options: unknown
			) {}

			observe(element: HTMLElement): void {
				this.func([{ isIntersecting: true, target: element }]);
			}

			disconnect(): void {
				return null;
			}

			unobserve(): void {
				return null;
			}
		};
	});
}
