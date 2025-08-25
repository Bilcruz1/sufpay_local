import { Route, Routes } from 'react-router-dom';
import UtilityBillsLanding from '../components/dashboard/transactions/UtilityBillsPages/UtilityBillsLanding';
import WaterBills from '../components/dashboard/transactions/UtilityBillsPages/WaterBills';
import ElectricityBills from '../components/dashboard/transactions/UtilityBillsPages/ElectricityBills';
import WasteBills from '../components/dashboard/transactions/UtilityBillsPages/WasteBills';
import CableTvPage from '../components/dashboard/transactions/UtilityBillsPages/cable/cable';

const UtilityRoutes = () => (
	<Routes>
		<Route
			path="/"
			element={<UtilityBillsLanding />}
		/>
		<Route
			path="/cable"
			element={<CableTvPage />}
		/>
		<Route
			path="/electricity"
			element={<ElectricityBills />}
		/>

		<Route
			path="/waste"
			element={<WasteBills />}
		/>
	</Routes>
);

export default UtilityRoutes;
