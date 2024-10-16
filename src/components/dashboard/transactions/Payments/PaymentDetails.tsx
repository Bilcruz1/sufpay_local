import React, { useState } from 'react';
import {
	Box,
	Grid,
	TextField,
	Button,
	Typography,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	SelectChangeEvent,
	Divider,
} from '@mui/material';
import visa from '../../../../assets/icons/visa-icon.svg';

interface PaymentDetailsProps {
	phoneNumber: string;
	networkProvider: string;
	plan: string;
	amount: string;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
	phoneNumber,
	networkProvider,
	plan,
	amount,
}) => {
	const [paymentMethod, setPaymentMethod] = useState<string>('Pay with card');

	const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
		setPaymentMethod(event.target.value as string);
	};

	return (
		<>
			<Typography
				sx={{ color: '#000000', fontSize: '1.25rem', fontWeight: 'medium' }}
			>
				Payment details
			</Typography>
			<Box
				sx={{
					width: '100%',

					display: 'flex',
					justifyContent: 'space-between',
					flexDirection: { xs: 'column', md: 'column', lg: 'row' },
					gap: '5rem',
				}}
			>
				{/* Left Section: Payment Method Form */}
				<Box
					sx={{
						width: { xs: '100%', md: '100%', lg: '50%' },
						marginTop: '1.25rem',
					}}
				>
					<Box component="form">
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={12}
							>
								<FormControl fullWidth>
									<Typography
										sx={{
											color: '#666666',
											fontSize: '1rem',
											paddingBottom: '0.75rem',
										}}
									>
										Payment Method
									</Typography>
									<Select
										value={paymentMethod}
										onChange={handlePaymentMethodChange}
										fullWidth
										label=""
									>
										<MenuItem value="Pay with card">Pay with card</MenuItem>
										<MenuItem value="Pay with bank transfer">
											Pay with bank transfer
										</MenuItem>
										<MenuItem value="Pay with bank transfer">
											Pay Saved Card
										</MenuItem>
										<MenuItem value="Pay with bank transfer">
											Pay with wallet
										</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid
								item
								xs={12}
							>
								<Typography
									sx={{
										color: '#666666',
										fontSize: '1rem',
										paddingBottom: '0.75rem',
										paddingTop: '1.25rem',
									}}
								>
									Name on card
								</Typography>
								<TextField
									label=""
									fullWidth
									placeholder="Kuma wayo"
									variant="outlined"
									sx={{}}
								/>
							</Grid>
							<Grid
								item
								xs={12}
							>
								<Typography
									sx={{
										color: '#666666',
										fontSize: '1rem',
										paddingBottom: '0.75rem',
										paddingTop: '1.25rem',
									}}
								>
									Card number
								</Typography>
								<TextField
									label=""
									fullWidth
									placeholder="9801 2345 6789 0901"
									variant="outlined"
									InputProps={{
										endAdornment: (
											<img
												src={visa}
												alt="Visa logo"
											/>
										),
									}}
								/>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<Typography
									sx={{
										color: '#666666',
										fontSize: '1rem',
										paddingBottom: '0.75rem',
									}}
								>
									Expiration
								</Typography>
								<TextField
									label=""
									fullWidth
									placeholder="21/25"
									variant="outlined"
								/>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<Typography
									sx={{
										color: '#666666',
										fontSize: '1rem',
										paddingBottom: '0.75rem',
									}}
								>
									CVV
								</Typography>
								<TextField
									label=""
									fullWidth
									placeholder="790"
									variant="outlined"
								/>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Divider
					orientation="vertical"
					variant="middle"
					flexItem
					sx={{ display: { xs: 'none', md: 'none', lg: 'block' } }}
				/>

				{/* Right Section: Review your order */}
				<Box
					sx={{
						width: { xs: '100%', md: '100%', lg: '50%' },
						marginTop: { xs: '1rem', md: '1rem', lg: '1.25rem' },
					}}
				>
					<Typography
						variant="h6"
						sx={{
							color: '#666666',
							fontSize: '1rem',
						}}
					>
						Review your order
					</Typography>
					<Box
						sx={{
							borderRadius: '8px',
							display: 'grid',
							gap: '2.2rem',
							marginTop: '1.25rem',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								gap: { xs: '0.5rem', md: '1rem', lg: '2rem' },
							}}
						>
							<Typography sx={{ minWidth: '150px' }}>Phone number:</Typography>
							<Typography sx={{ textAlign: 'left' }}>{phoneNumber}</Typography>
						</Box>
						<Box sx={{ display: 'flex', gap: '2rem' }}>
							<Typography sx={{ minWidth: '150px' }}>
								Network Provider:
							</Typography>
							<Typography sx={{ textAlign: 'left' }}>
								{networkProvider}
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', gap: '2rem' }}>
							<Typography sx={{ minWidth: '150px' }}>Plan:</Typography>
							<Typography sx={{ textAlign: 'left' }}>{plan}</Typography>
						</Box>
						<Box sx={{ display: 'flex', gap: '2rem' }}>
							<Typography sx={{ minWidth: '150px' }}>Amount:</Typography>
							<Typography sx={{ textAlign: 'left' }}>{amount}</Typography>
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default PaymentDetails;
