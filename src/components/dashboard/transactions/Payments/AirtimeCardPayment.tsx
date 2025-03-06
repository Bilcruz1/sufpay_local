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
	Radio,
	FormControlLabel,
	RadioGroup,
} from '@mui/material';
import visa from '../../../../assets/icons/visa-icon.svg';
import master from '../../../../assets/icons/master-card-icon.svg';

const cards = [
	{
		type: 'Visa',
		last4: '1211',
		logo: visa,
	},
	{
		type: 'Visa',
		last4: '0121',
		logo: visa,
	},
	{
		type: 'Mastercard',
		last4: '1212',
		logo: master,
	},
	{
		type: 'Mastercard',
		last4: '0012',
		logo: master,
	},
];

interface PaymentDetailsProps {
	phoneNumber: string;
	networkProvider: string;

	amount: string;
}

const AirtimeCardPayment: React.FC<PaymentDetailsProps> = ({
	phoneNumber,
	networkProvider,

	amount,
}) => {
	const [paymentMethod, setPaymentMethod] = useState<string>('Pay with card');

	const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
		setPaymentMethod(event.target.value as string);
	};
	const [selectedCard, setSelectedCard] = React.useState('');

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedCard((event.target as HTMLInputElement).value);
	};

	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'space-between',
				flexDirection: { xs: 'column', md: 'column', lg: 'row' },
				gap: '2rem',
			}}
		>
			{/* Left Section: Payment Method Form */}
			<Box
				sx={{
					width: { xs: '100%', md: '100%', lg: '65%' },
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
									<MenuItem value="Pay with saved card">
										Pay Saved Card
									</MenuItem>
									<MenuItem value="Pay with wallet">Pay with wallet</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					</Grid>

					<Typography
						sx={{
							marginTop: '1.6rem',
							marginBottom: '0.8rem',
							fontSize: '1rem',
						}}
					>
						Saved Cards
					</Typography>
					<RadioGroup
						value={selectedCard}
						onChange={handleChange}
					>
						<Box
							sx={{
								display: 'flex',
								flexWrap: 'wrap',
								gap: '1rem',
								justifyContent: 'space-between',
							}}
						>
							{cards.map((card, index) => (
								<Box
									key={index}
									sx={{
										display: 'flex',
										width: { lg: 'calc(50% - 16px)', xs: 'calc(1000% - 16px)' },
										alignItems: 'center',
									}}
								>
									<FormControlLabel
										value={card.last4}
										control={
											<Radio
												sx={{
													transform: 'scale(0.8)',
												}}
											/>
										}
										label={
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													gap: 1.5,
												}}
											>
												<Box>
													<img
														src={card.logo}
														alt={card.type}
														style={{}}
													/>
												</Box>
												<Box sx={{ display: 'grid' }}>
													<Box>
														<span>{card.type}</span>
													</Box>
													<Box>
														<span>**** **** **** {card.last4}</span>
													</Box>
												</Box>
											</Box>
										}
									/>
								</Box>
							))}
						</Box>
					</RadioGroup>
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
						<Typography sx={{ minWidth: '150px' }}>Amount:</Typography>
						<Typography sx={{ textAlign: 'left' }}>{amount}</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default AirtimeCardPayment;
