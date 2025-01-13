import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './context/auth-context';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { isAuthenticated } = AuthContext.useContainer();

	// If not authenticated, redirect to login
	if (!isAuthenticated) {
		return (
			<Navigate
				to="/login"
				replace
			/>
		);
	}

	// If authenticated, render the protected component
	return <>{children}</>;
};

export default ProtectedRoute;
