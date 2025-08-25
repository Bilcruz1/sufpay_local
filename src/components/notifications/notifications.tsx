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
	IconButton,
	Badge,
	Avatar,
	useTheme,
	Snackbar,
	Alert,
	Collapse,
	Pagination,
} from '@mui/material';
import {
	Notifications as NotificationIcon,
	ContentCopy,
	Bolt,
	LocalAtm,
	CheckCircle,
	ExpandMore,
	ExpandLess,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
	recipientId: string;
	title: string;
	message: string;
	createdAt: string;
}

interface ParsedNotification extends Notification {
	transactionType?: 'airtime' | 'electricity' | 'other';
	amount?: string;
	reference?: string;
	target?: string;
	createdDate?: string;
	succeededDate?: string;
}

const NotificationsPage = () => {
	const [notifications, setNotifications] = useState<ParsedNotification[]>([]);
	const [expandedId, setExpandedId] = useState<string | null>(null); // Track single expanded notification
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});
	const [page, setPage] = useState(1);
	const itemsPerPage = 10;
	const userInfo = JSON.parse(localStorage.getItem('userProfile') || '{}');
	const theme = useTheme();

	const { isLoading, error, response } = useFetcher(
		getUserNotificationMessages,
		{ userId: userInfo.userId }
	);

	const parseNotification = (
		notification: Notification
	): ParsedNotification => {
		const parsed: ParsedNotification = { ...notification };

		if (notification.title.includes('Airtime')) {
			parsed.transactionType = 'airtime';
		} else if (notification.title.includes('Electricity')) {
			parsed.transactionType = 'electricity';
		} else {
			parsed.transactionType = 'other';
		}

		const lines = notification.message.split('\n');
		if (lines.length > 0) {
			const amountMatch = lines[0].match(/¤([\d,]+\.\d{2})/);
			if (amountMatch) parsed.amount = amountMatch[1];

			const targetMatch = lines[0].match(/(?:\+?\d+|meter number \d+)/);
			if (targetMatch) parsed.target = targetMatch[0];

			if (lines[1]) {
				const refMatch = lines[1].match(/Transaction Reference: (\w+)/);
				if (refMatch) parsed.reference = refMatch[1];
			}

			if (lines[2]) {
				const createdMatch = lines[2].match(/Created On: (.+)/);
				if (createdMatch) parsed.createdDate = createdMatch[1];
			}

			if (lines[3]) {
				const succeededMatch = lines[3].match(/Succeeded On: (.+)/);
				if (succeededMatch) parsed.succeededDate = succeededMatch[1];
			}
		}

		return parsed;
	};

	useEffect(() => {
		if (response && response.data) {
			const sortedNotifications = response.data
				.sort(
					(a: Notification, b: Notification) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				)
				.map(parseNotification);
			setNotifications(sortedNotifications);
		}
	}, [response]);

	const toggleExpand = (id: string) => {
		setExpandedId(prevId => (prevId === id ? null : id)); // Toggle or collapse
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		setSnackbar({
			open: true,
			message: 'Copied to clipboard',
			severity: 'success',
		});
	};

	const getNotificationIcon = (title: string) => {
		if (title.includes('Airtime')) return <LocalAtm />;
		if (title.includes('Electricity')) return <Bolt />;
		return <CheckCircle />;
	};

	const getNotificationColor = (title: string) => {
		if (title.includes('Airtime')) return theme.palette.success.main;
		if (title.includes('Electricity')) return theme.palette.warning.main;
		return theme.palette.info.main;
	};

	// Pagination logic
	const pageCount = Math.ceil(notifications.length / itemsPerPage);
	const paginatedNotifications = notifications.slice(
		(page - 1) * itemsPerPage,
		page * itemsPerPage
	);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100vh',
				backgroundColor: theme.palette.grey[50],
			}}
		>
			{/* Header */}
			<AppBar
				position="static"
				color="default"
				elevation={1}
			>
				<Toolbar>
					{/* <Badge
						badgeContent={notifications.length}
						color="primary"
						sx={{ mr: 2 }}
					>
						<NotificationIcon color="action" />
					</Badge> */}
					<Typography
						variant="h6"
						sx={{ flexGrow: 1 }}
					>
						Notifications
					</Typography>
					<Typography
						variant="body2"
						color="textSecondary"
					>
						Page {page} of {pageCount}
					</Typography>
				</Toolbar>
			</AppBar>

			{/* Notification List */}
			<Box
				sx={{
					flex: 1,
					overflow: 'auto',
					p: 2,
					maxWidth: 800,
					margin: '0 auto',
					width: '100%',
				}}
			>
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
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '50vh',
							flexDirection: 'column',
							textAlign: 'center',
						}}
					>
						<Typography
							color="error"
							gutterBottom
						>
							Failed to load notifications
						</Typography>
						<Button
							variant="outlined"
							onClick={() => window.location.reload()}
						>
							Retry
						</Button>
					</Box>
				) : notifications.length === 0 ? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '50vh',
							flexDirection: 'column',
							textAlign: 'center',
						}}
					>
						<NotificationIcon
							sx={{
								fontSize: 80,
								color: 'text.disabled',
								mb: 2,
								opacity: 0.5,
							}}
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
							You're all caught up. Check back later for updates.
						</Typography>
					</Box>
				) : (
					<>
						{paginatedNotifications.map(notification => (
							<Card
								key={notification.recipientId}
								sx={{
									mb: 2,
									borderLeft: `4px solid ${getNotificationColor(
										notification.title
									)}`,
									boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
									transition: 'all 0.3s ease',
									'&:hover': {
										transform: 'translateY(-2px)',
										boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
									},
								}}
							>
								<CardContent sx={{ padding: '16px !important' }}>
									<Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
										<Avatar
											sx={{
												bgcolor: getNotificationColor(notification.title),
												color: 'white',
												mr: 2,
												mt: 0.5,
											}}
										>
											{getNotificationIcon(notification.title)}
										</Avatar>

										<Box sx={{ flex: 1 }}>
											<Typography
												variant="subtitle1"
												sx={{
													fontWeight: 'bold',
													color: 'text.primary',
												}}
											>
												{notification.title}
											</Typography>

											<Typography
												variant="body2"
												color="textSecondary"
												sx={{ mt: 0.5 }}
											>
												{formatDistanceToNow(new Date(notification.createdAt), {
													addSuffix: true,
												})}
											</Typography>

											<Divider sx={{ my: 1.5 }} />

											<Typography
												variant="body1"
												paragraph
											>
												{notification.message.split('\n')[0]}
											</Typography>

											<Collapse in={expandedId === notification.recipientId}>
												<Box
													sx={{
														backgroundColor: theme.palette.action.hover,
														p: 1.5,
														borderRadius: 1,
														mt: 1,
													}}
												>
													{notification.message
														.split('\n')
														.slice(1)
														.map((line, i) => (
															<Typography
																key={i}
																variant="body2"
																sx={{ mb: 1 }}
															>
																{line}
															</Typography>
														))}
												</Box>
											</Collapse>

											<Button
												size="small"
												onClick={() => toggleExpand(notification.recipientId)}
												startIcon={
													expandedId === notification.recipientId ? (
														<ExpandLess />
													) : (
														<ExpandMore />
													)
												}
												sx={{
													mt: 1,
													color: theme.palette.text.secondary,
												}}
											>
												{expandedId === notification.recipientId
													? 'Less details'
													: 'More details'}
											</Button>
										</Box>
									</Box>
								</CardContent>
							</Card>
						))}
					</>
				)}
			</Box>

			{/* Pagination Controls */}
			{notifications.length > itemsPerPage && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						py: 3,
						borderTop: `1px solid ${theme.palette.divider}`,
					}}
				>
					<Pagination
						count={pageCount}
						page={page}
						onChange={(_, value) => {
							setPage(value);
							setExpandedId(null); // Collapse any expanded notification when changing pages
						}}
						color="primary"
						showFirstButton
						showLastButton
					/>
				</Box>
			)}

			{/* Snackbar for feedback */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert
					severity={snackbar.severity}
					onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default NotificationsPage;
