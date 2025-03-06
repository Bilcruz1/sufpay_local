import { handleRequest } from '../client/request';
import { BASE_URL } from '../client';
import clientRequest from '../client';

export function initialiseCardPayment(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			'/Transactions/initilise-card-purchase',
			data
		)
	);
}

export function fundwallet(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Wallet/fund-wallet', data)
	);
}

export function getUserProfile(data: { id: string }) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).get(`/UserProfile/profile/${data.id}`)
	);
}

export function getWalletBalance(data: { id: string }) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).get(
			`/Wallet/get-wallet-balance/${data.id}`
		)
	);
}

export function initiateWalletAirtime(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			'/Wallet/initiate-airtime-purchase',
			data
		)
	);
}
export function initiatePaystackAirtime(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			'/PaystackPayment/initiate-airtime-purchase',
			data
		)
	);
}

export function initiateWalletElectricity(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			'/Wallet/initiate-electricity-purchase',
			data
		)
	);
}

export function initiatePaystackElectricity(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			'/PaystackPayment/initiate-electricity-purchase',
			data
		)
	);
}

export function fetchEnums() {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).get(`/Enum/all`)
	);
}
export function fetchprepaidElectricBillers() {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).get(
			`/ValueAddedServices/get-electricity-billers?ServiceType=1`
		)
	);
}

export function fetchpostpaidElectricBillers() {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).get(
			`/ValueAddedServices/get-electricity-billers?ServiceType=0`
		)
	);
}
