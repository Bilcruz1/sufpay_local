import React, { useState, useEffect } from 'react';
import { useFetcher } from '../../hooks/use-fetcher';
import { getUserNotificationMessages } from '../../Apis/notifications';
import {
	Box,
	Card,
	CardContent,
	Typography,
	Divider,
	CircularProgress,
	AppBar,
	Toolbar,
	Button,
} from '@mui/material';
import NotificationIcon from '@mui/icons-material/Notifications';

interface Notification {
	recipientId: string;
	title: string;
	message: string;
	readDate: string | null;
	isRead: boolean;
	createdAt: string;
	isDeleted: boolean;
}

const NotificationsPage = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [visibleCount, setVisibleCount] = useState(5); // Track number of visible notifications
	const userInfo = JSON.parse(localStorage.getItem('userProfile') || '{}');

	// Fetch notifications using custom hook
	const { isLoading, error, response } = useFetcher(
		getUserNotificationMessages,
		{ userId: userInfo.userId }
	);

	// Update notifications state when response is fetched
	useEffect(() => {
		if (response && response.data) {
			const sortedNotifications = response.data.sort(
				(a: Notification, b: Notification) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
			setNotifications(sortedNotifications);
		}
	}, [response]);

	// Load more notifications in batches of 10
	const loadMoreNotifications = () => {
		setVisibleCount(prevCount => prevCount + 5);
	};

	return (
		<Box>
			{/* Header */}
			<AppBar
				position="static"
				color="primary"
				sx={{ marginBottom: 2 }}
			>
				<Toolbar>
					<Typography
						variant="h6"
						sx={{ flexGrow: 1 }}
					>
						Notifications
					</Typography>
				</Toolbar>
			</AppBar>

			{/* Main Content */}
			<Box sx={{ padding: 2 }}>
				{isLoading ? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '50vh',
						}}
					>
						<CircularProgress />
					</Box>
				) : error ? (
					<Typography
						variant="body1"
						color="error"
						textAlign="center"
					>
						Failed to load notifications. Please try again.
					</Typography>
				) : notifications.length === 0 ? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '50vh',
							textAlign: 'center',
						}}
					>
						<Box>
							<NotificationIcon
								sx={{ fontSize: 80, color: 'text.secondary' }}
							/>
							<Typography
								variant="h6"
								color="textSecondary"
							>
								No notifications yet!
							</Typography>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								You’re all caught up. Check back later for updates.
							</Typography>
						</Box>
					</Box>
				) : (
					<>
						{notifications.slice(0, visibleCount).map((notification, index) => (
							<Card
								key={index}
								sx={{
									marginBottom: 2,
								}}
							>
								<CardContent>
									<Typography
										variant="h6"
										sx={{
											fontWeight: notification.isRead ? 'normal' : 'bold',
										}}
									>
										{notification.title}
									</Typography>
									<Divider sx={{ marginY: 1 }} />
									<Typography
										variant="body1"
										paragraph
									>
										{notification.message}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										sx={{ marginTop: 1 }}
									>
										<strong>Created On:</strong>{' '}
										{new Date(notification.createdAt).toLocaleString()}
									</Typography>
								</CardContent>
							</Card>
						))}

						{/* View More Button */}
						{visibleCount < notifications.length && (
							<Box sx={{ textAlign: 'center', marginTop: 2 }}>
								<Button
									variant="contained"
									color="primary"
									onClick={loadMoreNotifications}
								>
									View More
								</Button>
							</Box>
						)}
					</>
				)}
			</Box>
		</Box>
	);
};

export default NotificationsPage;
