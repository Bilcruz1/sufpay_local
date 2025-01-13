import { Box } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardLanding } from '../components';
import AirtimeComp from '../components/dashboard/transactions/AirtimeTransactions';
import DataTransactions from '../components/dashboard/transactions/DataTransactions';
import UtilityBillsLanding from '../components/dashboard/transactions/UtilityBillsPages/UtilityBillsLanding';
import TransportLandingPage from '../components/dashboard/transactions/TransportPages/TransportLandingPage';
import FundWalletForm from '../components/dashboard/transactions/FundWalletForm';

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
			path="buy/wallet"
			element={<FundWalletForm />}
		/>
		<Route
			path="buy/data"
			element={<DataTransactions />}
		/>
		{/* <Route path="buy/cable-tv" element={<CableTVPage />} /> */}
		<Route
			path="/buy/utility"
			element={<UtilityBillsLanding />}
		/>
		<Route
			path="buy/transport"
			element={<TransportLandingPage />}
		/>
		<Route
			path="buy/events"
			element={<DashboardLanding />}
		/>
	</Routes>
);

export default TransactionsRoutes;
