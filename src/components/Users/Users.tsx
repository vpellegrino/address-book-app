import React, { useEffect, useRef } from 'react';
import {
	Alert,
	EmptyState,
	EmptyStateBody,
	PageSection,
	Title,
} from '@patternfly/react-core';

import UsersTable from '@components/UsersTable';

import useFetchUsers from './hooks/useFetchUsers';
import isEmpty from 'lodash.isempty';

interface UsersProps {
  clientSideSearch?: string;
}

export default function Users({ clientSideSearch }: UsersProps): JSX.Element {
	const searchInProgress = !isEmpty(clientSideSearch);

	const observerTarget = useRef(null);
	const { users, error, fetchNextUsersPage, loading, endOfCatalog } =
    useFetchUsers({ searchInProgress, searchTerm: clientSideSearch });

	useEffect(() => {
		(async () => {
			await fetchNextUsersPage();
		})();
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			async (entries) => {
				if (!endOfCatalog && !loading && entries[0].isIntersecting) {
					// The user reached the end of the page
					await fetchNextUsersPage();
				}
			},
			{ threshold: 1 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [searchInProgress, loading, endOfCatalog, users]);

	const errorState = (
		<EmptyState>
			<Title headingLevel="h2" size="md">
        Unexpected error
			</Title>
			<EmptyStateBody>Error while retrieving the list of users</EmptyStateBody>
		</EmptyState>
	);

	return (
		<PageSection>
			{error ? (
				errorState
			) : (
				<>
					{searchInProgress && (
						<Alert variant="info" title="Search in progress" ouiaId="InfoAlert">
							<p>The loading mechanism is paused while the filter is active</p>
						</Alert>
					)}
					<UsersTable
						users={users}
						loading={loading}
						endOfCatalog={endOfCatalog}
					/>
				</>
			)}
			<div ref={observerTarget} data-testid="observer-target" />
		</PageSection>
	);
}
