import { useLayoutEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { storage_keys } from '../client';

function Context() {
	const [user, setUser] = useState(getUser());
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
		() => localStorage[storage_keys['jwt-token']]
	);

	useLayoutEffect(() => {
		// get cached user
		setUser(getUser());

		// fetch user session from backend to replace cached user
	}, [isAuthenticated]);
	function getUser() {
		try {
			const item = localStorage.getItem(storage_keys['user']);
			if (!item) return defaultUser;
			const storedUser = { ...JSON.parse(item) };
			if (isAuthenticated) {
				return storedUser as any;
			}

			return defaultUser;
		} catch (e) {
			return defaultUser;
		}
	}

	function login() {
		setIsAuthenticated(true);
	}

	function logout() {
		localStorage.removeItem(storage_keys['jwt-token']);
		localStorage.removeItem(storage_keys['user']);
		localStorage.removeItem(storage_keys['refresh-token']);

		setIsAuthenticated(false);
	}

	function signup() {}

	return {
		user,
		isAuthenticated,
		login,
		logout,
		signup,
	};
}
const defaultUser = {
	id: '',
	username: '',
	email: '',
	phone: '',
	roles: [],
	first_name: '',
	last_name: '',
	middle_name: '',
};

let AuthContext = createContainer(Context);

export default AuthContext;
