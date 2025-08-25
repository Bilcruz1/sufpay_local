import { handleRequest } from '../client/request';
import { BASE_URL } from '../client';
import clientRequest from '../client';

export function getUserNotificationMessages(data: { userId: string }) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			`/Notifications/get-user-notification-messages`,
			data // Pass the body containing `userId`
		)
	);
}

export function markNotificationAsRead(data: {
	id: string;
	userId: string;
	isRead: boolean;
}) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			`/Notifications/toggle-notification-read-status`,
			data // Pass the body containing `userId`
		)
	);
}
