import { useEffect, useRef, useState } from 'react';

import User from '@models/User';
import Nationality from '@models/Nationality';
import useLocalStorage from '@hooks/useLocalStorage';

const RANDOM_USERS_API = 'https://randomuser.me/api';
const RANDOM_USERS_SEED = 'address-book';
const CATALOGUE_LENGTH = 1000;
const PAGINATION_SIZE = 50;
const MAX_PAGE_NUMBER = CATALOGUE_LENGTH / PAGINATION_SIZE;

interface FetchUsersProps {
  maxPageNumber?: number;
  searchInProgress?: boolean;
  searchTerm?: string;
}

export default function useFetchUsers({
	maxPageNumber = MAX_PAGE_NUMBER,
	searchInProgress = false,
	searchTerm = '',
}: FetchUsersProps = {}): {
  fetchNextUsersPage: (searchInProgress?: boolean) => Promise<void>;
  loading: boolean;
  error: Error;
  users: User[];
  endOfCatalog: boolean;
} {
	const [storedNationality] = useLocalStorage<Nationality>('nationality', null);

	const pageNumber = useRef(0);
	const [endOfCatalog, setEndOfCatalog] = useState(false);
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState<User[]>([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (searchInProgress) {
			setEndOfCatalog(true);
			performClientSideSearch();
		} else if (!searchInProgress && endOfCatalog) {
			pageNumber.current = 0;
			setEndOfCatalog(false);
			setUsers([]);
		}
	}, [searchInProgress, searchTerm]);

	const performClientSideSearch = () => {
		fetchUsers(1, CATALOGUE_LENGTH)
			.then((users) => {
				const filteredUsers = users.filter((user) =>
					`${user.name.first} ${user.name.last}`
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
				);
				setUsers(filteredUsers);
			})
			.catch((error) => setError(error));
	};

	const fetchUsers = async (
		pageToFetch: number,
		paginationSize = PAGINATION_SIZE
	) => {
		setLoading(true);
		setError(null);
		try {
			const nationalityParam = storedNationality
				? `?nat=${storedNationality.code}&`
				: '?';
			const url = `${RANDOM_USERS_API}${nationalityParam}seed=${RANDOM_USERS_SEED}&results=${paginationSize}&page=${pageToFetch}`;
			const response = await fetch(url);
			if (!response.ok) {
				setError(Error('Network response was not ok.'));
				return [];
			}
			const userData: { results: User[] } = await response.json();
			return userData.results;
		} catch (error) {
			setError(error);
			return [];
		} finally {
			setLoading(false);
		}
	};

	const fetchNextUsersPage = async () => {
		if (endOfCatalog) {
			return;
		}

		const nextPageNumber = pageNumber.current + 1;
		pageNumber.current = nextPageNumber;

		const noMorePagesToFetch = nextPageNumber >= maxPageNumber;
		setEndOfCatalog(noMorePagesToFetch);

		const newUsers = await fetchUsers(nextPageNumber);
		setUsers((prevUsers) => [...prevUsers, ...newUsers]);
	};

	return {
		fetchNextUsersPage,
		users,
		loading,
		endOfCatalog,
		error,
	};
}
