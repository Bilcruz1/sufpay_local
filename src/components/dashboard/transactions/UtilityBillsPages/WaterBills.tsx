import React, { useState } from 'react';
import { z } from 'zod';
import {
	TextField,
	MenuItem,
	Typography,
	Button,
	Dialog,
	DialogContent,
	Divider,
	Select,
} from '@mui/material';
import { Box } from '@mui/system';
import { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import succ from '../../../../assets/icons/success.svg';
import CardPayment from '.././Payments/CardPayment';
import PaymentDetails from '../Payments/PaymentDetails';

const formSchema = z.object({
	provider: z.string().min(1, 'Please select a provider'),
	accountID: z.string().min(1, 'Meter type is required'),
	amount: z
		.string()
		.min(1, 'Amount is required')
		.regex(/^\d+$/, 'Amount should be a valid number'), // Checks if it’s numeric
});

const WaterBills: React.FC = () => {
	const isfirstTime = true;
	const [selectedProvider, setSelectedProvider] = useState<string>('');
	const [waterAmount, setWaterAmount] = useState<string>('');
	const [accountID, setAccountID] = useState<string>('');
	const [stage, setStage] = useState(isfirstTime ? 1 : 2);
	const [openModal, setOpenModal] = useState(false);
	const providerOptions = ['NIHSA', 'GWMA', 'WRAN'];
	const [errors, setErrors] = useState<Record<string, string>>({});
	const navigate = useNavigate();

	const handleProviderChange = (event: SelectChangeEvent<string>) => {
		setSelectedProvider(event.target.value as string);
	};

	const handleCancelAirtimeSelection = () => {
		navigate(-1);
	};

	const handleOpenModal = () => {
		const formData = {
			provider: selectedProvider,
			accountID,
			amount: waterAmount,
		};

		// Validate form data with Zod
		const validation = formSchema.safeParse(formData);

		if (!validation.success) {
			// Set errors if validation fails
			const fieldErrors: Record<string, string> = {};
			validation.error.errors.forEach(error => {
				fieldErrors[error.path[0]] = error.message;
			});
			setErrors(fieldErrors);
		} else {
			// Clear errors and proceed if validation is successful
			setErrors({});
			setOpenModal(true);
		}
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setStage(1);
	};

	const handleCloseModalSuccess = () => {
		setOpenModal(false);
		setStage(1); // Close the modal
		navigate('/dashboard');
	};

	const changeStage = () => {
		//make api call
		//if successful
		setStage(2);
	};

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					height: '85vh',
					gap: '2rem',
				}}
			>
				<Box>
					<Box>
						<Typography
							sx={{
								fontSize: '1.25rem',
								color: '#636559',
								fontWeight: 'medium',
							}}
						>
							Water
						</Typography>
					</Box>
					<Box
						display="flex"
						alignItems="center"
						gap={1}
						position="relative"
					>
						{/* Input Field with Logo */}
						<Box
							sx={{ width: { xs: '100%', lg: '30%' }, marginTop: '0.38rem' }}
						>
							<Typography
								sx={{
									fontSize: '0.88rem',
									color: '#636559',
									paddingTop: '1.5rem',
									lineHeight: '1.25rem',
									paddingBottom: '0.38rem',
								}}
							>
								Provider
							</Typography>
							<Select
								fullWidth
								value={selectedProvider}
								onChange={handleProviderChange}
								displayEmpty
								variant="outlined"
							>
								<MenuItem
									value=""
									disabled
								>
									Select a provider
								</MenuItem>
								{providerOptions.map(option => (
									<MenuItem
										key={option}
										value={option}
									>
										{option}
									</MenuItem>
								))}
							</Select>
							{errors.provider && (
								<Typography
									color="error"
									sx={{ fontSize: '0.8rem' }}
								>
									{errors.provider}
								</Typography>
							)}

							<Typography
								sx={{
									fontSize: '0.88rem',
									color: '#636559',
									paddingTop: '1.5rem',
									lineHeight: '1.25rem',
									paddingBottom: '0.38rem',
								}}
							>
								Account ID
							</Typography>
							<TextField
								fullWidth
								variant="outlined"
								onChange={e => setAccountID(e.target.value)}
								value={accountID}
								placeholder="Enter account ID"
								error={!!errors.accountID}
							/>
							{errors.accountID && (
								<Typography
									color="error"
									sx={{ fontSize: '0.8rem' }}
								>
									{errors.accountID}
								</Typography>
							)}

							<Typography
								sx={{
									fontSize: '0.88rem',
									color: '#636559',
									paddingTop: '1.5rem',
									lineHeight: '1.25rem',
									paddingBottom: '0.38rem',
									placeholder: 'Enter number',
								}}
							>
								Amount
							</Typography>
							<TextField
								fullWidth
								variant="outlined"
								onChange={e => setWaterAmount(e.target.value)}
								value={waterAmount}
								placeholder="Enter amount"
								error={!!errors.waterAmount}
							/>
							{errors.amount && (
								<Typography
									color="error"
									sx={{ fontSize: '0.8rem' }}
								>
									{errors.amount}
								</Typography>
							)}
						</Box>

						{/* Dropdown for carrier selection */}
					</Box>
					{/* Data Plans Tabs Component */}
					{/* <DataPlansTabs onSelectData={handleDataSelection} /> */}
				</Box>

				{/* Button to open modal */}
				<Box sx={{}}>
					<Divider />

					<Box
						sx={{
							marginTop: '1.44rem',
							marginBottom: '1rem',
							display: 'flex',
							gap: '1rem',
						}}
					>
						<Button
							onClick={handleCancelAirtimeSelection}
							variant="outlined"
							sx={{
								paddingX: '1.5rem',
								paddingY: '0.75rem',
								color: '#353535',
								borderColor: '#353535',
								'&:hover': {
									borderColor: '#92A837',
								},
							}}
						>
							Cancel
						</Button>

						<Button
							onClick={handleOpenModal}
							variant="outlined"
							sx={{
								paddingX: '1.5rem',
								paddingY: '0.75rem',
								backgroundColor: '#AAC645',
								color: '#ffffff',
								borderColor: '#AAC645',
								'&:hover': {
									backgroundColor: '#92A837',
									borderColor: '#92A837',
								},
							}}
						>
							Proceed to Payment
						</Button>
					</Box>
				</Box>
			</Box>

			{/* Modal for payment */}

			<Dialog
				open={openModal}
				onClose={handleCloseModal}
				maxWidth={false}
				sx={{
					'& .MuiDialog-paper': {
						maxWidth: { lg: '75vw' },
						maxHeight: { lg: '90vh' },
						borderRadius: '8px',
						overflow: 'visible',
						paddingY: { lg: '1.5rem' },
						paddingX: { lg: '1.5rem' },
					},
				}}
			>
				<DialogContent>
					<Box>
						{stage === 1 && (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
									gap: '2.5rem',
								}}
							>
								{/* <PaymentDetails
									orderDetails={[
										{ label: 'Provider', value: selectedProvider },
										{ label: 'Account ID', value: accountID },
										{ label: 'Amount', value: waterAmount },
									]}
								/> */}

								<Box
									sx={{
										display: 'flex',
										justifyContent: {
											sm: 'space-between',
											lg: 'flex-start',
										},
										gap: '1rem',
									}}
								>
									<Button
										variant="outlined"
										sx={{
											color: 'black',
											paddingX: '2.5rem',
											paddingY: '1rem',
										}}
										onClick={handleCloseModal}
									>
										Back
									</Button>
									<Button
										variant="contained"
										onClick={changeStage}
										sx={{
											color: 'white',
											backgroundColor: '#AAC645',
											paddingX: '2.5rem',
											paddingY: '1rem',
										}}
									>
										Pay
									</Button>
								</Box>
							</Box>
						)}
						{stage === 2 && (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
									gap: '2.5rem',
								}}
							>
								<CardPayment
									orderDetails={[
										{ label: 'Provider', value: selectedProvider },
										{ label: 'Account ID', value: accountID },
										{ label: 'Amount', value: waterAmount },
									]}
								/>

								<Box
									sx={{
										display: 'flex',
										justifyContent: {
											sm: 'space-between',
											lg: 'flex-start',
										},
										gap: '1rem',
									}}
								>
									<Button
										variant="outlined"
										sx={{
											color: 'black',
											paddingX: '2.5rem',
											paddingY: '1rem',
										}}
										onClick={() => setStage(1)}
									>
										Back
									</Button>
									<Button
										variant="contained"
										onClick={() => setStage(3)}
										sx={{
											color: 'white',
											backgroundColor: '#AAC645',
											paddingX: '2.5rem',
											paddingY: '1rem',
										}}
									>
										Next
									</Button>
								</Box>
							</Box>
						)}
						{stage === 3 && (
							<Box
								sx={{
									width: '100%',
									maxWidth: '25rem',

									margin: '0 auto',
									textAlign: 'center',
								}}
							>
								{/* Success Icon */}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										marginBottom: '3.1rem',
									}}
								>
									<img
										src={succ}
										alt={succ}
									/>
								</Box>

								{/* Success Message */}
								<Typography
									sx={{
										fontWeight: 'medium',
										color: '#353535',
										marginBottom: '1rem',
										fontSize: '1.25rem',
									}}
								>
									Transaction Successful!
								</Typography>

								{/* Success Description */}
								<Typography
									sx={{
										color: '#A2A49B',
										marginBottom: '3.1rem',
										fontSize: '1rem',
									}}
								>
									Your payment was processed successfully. Tap the button below
									to view, share, or download the receipt.
								</Typography>

								{/* Buttons */}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										flexDirection: { lg: 'row', xs: 'column' },
										gap: '1rem',
									}}
								>
									<Button
										variant="outlined"
										sx={{
											borderColor: '#000',
											color: '#000',
											textTransform: 'none',
											borderRadius: '20px',
											padding: '0.5rem 1.5rem',
										}}
									>
										View receipt
									</Button>

									<Button
										variant="contained"
										sx={{
											backgroundColor: '#AAC645',
											color: '#fff',
											textTransform: 'none',
											borderRadius: '20px',
											padding: '0.5rem 1.5rem',
											'&:hover': {
												backgroundColor: '#92A837',
											},
										}}
										onClick={handleCloseModalSuccess}
									>
										Return to dashboard
									</Button>
								</Box>
							</Box>
						)}
						{stage === 4 && (
							<Box
								sx={{
									width: '100%',
									maxWidth: '25rem',

									margin: '0 auto',
									textAlign: 'center',
								}}
							>
								{/* Success Icon */}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										marginBottom: '3.1rem',
									}}
								>
									<img
										src={succ}
										alt={succ}
									/>
								</Box>

								{/* Success Message */}
								<Typography
									sx={{
										fontWeight: 'medium',
										color: '#353535',
										marginBottom: '1rem',
										fontSize: '1.25rem',
									}}
								>
									Transaction Error!
								</Typography>

								{/* Success Description */}
								<Typography
									sx={{
										color: '#A2A49B',
										marginBottom: '3.1rem',
										fontSize: '1rem',
									}}
								>
									Oops! Something went wrong, please try again if the problem
									persist please contact our customer support for further
									assistance
								</Typography>

								{/* Buttons */}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										flexDirection: { lg: 'row', xs: 'column' },
										gap: '1rem',
									}}
								>
									<Button
										variant="outlined"
										sx={{
											borderColor: '#000',
											color: '#000',
											textTransform: 'none',
											borderRadius: '20px',
											padding: '0.5rem 1.5rem',
										}}
										onClick={handleCloseModal}
									>
										Cancel
									</Button>

									<Button
										variant="contained"
										sx={{
											backgroundColor: '#AAC645',
											color: '#fff',
											textTransform: 'none',
											borderRadius: '20px',
											padding: '0.5rem 1.5rem',
											'&:hover': {
												backgroundColor: '#92A837',
											},
										}}
										onClick={() => setStage(1)}
									>
										Try again
									</Button>
								</Box>
							</Box>
						)}
					</Box>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default WaterBills;
