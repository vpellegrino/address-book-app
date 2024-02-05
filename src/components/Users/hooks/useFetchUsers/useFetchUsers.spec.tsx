import { act, renderHook, waitFor } from '@testing-library/react';
import useFetchUsers from './useFetchUsers';

describe('useFetchUsers hook', () => {
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

	const initialUsers = [
		{
			name: {
				first: 'John',
				last: 'Doe',
			},
			login: {
				uuid: '789',
				username: 'johndoe',
			},
		},
	];

	beforeEach(() => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ results: mockUsers }),
		});
	});

	it('should fetch users and update state correctly', async () => {
		const { result } = renderHook(() => useFetchUsers());

		await act(async () => {
			await result.current.fetchNextUsersPage();
		});

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});
		expect(result.current.error).toBe(null);
		expect(result.current.endOfCatalog).toBe(false);
		expect(result.current.users).toEqual(mockUsers);
	});

	it('should fetch next page of users and append them to existing users correctly', async () => {
		const initialUsers = mockInitialUsers();
		const { result } = renderHook(() => useFetchUsers());

		// Fetch first page results (initialUsers)
		await act(async () => {
			await result.current.fetchNextUsersPage();
		});

		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ results: mockUsers }),
		});

		// Fetch second page results (mockUsers)
		await act(async () => {
			await result.current.fetchNextUsersPage();
		});

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBe(null);
		expect(result.current.endOfCatalog).toBe(false);
		expect(result.current.users).toEqual([...initialUsers, ...mockUsers]);
	});

	it('should handle network error', async () => {
		const { result } = renderHook(() => useFetchUsers());

		global.fetch = jest.fn().mockResolvedValue({ ok: false });

		await act(async () => {
			await result.current.fetchNextUsersPage();
		});

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});
		expect(result.current.error.message).toBe('Network response was not ok.');
		expect(result.current.endOfCatalog).toBe(false);
		expect(result.current.users).toEqual([]);
	});

	it('should handle fetch error gracefully', async () => {
		const failedToFetchError = 'Failed to fetch';
		const { result } = renderHook(() => useFetchUsers());

		global.fetch = jest.fn().mockRejectedValue(new Error(failedToFetchError));

		await act(async () => {
			await result.current.fetchNextUsersPage();
		});

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});
		expect(result.current.error.message).toBe(failedToFetchError);
		expect(result.current.endOfCatalog).toBe(false);
		expect(result.current.users).toEqual([]);
	});

	it('should handle end of catalog', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ results: [] }),
		});
		const { result } = renderHook(() => useFetchUsers({ maxPageNumber: 0 }));

		await act(async () => {
			await result.current.fetchNextUsersPage();
		});

		expect(result.current.endOfCatalog).toBe(true);
		expect(result.current.loading).toBe(false);
		expect(result.current.users).toEqual([]);
	});

	it('should handle client-side search correctly', async () => {
		const { result } = renderHook(() =>
			useFetchUsers({ searchInProgress: true, searchTerm: 'Mark' })
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});
		expect(result.current.error).toBe(null);
		expect(result.current.endOfCatalog).toBe(true);
		expect(result.current.users).toEqual([mockUsers[0]]);
	});

	it('should clear results on canceling client-side search', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ results: initialUsers }),
		});
		const { result } = renderHook(() =>
			useFetchUsers({ searchInProgress: true, searchTerm: 'John' })
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});
		expect(result.current.error).toBe(null);
		expect(result.current.endOfCatalog).toBe(true);
		expect(result.current.users).toEqual([initialUsers[0]]);

		const { result: afterSearchResult } = renderHook(() =>
			useFetchUsers({ searchInProgress: false })
		);
		act(() => {
			afterSearchResult.current.fetchNextUsersPage();
		});

		await waitFor(() => {
			expect(afterSearchResult.current.loading).toBe(false);
		});
		expect(afterSearchResult.current.error).toBe(null);
		expect(afterSearchResult.current.endOfCatalog).toBe(false);
		expect(afterSearchResult.current.users).toEqual(initialUsers);
	});

	it('should handle client-side search error gracefully', async () => {
		const failedToFetchError = 'Failed to fetch';

		global.fetch = jest.fn().mockRejectedValue(new Error(failedToFetchError));
		const { result } = renderHook(() =>
			useFetchUsers({ searchInProgress: true, searchTerm: 'NotExisting' })
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});
		expect(result.current.error.message).toBe(failedToFetchError);
		expect(result.current.endOfCatalog).toBe(true);
		expect(result.current.users).toEqual([]);
	});

	it('should fetch all users, with no filter regarding the nationality, when it is not set in the settings', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ results: mockUsers }),
		});

		const { result } = renderHook(() => useFetchUsers());

		await act(async () => {
			await result.current.fetchNextUsersPage();
		});

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith(
				expect.not.stringContaining('?nat')
			);
		});
	});

	it('should fetch users belonging to a certain nationality, when it is set in the settings', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ results: [] }),
		});
		window.localStorage.setItem(
			'nationality',
			JSON.stringify({ code: 'FR', name: 'France' })
		);

		const { result } = renderHook(() => useFetchUsers());

		await act(async () => {
			await result.current.fetchNextUsersPage();
		});

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith(
				expect.stringContaining('?nat=FR')
			);
		});
	});

	function mockInitialUsers() {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ results: initialUsers }),
		});
		return initialUsers;
	}
});
