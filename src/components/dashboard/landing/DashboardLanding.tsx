import React, { useEffect, useState } from 'react';
import {
	Grid,
	Box,
	Stack,
	useMediaQuery,
	useTheme,
	Typography,
} from '@mui/material';
import {
	DashboardCardsContent,
	WalletTransactionsTile,
} from '../../../utils/constants';
import { DonutChart, DashboardCards, DashboardHistories } from '../..';

const DashboardLanding = () => {
	const theme = useTheme();
	const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
	const cardColors = ['#FBFFEC', '#FFFAF0', '#EFFFF2'];
	const [hasTransactions, setHasTransactions] = useState(false); // Initialize based on your data

	// Check for transactions (replace with your actual data check)
	useEffect(() => {
		setHasTransactions(
			WalletTransactionsTile && WalletTransactionsTile.length > 0
		);
	}, [WalletTransactionsTile]);

	return (
		<Box
			sx={{
				backgroundColor: '#F7F9FB',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				padding: '1rem',
			}}
		>
			<Grid
				container
				spacing={4}
				sx={{ alignItems: 'stretch' }}
			>
				{/* Left Side */}
				<Grid
					item
					xs={12}
					md={8}
				>
					<Box
						sx={{
							backgroundColor: 'white',
							borderRadius: '8px',
							boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
							padding: '1rem',
							height: '100%',
						}}
					>
						<Typography sx={{ paddingBottom: '1rem', fontWeight: 600 }}>
							Overview
						</Typography>

						{/* Cards Row */}
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								gap: '16px',
								marginBottom: '24px',
								flexWrap: 'wrap',
							}}
						>
							{DashboardCardsContent.map((el, ind) => (
								<Box
									key={ind}
									sx={{
										flex: '1 1 calc(33.333% - 16px)',
										minWidth: '200px',
										backgroundColor: cardColors[ind % cardColors.length],
										borderRadius: '8px',
										padding: '1rem',
										boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
									}}
								>
									<DashboardCards
										title={el.title}
										link={el.link}
										icon={el.icon}
									/>
								</Box>
							))}
						</Box>

						{/* Transactions Table */}
						<Stack
							direction="column"
							spacing={2}
						>
							{hasTransactions ? (
								WalletTransactionsTile.map((el, ind) => (
									<Box
										key={ind}
										sx={{
											width: '100%',
											backgroundColor: '#F9F9F9',
											borderRadius: '8px',
											padding: '1rem',
										}}
									>
										<DashboardHistories
											title={el.title}
											linkUrl={el.linkUrl}
										/>
									</Box>
								))
							) : (
								<Box
									sx={{
										width: '100%',
										backgroundColor: '#F9F9F9',
										borderRadius: '8px',
										padding: '2rem',
										textAlign: 'center',
									}}
								>
									<Typography
										variant="body1"
										color="textSecondary"
									>
										No transaction records found
									</Typography>
								</Box>
							)}
						</Stack>
					</Box>
				</Grid>

				{/* Right Side - Donut Chart */}
				{!isMdDown && (
					<Grid
						item
						xs={12}
						md={4}
					>
						<DonutChart />
					</Grid>
				)}
			</Grid>
		</Box>
	);
};

export default DashboardLanding;
