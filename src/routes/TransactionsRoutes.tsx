import { Box } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardLanding } from '../components';
import AirtimeComp from '../components/dashboard/transactions/AirtimeTransactions';
import DataTransactions from '../components/dashboard/transactions/DataTransactions';

const TransactionsRoutes = () => (
	<Routes>
		<Route
			path="/"
			element={<DashboardLanding />}
		/>
		<Route
			path="buy/airtime"
			element={<AirtimeComp />}
		/>
		<Route
			path="buy/data"
			element={<DataTransactions />}
		/>
		{/* <Route path="buy/cable-tv" element={<CableTVPage />} /> */}
		{/* <Route path="buy/utility" element={<UtilityPage />} /> */}
		{/* <Route path="buy/transport" element={<TransportPage />} /> */}
		<Route
			path="buy/events"
			element={<DashboardLanding />}
		/>
	</Routes>
);

export default TransactionsRoutes;
