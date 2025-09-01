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
export function isPasskeySet(data: { id: string }) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).get(
			`/Wallet/is-passpin-set/${data.id}`
		)
	);
}

export function setPasskey(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Wallet/set-passpin', data)
	);
}

export function fundwallet(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Wallet/fund-wallet', data)
	);
}

export function fundWalletWithCard(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			'/Wallet/fund-wallet-with-card',
			data
		)
	);
}

export function fundWalletByTransfer(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			'/Wallet/fund-wallet-by-transfer',
			data
		)
	);
}

export function getUserProfile(data: { id: string }) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).get(`/UserProfile/profile/${data.id}`)
	);
}

export function getTransactionFee(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			'/Flutterwave/get-transaction-fee',
			data
		)
	);
}

export function getAirtimeBillers() {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).get(
			'/ValueAddedServices/get-airtime-billers'
		)
	);
}
export function getDataBillers() {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).get(
			'/ValueAddedServices/get-data-billers'
		)
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
		clientRequest({ baseURL: BASE_URL }).post('/Airtime/card', data)
	);
}
export function initiateTransferAirtime(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Airtime/transfer', data)
	);
}
export function initiateUssdAirtime(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Airtime/ussd', data)
	);
}
export function getPhoneOperator(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			'/ValueAddedServices/get-mobile-number-operator',
			data
		)
	);
}
export function initiateWalletData(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			'/Wallet/initiate-data-purchase',
			data
		)
	);
}

export function initiateCardData(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Data/card', data)
	);
}
export function initiateTransferData(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Data/transfer', data)
	);
}
export function initiateUssdData(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Data/ussd', data)
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

export function initiateCardElectricity(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Electricity/card', data)
	);
}

export function initiateTransferElectricity(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Electricity/transfer', data)
	);
}
export function initiateUssdElectricity(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Electricity/ussd', data)
	);
}

export function initiateWalletCableTv(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			'/Wallet/initiate-Cable-purchase',
			data
		)
	);
}
export function initiateCardCableTv(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Cable/card', data)
	);
}
export function initiateTransferCableTv(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Cable/transfer', data)
	);
}
export function initiateUssdCableTv(data: any) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post('/Cable/ussd', data)
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

export function fetchCableTvServices() {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).get(
			`/ValueAddedServices/get-cable-tv-services`
		)
	);
}
