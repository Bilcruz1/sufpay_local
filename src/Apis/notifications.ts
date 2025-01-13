import { handleRequest } from '../client/request';
import { BASE_URL } from '../client';
import clientRequest from '../client';

// export function getUserNotificationMessages(data: { id: string }) {
// 	return handleRequest(() =>
// 		clientRequest({ baseURL: BASE_URL }).post(
// 			`/Notifications/get-user-notification-messages/${data.id}`
// 		)
// 	);
// }

export function getUserNotificationMessages(data: { userId: string }) {
	return handleRequest(() =>
		clientRequest({ baseURL: BASE_URL }).post(
			`/Notifications/get-user-notification-messages`,
			data // Pass the body containing `userId`
		)
	);
}
