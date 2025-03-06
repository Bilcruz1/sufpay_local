import { Route, Routes } from 'react-router-dom';
import UtilityBillsLanding from '../components/dashboard/transactions/UtilityBillsPages/UtilityBillsLanding';
import WaterBills from '../components/dashboard/transactions/UtilityBillsPages/WaterBills';
import ElectricityBills from '../components/dashboard/transactions/UtilityBillsPages/ElectricityBills';
import WasteBills from '../components/dashboard/transactions/UtilityBillsPages/WasteBills';

const UtilityRoutes = () => (
	<Routes>
		{/* <Route
			path="/"
			element={<UtilityBillsLanding />}
		/>
		<Route
			path="/water"
			element={<WaterBills />}
		/>
		<Route
			path="/electricity"
			element={<ElectricityBills />}
		/>

		<Route
			path="/waste"
			element={<WasteBills />}
		/> */}
	</Routes>
);

export default UtilityRoutes;
