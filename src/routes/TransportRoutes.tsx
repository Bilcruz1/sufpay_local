import { Route, Routes } from 'react-router-dom';
import UtilityBillsLanding from '../components/dashboard/transactions/UtilityBillsPages/UtilityBillsLanding';
import WaterBills from '../components/dashboard/transactions/UtilityBillsPages/WaterBills';
import ElectricityBills from '../components/dashboard/transactions/UtilityBillsPages/ElectricityBills';
import WasteBills from '../components/dashboard/transactions/UtilityBillsPages/WasteBills';
import TransportLandingPage from '../components/dashboard/transactions/TransportPages/TransportLandingPage';

const TransportRoutes = () => (
	<Routes>
		{/* <Route
			path="/"
			element={<TransportLandingPage />}
		/>
		<Route
			path="/intercity"
			element={<WaterBills />}
		/>
		<Route
			path="/townservice"
			element={<ElectricityBills />}
		/>
		<Route
			path="/townservice"
			element={<ElectricityBills />}
		/> */}
	</Routes>
);

export default TransportRoutes;
