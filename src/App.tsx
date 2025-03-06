import './App.css';
import { Route, Routes } from 'react-router-dom';
import {
	DashboardLanding,
	DashboardTemplate,
	LandingTemplate,
	Notification,
	SettingsPage,
} from './components';
import ProtectedRoute from './ProtectedRoute';
import AuthContext from './context/auth-context';
// import DashboardRoutes from "./routes/DashboardRoutes";
import TransactionsRoutes from './routes/TransactionsRoutes';
import UtilityRoutes from './routes/UtilityRoutes';
import LandingRoutes from './routes/LandingRoutes';
import TransportRoutes from './routes/TransportRoutes';
import NDashboardLanding from './components/dashboard/landing/NDashboardLanding';

import NotificationsPage from './components/notifications/notifications';

function App() {
	const { isAuthenticated } = AuthContext.useContainer();

	return (
		<div className="App">
			<Notification />
			<Routes>
				<Route
					path={'/*'}
					element={<LandingRoutes />}
				/>
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<DashboardTemplate view={<NDashboardLanding />} />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/notifications"
					element={
						<ProtectedRoute>
							<DashboardTemplate view={<NotificationsPage />} />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/transactions/*"
					element={
						<ProtectedRoute>
							<DashboardTemplate view={<TransactionsRoutes />} />
						</ProtectedRoute>
					}
				/>
				<Route
					path={'/transactions/buy/utility/*'}
					element={
						<ProtectedRoute>
							<DashboardTemplate view={<UtilityRoutes />} />
						</ProtectedRoute>
					}
				/>
				<Route
					path={'/transactions/buy/transport/*'}
					element={
						<ProtectedRoute>
							<DashboardTemplate view={<TransportRoutes />} />
						</ProtectedRoute>
					}
				/>
				<Route
					path={'/settings'}
					element={
						<ProtectedRoute>
							<DashboardTemplate view={<SettingsPage />} />
						</ProtectedRoute>
					}
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
