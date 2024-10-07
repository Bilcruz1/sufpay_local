import {
	Avatar,
	Box,
	Button,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function createData(
	transaction: string,
	calories: string,
	fat: string,
	carbs: string,
	protein: number
) {
	return { transaction, calories, fat, carbs, protein };
}

const rows = [
	createData('Event and ticket', 'N500', 'Successful', 'Mar 10, 2024', 4.0),
	createData('Airtime', 'N500', 'Pending', 'Mar 10, 2024', 4.3),
	createData('Utility', 'N500', 'Failed', 'Mar 10, 2024', 6.0),
	createData('Transportation', 'N500', 'Successful', 'Mar 10, 2024', 4.3),
	createData('Transportation', 'N500', 'Failed', 'Mar 10, 2024', 3.9),
];

const DashboardHistories: React.FC<{ title: string; linkUrl: string }> = ({
	title,
	linkUrl,
}) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if the screen is mobile size

	// Function to get the color based on the status
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Successful':
				return '#43B790';
			case 'Pending':
				return '#ECA04A';
			case 'Failed':
				return '#E64B75';
			default:
				return 'black';
		}
	};
	const transactionIcons = {
		'Event and ticket': '/path/to/event_icon.png',
		Airtime: '/path/to/airtime_icon.png',
		Utility: '/path/to/utility_icon.png',
		Transportation: '/path/to/transportation_icon.png',
	};

	return (
		<Box
			sx={{
				border: '1px solid #66666628',
				borderRadius: '5px',
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{/* Top Section */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingX: '1rem',

					paddingTop: '1.6rem',

					marginBottom: '0.5rem',
				}}
			>
				<Typography
					variant="h5"
					sx={{ fontWeight: '700' }}
				>
					{title}
				</Typography>
				<Link
					component="button"
					variant="body2"
					onClick={() => navigate(linkUrl)}
					sx={{ cursor: 'pointer', fontWeight: '500' }}
				>
					View all
				</Link>
			</Box>

			{/* Table Section for large screens */}
			{!isMobile ? (
				<TableContainer
					component={Paper}
					sx={{
						flexGrow: 1,
						boxShadow: 'none',
						maxHeight: '100%',
						overflow: 'auto',
					}}
				>
					<Table
						stickyHeader
						sx={{ minWidth: 650, border: 0 }}
					>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontSize: '16px', color: '#A2A49B' }}>
									Transactions
								</TableCell>
								<TableCell
									align="left"
									sx={{ fontSize: '16px', color: '#A2A49B' }}
								>
									Amount
								</TableCell>
								<TableCell
									align="left"
									sx={{ fontSize: '16px', color: '#A2A49B' }}
								>
									Status
								</TableCell>
								<TableCell
									align="left"
									sx={{ fontSize: '16px', color: '#A2A49B' }}
								>
									Date
								</TableCell>
								<TableCell
									align="left"
									sx={{ fontWeight: 'bold' }}
								></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map(row => (
								<TableRow key={row.transaction}>
									<TableCell
										sx={{ borderBottom: 0, fontSize: '16px', color: '#636559' }}
									>
										{row.transaction}
									</TableCell>
									<TableCell
										align="left"
										sx={{ borderBottom: 0, fontSize: '16px' }}
									>
										{row.calories}
									</TableCell>
									<TableCell
										align="left"
										sx={{
											borderBottom: 0,
											color: getStatusColor(row.fat),
											fontSize: '16px',
										}}
									>
										{row.fat}
									</TableCell>
									<TableCell
										align="left"
										sx={{ borderBottom: 0, fontSize: '16px' }}
									>
										{row.carbs}
									</TableCell>
									<TableCell
										align="right"
										sx={{ borderBottom: 0, fontSize: '16px' }}
									>
										<Button
											variant="outlined"
											sx={{
												borderRadius: '10%',
												color: '#636559',
												fontSize: '16px',
											}}
										>
											Details
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				// Mobile view: List-style format
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						px: 2,
					}}
				>
					{rows.map((row, index) => (
						<Box
							key={index}
							sx={{
								display: 'flex',
								alignItems: 'center',
								py: 2,
							}}
						>
							{/* Add Avatar or img for the icon */}
							<Avatar
								src={'name'}
								alt={row.transaction}
								sx={{ width: 35, height: 35, marginRight: 1 }}
							/>

							<Box sx={{ flexGrow: 1 }}>
								<Typography
									variant="body1"
									fontWeight="500"
									color="textPrimary"
									sx={{ fontSize: '12px' }}
								>
									{row.transaction}
								</Typography>
								<Typography
									variant="body2"
									color="textSecondary"
									sx={{ fontSize: '12px' }}
								>
									{row.carbs}
								</Typography>
							</Box>
							<Box sx={{ textAlign: 'right' }}>
								<Typography
									variant="body1"
									fontWeight="500"
									sx={{ fontSize: '12px' }}
								>
									{row.calories}
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: getStatusColor(row.fat), fontSize: '12px' }}
								>
									{row.fat}
								</Typography>
							</Box>
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
};

export default DashboardHistories;
