import React, { useEffect, useState } from 'react';
import {
	Grid,
	Box,
	Stack,
	useMediaQuery,
	useTheme,
	Typography,
	Button,
	CardContent,
	Avatar,
	Divider,
} from '@mui/material';
import {
	DashboardCardsContent,
	WalletTransactionsTile,
} from '../../../utils/constants';
import { DashboardCards, DashboardHistories } from '../..';
import mycard from '../../../assets/img/Card.png';
import { useNavigate } from 'react-router-dom';
import { useFetcher } from '../../../hooks/use-fetcher';
import { getWalletBalance } from '../../../Apis/card-payment';

import Card from '../../settings/Card';

type LocationInformation = {
	ipAddress: string;
	country: string;
	region: string;
	city: string;
	latitude: number;
	longitude: number;
	isp: string;
};

type DeviceInformation = {
	httpBrowserLanguage: string;
	httpBrowserJavaEnabled: string;
	httpBrowserJavaScriptEnabled: string;
	httpBrowserColorDepth: number;
	httpBrowserScreenHeight: number;
	httpBrowserScreenWidth: number;
	httpBrowserTimeDifference: string;
	userAgentBrowserValue: string;
	deviceChannel: string;
	locationInformation: LocationInformation;
};

const NDashboardLanding = () => {
	const theme = useTheme();
	const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

	// Array of colors for the cards
	const cardColors = ['#FBFFEC', '#FFFAF0', '#EFFFF2']; // Light Blue, Light Green, Light Red
	const navigate = useNavigate();
	const handleFundWallet = () => {
		navigate('/transactions/buy/wallet');
	};

	const userInfo = JSON.parse(localStorage.getItem('userProfile') || '');

	console.log(userInfo);
	const { isLoading, error, response } = useFetcher<{
		id: string;
	}>(getWalletBalance, {
		id: `${userInfo.userId}?wallet=${userInfo.wallet.walletIdentifier}`,
	});

	console.log(response, 'RESPONSE');

	return (
		<Box
			sx={{
				backgroundColor: '#F7F9FB',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',

				padding: '1rem',
			}}
		>
			{/* Main Layout */}
			<Grid
				container
				spacing={3} // Adds spacing between grid items
				sx={{
					width: '100%',
				}}
			>
				{/* Left Side (Cards and Transactions) */}
				<Grid
					item
					xs={12}
					md={8}
					sx={{
						backgroundColor: 'white',
						borderRadius: '8px',
						boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
					}}
				>
					<Typography sx={{ padding: '1rem', fontWeight: 600 }}>
						Overview
					</Typography>
					{/* Top Cards */}
					<Grid
						container
						spacing={2} // Adds spacing between the cards
						sx={{
							width: '100%',
							marginBottom: '1.5rem',
							marginLeft: '0rem',
							padding: '1rem',
						}}
					>
						{DashboardCardsContent.map((el, ind) => (
							<Grid
								item
								xs={12}
								md={4}
								key={ind}
								sx={{
									backgroundColor: cardColors[ind % cardColors.length], // Dynamically apply colors
									borderRadius: '8px',
									color: '#000', // Ensure text is visible
									padding: '1rem',
									boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
									marginBottom: '16px',
									// Add space between cards (alternative to Grid spacing)
								}}
							>
								<DashboardCards
									title={el.title}
									link={el.link}
									icon={el.icon}
								/>
							</Grid>
						))}
					</Grid>

					{/* Transactions Table */}
					<Box sx={{ padding: '1rem' }}>
						<Stack
							direction="column"
							spacing={2}
						>
							{WalletTransactionsTile.map((el, ind) => (
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
							))}
						</Stack>
					</Box>
				</Grid>

				{/* Right Side (Placeholder for other content) */}
				<Grid
					item
					xs={12}
					md={4}
					sx={{
						backgroundColor: 'white',
						borderRadius: '8px',
						boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
						padding: '1rem',
						display: 'flex',
						flexDirection: 'column', // Arrange items vertically
						justifyContent: 'space-between', // Space between text and image
						minHeight: '400px',
					}}
				>
					<Box sx={{ textAlign: 'center' }}>
						<CardContent>
							<Avatar
								src="https://via.placeholder.com/150"
								sx={{
									width: 80,
									height: 80,
									margin: '0 auto',
									marginBottom: '0.5rem',
								}}
							/>
							<Typography variant="subtitle2">Your wallet</Typography>
							<Typography
								variant="h6"
								fontWeight="bold"
							>
								Hassan Garba
							</Typography>

							<Typography
								variant="body1"
								color="textSecondary"
								gutterBottom
								sx={{ marginTop: '3rem' }}
							>
								Available Balance
							</Typography>
							<Typography
								variant="h4"
								fontWeight="bold"
								gutterBottom
							>
								NGN {response?.data?.actualBalance.toLocaleString()}
							</Typography>
							<Button
								variant="contained"
								color="primary"
								onClick={handleFundWallet}
							>
								Credit account
							</Button>
						</CardContent>
					</Box>
					<Box>
						<img
							src={mycard}
							alt=""
							style={{
								width: '100%', // Optional: Adjust image width if needed
								height: 'auto',
							}}
						/>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default NDashboardLanding;
