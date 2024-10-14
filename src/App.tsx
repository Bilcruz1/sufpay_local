import './App.css';
import { Route, Routes } from 'react-router-dom';
import {
	DashboardLanding,
	DashboardTemplate,
	LandingTemplate,
	Notification,
	SettingsPage,
} from './components';
// import DashboardRoutes from "./routes/DashboardRoutes";
import TransactionsRoutes from './routes/TransactionsRoutes';
import LandingRoutes from './routes/LandingRoutes';

function App() {
	return (
		<div className="App">
			<Notification />
			<Routes>
				<Route
					path={'/*'}
					element={<LandingRoutes />}
				/>
				<Route
					path={'/dashboard'}
					element={<DashboardTemplate view={<DashboardLanding />} />}
				/>
				<Route
					path={'/transactions/*'}
					element={<DashboardTemplate view={<TransactionsRoutes />} />}
				/>
				<Route
					path={'/settings'}
					element={<DashboardTemplate view={<SettingsPage />} />}
				/>

				{/* <Route path="notifications" element={<NotificationsPage />} /> */}
				{/* <Route path="help" element={<HelpPage />} /> */}
				{/* <Route path="settings" element={<SettingsPage />} /> */}
				{/* <Route path="*" element={<NotFoundPage />} /> */}
			</Routes>
		</div>
	);
}

export default App;
