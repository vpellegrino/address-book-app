import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@patternfly/react-core/dist/styles/base.css';

import Layout from '@components/Layout';
import Home from '@pages/Home';
import Settings from '@pages/Settings';

export default function App(): JSX.Element {
	return (
		<BrowserRouter>
			<Layout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/settings" element={<Settings />} />
				</Routes>
			</Layout>
		</BrowserRouter>
	);
}
