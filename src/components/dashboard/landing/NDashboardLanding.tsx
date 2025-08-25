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

const NDashboardLanding = () => {
	const theme = useTheme();
	const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

	// Array of colors for the cards
	const cardColors = ['#FBFFEC', '#FFFAF0', '#EFFFF2'];
	const navigate = useNavigate();
	const handleFundWallet = () => {
		navigate('/transactions/buy/wallet');
	};

	const userInfo = JSON.parse(localStorage.getItem('userProfile') || '');
	const { isLoading, error, response } = useFetcher<{
		id: string;
	}>(getWalletBalance, {
		id: `${userInfo.userId}?wallet=${userInfo.wallet.walletIdentifier}`,
	});

	const [firstName, setFirstName] = useState<string>('User');
	const [lastName, setLastName] = useState<string>('');

	useEffect(() => {
		const fetchedFirstName = localStorage.getItem('firstName') || 'User';
		const fetchedLastName = localStorage.getItem('lastName') || '';
		setFirstName(fetchedFirstName);
		setLastName(fetchedLastName);
	}, []);

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
				spacing={4}
				sx={{ alignItems: 'stretch' }}
			>
				{/* Left Side (Cards and Transactions) */}
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

				{/* Right Side (Wallet Info) */}
				<Grid
					item
					xs={12}
					md={4}
				>
					<Box
						sx={{
							backgroundColor: 'white',
							borderRadius: '8px',
							boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
							padding: '1rem',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							height: '100%',
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
									{firstName} {lastName}
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
									fullWidth
									sx={{ mt: 2 }}
								>
									Fund Wallet
								</Button>
							</CardContent>
						</Box>
						<Box>
							<img
								src={mycard}
								alt="Wallet Card"
								style={{
									width: '100%',
									height: 'auto',
								}}
							/>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default NDashboardLanding;
