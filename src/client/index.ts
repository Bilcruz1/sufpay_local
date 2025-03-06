import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const BASE_URL = process.env.REACT_APP_BASE_URL;

const responseSuccessHandler = (res: AxiosResponse) => {
	return res;
};

export const storage_keys = {
	'jwt-token': 'jwt-token',
	'refresh-token': 'refresh-token',
	user: '@user',
};

const responseErrorHandler = async function (error: any) {
	const requestConfig: any = error.config;
	requestConfig!.headers = { ...requestConfig!.headers };

	if (
		error?.response?.data?.info === 'Token expired' &&
		!requestConfig._retry &&
		requestConfig.url !== '/api/auth'
	) {
		requestConfig._retry = true;
		try {
			const res: AxiosResponse = await clientRequest({}, true).post(
				'/auth/refreshtoken'
			);

			localStorage.setItem(storage_keys['jwt-token'], res?.data?.access_token);
			localStorage.setItem(
				storage_keys['refresh-token'],
				res?.data?.refresh_token
			);
			requestConfig.headers['Authorization'] =
				'Bearer ' + res?.data?.access_token;
			return clientRequest({}).request({ ...requestConfig });
		} catch (error: any) {
			if (error.response && error.response.data) {
				if (error.response.status === 401) {
					localStorage.removeItem(storage_keys['jwt-token']);
					localStorage.removeItem(storage_keys['refresh-token']);
					window.location.reload();
				}
				return Promise.reject(error.response.data);
			}
			return Promise.reject(error);
		}
	}
	return Promise.reject(error);
};

const client = (config: AxiosRequestConfig) => Axios.create(config);

export function clientRequest(
	config: AxiosRequestConfig<any> = {},
	refreshToken?: boolean
) {
	const req: AxiosRequestConfig = {
		baseURL: BASE_URL,
		...config,
		headers: {
			'Content-Type': 'application/json',
		},
	};

	if (config?.headers) {
		req.headers = Object.assign({ ...req.headers }, config.headers);
	}

	const token = refreshToken
		? localStorage[storage_keys['refresh-token']]
		: localStorage[storage_keys['jwt-token']];

	// const refreshToken = localStorage[storage_keys["refresh-token"]];
	if (token) {
		req.headers = Object.assign(
			{ ...req.headers },
			{
				Authorization: `Bearer `.concat(token),
			}
		);
	}

	const clientInstance = client(req);

	if (!refreshToken) {
		clientInstance.interceptors.response.use(
			responseSuccessHandler,
			responseErrorHandler
		);
	}

	// !refreshToken
	// 	? clientInstance.interceptors.response.use(
	// 			responseSuccessHandler,
	// 			responseErrorHandler
	// 	  )
	// 	: null;
	return clientInstance;
}
// return client(req);

// clientRequest()
//   .post("")
//   .then((x) => x.status);

export default clientRequest;
