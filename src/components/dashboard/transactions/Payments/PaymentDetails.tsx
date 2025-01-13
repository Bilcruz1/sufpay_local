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

// interface PaymentDetailsProps {
// 	orderDetails: { label: string; value: string }[];
// }

// const PaymentDetails: React.FC<PaymentDetailsProps> = ({ orderDetails }) => {
// 	const [paymentMethod, setPaymentMethod] = useState<string>('Pay with card');

// 	const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
// 		setPaymentMethod(event.target.value as string);
// 	};
interface PaymentDetailsProps {
	orderDetails: { label: string; value: string }[];
	paymentMethod: string;
	onPaymentMethodChange: (method: string) => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
	orderDetails,
	paymentMethod,
	onPaymentMethodChange,
}) => {
	const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
		onPaymentMethodChange(event.target.value as string);
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
										{/* <MenuItem value="Pay with bank transfer">
											Pay with bank transfer
										</MenuItem> */}
										<MenuItem value="Pay with wallet">Pay with wallet</MenuItem>
										<MenuItem value="Pay with Paystack">
											Pay with Paystack
										</MenuItem>

										<MenuItem value="Pay with card">Pay with card</MenuItem>
									</Select>
								</FormControl>
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
						{orderDetails.map((detail, index) => (
							<Box
								key={index}
								sx={{ display: 'flex', gap: '2rem' }}
							>
								<Typography sx={{ minWidth: '150px', color: '#636559' }}>
									{detail.label}:
								</Typography>
								<Typography
									sx={{
										textAlign: 'left',
										color: '#353535',
										fontWeight: 'medium',
									}}
								>
									{detail.value}
								</Typography>
							</Box>
						))}
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default PaymentDetails;
