import { useEffect, useState } from 'react';
import { paramsToArray } from '../../src/utils/index';

interface RequestState {
	isLoading: boolean;
	error: null | Error;
}

export function useFetcher<P = any>(
	func: (...args: any) => any,
	params?: P,
	requiredKeys: string[] = []
) {
	const [state, setState] = useState<RequestState>({
		isLoading: false,
		error: null,
	});
	const [response, setResponse] = useState<any>(null);
	const deps = params ? [...paramsToArray(params)] : [];

	useEffect(() => {
		const newParams: any = { ...params };

		for (let key of requiredKeys) {
			if (!newParams[key] || !newParams) {
				return;
			}
		}

		makeRequest();
	}, deps);

	const makeRequest = async () => {
		setState({ isLoading: true, error: null });

		const [response, error] = await func({ ...params });
		if (response) {
			setResponse(response);
		}

		setState({ isLoading: false, error });
		return [response, error];
	};

	return {
		...state,
		response,
		makeRequest,
	};
}
