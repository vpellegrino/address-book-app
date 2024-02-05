import * as React from 'react';
import {
	Button,
	Masthead,
	MastheadToggle,
	Nav,
	NavItem,
	NavList,
	Page,
	PageSection,
	PageSidebar,
	PageSidebarBody,
} from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons';
import { NavLink, useLocation } from 'react-router-dom';

import style from './Layout.scss';

interface LayoutProps {
  children: JSX.Element;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = React.useState(true);

	const Header = (
		<Masthead>
			<MastheadToggle>
				<Button
					variant="plain"
					onClick={() => setSidebarOpen(!sidebarOpen)}
					aria-label="Global navigation"
				>
					<BarsIcon />
				</Button>
			</MastheadToggle>
		</Masthead>
	);

	const Navigation = (
		<Nav theme="dark">
			<NavList>
				<NavItem isActive={'/' === location.pathname}>
					<NavLink to="/">Home</NavLink>
				</NavItem>
				<NavItem isActive={'/settings' === location.pathname}>
					<NavLink to="/settings">Settings</NavLink>
				</NavItem>
			</NavList>
		</Nav>
	);

	const Sidebar = (
		<PageSidebar theme="dark">
			<PageSidebarBody>{Navigation}</PageSidebarBody>
		</PageSidebar>
	);

	return (
		<Page
			mainContainerId={'primary-app-container'}
			header={Header}
			sidebar={sidebarOpen && Sidebar}
		>
			<PageSection
				className={`${style.layoutWrapper} ${
					sidebarOpen ? style.sidebarOpen : style.sidebarClosed
				}`}
				padding={{ default: 'noPadding' }}
			>
				<PageSection className={style.mainContent}>{children}</PageSection>
			</PageSection>
		</Page>
	);
}
