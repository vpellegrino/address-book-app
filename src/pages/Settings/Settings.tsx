import React, { useState } from 'react';
import {
	Divider,
	Dropdown,
	DropdownItem,
	DropdownList,
	MenuToggle,
	MenuToggleElement,
	PageSection,
	Text,
	Title,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import useLocalStorage from '@hooks/useLocalStorage';
import Nationality from '@models/Nationality';

import style from './Settings.scss';

const nationalities: Nationality[] = [
	{ code: 'CH', name: 'Switzerland' },
	{ code: 'ES', name: 'Spain' },
	{ code: 'FR', name: 'France' },
	{ code: 'GB', name: 'United Kingdom' },
];

export default function Settings(): JSX.Element {
	const [storedNationality, setStoredNationality] =
    useLocalStorage<Nationality>('nationality', null);

	const [isOpen, setIsOpen] = useState(false);
	const [selectedNationality, setSelectedNationality] =
    useState(storedNationality);

	const onSelect = (
		_event: React.MouseEvent<Element, MouseEvent> | undefined,
		value: string | number | undefined
	) => {
		const nationality = nationalities.find((n) => n.code === value) ?? null;
		setSelectedNationality(nationality);
		setStoredNationality(nationality);
		setIsOpen(false);
	};

	const dropdownItems = nationalities.map((n) => (
		<DropdownItem
			key={n.code}
			value={n.code}
			className={
				n.code === selectedNationality?.code ? style.selectedNationality : ''
			}
		>
			{n.name}
		</DropdownItem>
	));

	return (
		<>
			<PageSection>
				<Title headingLevel="h1">Settings</Title>
			</PageSection>
			<PageSection>
				<Text>
          The Nationality below will be applied as filter criteria in the{' '}
					<Link to="/">Home page</Link>.
				</Text>
				<Dropdown
					className={style.nationalityDropdown}
					onSelect={onSelect}
					onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
					toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
						<MenuToggle
							ref={toggleRef}
							onClick={() => setIsOpen(!isOpen)}
							isExpanded={isOpen}
						>
							{selectedNationality?.name ?? 'Select Nationality'}
						</MenuToggle>
					)}
					isOpen={isOpen}
				>
					<DropdownList>
						<DropdownItem key={null} value={null}>
							<Text className={style.resetOption}>Reset selection</Text>
						</DropdownItem>
						<Divider component="li" key="separator" />
						{dropdownItems}
					</DropdownList>
				</Dropdown>
			</PageSection>
		</>
	);
}
