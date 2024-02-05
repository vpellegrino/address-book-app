import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import User from '@models/User';

import UserModal from './UserModal';

describe('UserModal', () => {
	const mockUser = {
		login: { username: 'john123', uuid: '123' },
		name: { first: 'John', last: 'Doe' },
		email: 'john@example.com',
		gender: 'Male',
		location: { city: 'New York', state: 'NY', country: 'USA' },
		cell: '1234567890',
	} as User;

	test('renders with correct user info', () => {
		render(<UserModal selectedUser={mockUser} onClose={() => {}} />);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Username: john123')).toBeInTheDocument();
		expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
		expect(screen.getByText('Gender: Male')).toBeInTheDocument();
		expect(
			screen.getByText('Location: New York, NY (USA)')
		).toBeInTheDocument();
		expect(screen.getByText('Phone: 1234567890')).toBeInTheDocument();
	});

	test('closes on close button click', () => {
		const onCloseMock = jest.fn();
		render(<UserModal selectedUser={mockUser} onClose={onCloseMock} />);

		const closeButton = screen.getByText('Close');
		act(() => {
			fireEvent.click(closeButton);
		});

		expect(onCloseMock).toHaveBeenCalled();
	});
});
