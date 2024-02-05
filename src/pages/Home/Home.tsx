import React, { useRef, useState } from 'react';
import {
	debounce,
	InputGroup,
	PageSection,
	SearchInput,
	Title,
} from '@patternfly/react-core';

import Users from '@components/Users';

import style from './Home.scss';

export default function Home(): JSX.Element {
	const [searchValue, setSearchValue] = useState('');
	const debouncedSearch = useRef(
		debounce((value) => {
			setSearchValue(value);
		}, 300)
	);

	const handleSearchChange = (
		_event: React.FormEvent<HTMLButtonElement>,
		value: string
	) => {
		debouncedSearch.current(value);
	};

	return (
		<>
			<PageSection>
				<Title headingLevel="h1">Address book</Title>
			</PageSection>
			<PageSection className={style.sticky}>
				<InputGroup>
					<SearchInput
						value={searchValue}
						onChange={handleSearchChange}
						type="search"
						aria-label="Search input"
						placeholder="Start typing to search"
						onClear={(event) => handleSearchChange(event, '')}
					/>
				</InputGroup>
			</PageSection>
			<Users clientSideSearch={searchValue} />
		</>
	);
}
