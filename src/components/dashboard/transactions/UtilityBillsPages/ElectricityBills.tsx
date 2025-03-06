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
import { useRequest } from '../../../../hooks/use-request';
import { useFetcher } from '../../../../hooks/use-fetcher';
import {
	fetchEnums,
	fetchprepaidElectricBillers,
	fetchpostpaidElectricBillers,
	initiatePaystackElectricity,
	initiateWalletElectricity,
} from '../../../../Apis/card-payment';
import { toast, ToastContainer } from 'react-toastify';

const formSchema = z.object({
	provider: z.object({
		id: z.number().min(1, 'Provider ID is required'),
		name: z.string().min(1, 'Provider name is required'),
	}),
	meterType: z.string().min(1, 'Meter type is required'),
	// selectedDisco: z.number({
	// 	required_error: 'Distribution company is required',
	// }),
	meterNumber: z
		.string()
		.min(1, 'Meter number is required')
		.regex(/^\d+$/, 'Meter number should be a number'), // Ensures it’s a number
	amount: z
		.string()
		.min(1, 'Amount is required')
		.regex(/^\d+$/, 'Amount should be a valid number'), // Checks if it’s numeric
});

interface Biller {
	billerId: number;
	name: string;
	countryCode: string;
	countryName: string;
	type: string;
}

interface DiscoOption {
	name: string;
	value: number;
}

const getDeviceInformation = async () => {
	const response = await fetch('https://ipapi.co/json/');
	const location = await response.json();

	return {
		httpBrowserLanguage: navigator.language,
		httpBrowserJavaEnabled: navigator.javaEnabled() ? 'true' : 'false',
		httpBrowserJavaScriptEnabled: 'true', // JS is enabled if this code runs
		httpBrowserColorDepth: window.screen.colorDepth,
		httpBrowserScreenHeight: window.screen.height,
		httpBrowserScreenWidth: window.screen.width,
		httpBrowserTimeDifference: new Date().getTimezoneOffset().toString(),
		userAgentBrowserValue: navigator.userAgent,
		deviceChannel: 'Web',
		locationInformation: {
			ipAddress: location.ip,
			country: location.country_name,
			region: location.region,
			city: location.city,
			latitude: location.latitude,
			longitude: location.longitude,
			isp: location.org,
		},
	};
};

const ElectricityBills: React.FC = () => {
	const isfirstTime = true;
	const [selectedProvider, setSelectedProvider] = useState<{
		id: number;
		name: string;
	} | null>(null);
	const [selectedDisco, setSelectedDisco] = useState<string>('');
	const [electricityAmount, setElectricityAmount] = useState<string>('');
	const [meterType, setMeterType] = useState<string>('');
	const [meterNumber, setMeterNumber] = useState<string>('');
	const [stage, setStage] = useState(isfirstTime ? 1 : 2);
	const [openModal, setOpenModal] = useState(false);

	const [paymentMethod, setPaymentMethod] = useState('Pay with Paystack');
	const [errors, setErrors] = useState<Record<string, string>>({});
	const navigate = useNavigate();

	// const handleProviderChange = (event: SelectChangeEvent<string>) => {
	// 	setSelectedProvider(event.target.value as string);
	// };
	const handleProviderChange = (value: string) => {
		setSelectedProvider(JSON.parse(value));
	};

	const handleDiscoChange = (event: SelectChangeEvent<string>) => {
		setSelectedDisco(event.target.value as string);
	};
	const handleCancelAirtimeSelection = () => {
		navigate(-1);
	};

	const handleOpenModal = () => {
		const formData = {
			provider: selectedProvider,
			disco: selectedDisco,
			meterType,
			meterNumber,
			amount: electricityAmount,
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

	const handlePaymentMethodChange = (method: string) => {
		setPaymentMethod(method);
	};

	const {
		isLoading: isLoadingAllEnum,
		response: AllEnumResponse,
		makeRequest: makeAllEnumRequest,
	} = useFetcher(fetchEnums);

	AllEnumResponse && console.log(AllEnumResponse[9]?.values, 'AllEnumRESPONSE');
	const allDiscoEnumOptions =
		AllEnumResponse && AllEnumResponse[9]?.values
			? AllEnumResponse[9]?.values
			: [];

	const {
		isLoading: isLoadingprepaidElectricBillers,
		response: prepaidElectricBillersResponse,
		makeRequest: makeprepaidElectricBillersRequest,
	} = useFetcher(fetchprepaidElectricBillers);

	console.log(prepaidElectricBillersResponse, 'PREPAIDRESPONSE');

	// const prepaidProviderOptions =
	// 	prepaidElectricBillersResponse?.data.map(
	// 		(biller: { name: string }) => biller.name
	// 	) || [];
	const prepaidProviderOptions =
		prepaidElectricBillersResponse?.data.map(
			(biller: { name: string; billerId: string }) => ({
				name: biller.name,
				id: biller.billerId,
			})
		) || [];

	const {
		isLoading: isLoadingpostpaidElectricBillers,
		response: postpaidElectricBillersResponse,
		makeRequest: makepostpaidElectricBillersRequest,
	} = useFetcher(fetchpostpaidElectricBillers);

	console.log(postpaidElectricBillersResponse, 'POSTRESPONSE');

	// const postpaidProviderOptions =
	// 	postpaidElectricBillersResponse?.data.map(
	// 		(biller: { name: string }) => biller.name
	// 	) || [];
	const postpaidProviderOptions =
		postpaidElectricBillersResponse?.data.map(
			(biller: { name: string; billerId: string }) => ({
				name: biller.name,
				id: biller.billerId,
			})
		) || [];

	const providerOptions =
		meterType === '0' ? prepaidProviderOptions : postpaidProviderOptions;

	const {
		isLoading: isLoadingWallet,
		response: walletResponse,
		makeRequest: makeWalletRequest,
	} = useRequest(initiateWalletElectricity);
	const {
		isLoading: isLoadingPaystack,
		response: paystackResponse,
		makeRequest: makePaystackRequest,
	} = useRequest(initiatePaystackElectricity);

	const handlePay = async () => {
		try {
			// Load user profile
			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) {
				toast.error('User profile not found');
				return;
			}
			const userProfile = JSON.parse(userProfileItem);

			// Ensure required fields are present
			if (
				!selectedProvider?.id ||
				!meterNumber ||
				!electricityAmount ||
				!meterType
			) {
				toast.error('Please fill all required fields for electricity payment');
				return;
			}

			// Prepare device information
			const deviceInformation = await getDeviceInformation();

			// Construct payloads
			const electricityWalletPayload = {
				userId: userProfile.userId,
				transactionDetails: {
					meterNumber,
					state: 'null', // Placeholder for state if not needed
					amount: electricityAmount,
					billerId: String(selectedProvider.id),
					distributionCompany: selectedDisco,
					subscriptionType: Number(meterType),
					serviceProviderName: selectedProvider.name,
					description: 'Electric bill',
				},
				deviceInformation,
				serviceProviderName: selectedProvider.name,
				passKey: null, // Placeholder for passKey if required later
			} as {
				userId: string;
				transactionDetails: {
					meterNumber: string;
					state: string;
					amount: string;
					billerId: string;
					distributionCompany: string;
					subscriptionType: number;
					serviceProviderName: string;
					description: string;
				};
				deviceInformation: Record<string, unknown>;
				serviceProviderName: string;
				passKey: string | null;
				walletIdentifier?: string;
			};

			const electricityPaystackPayload = {
				userId: userProfile.userId,
				transactionDetails: {
					meterNumber,
					state: 'null',
					amount: electricityAmount,
					billerId: String(selectedProvider.id), // Convert to string
					distributionCompany: selectedDisco,
					subscriptionType: Number(meterType), // Convert to number
					serviceProviderName: selectedProvider.name,
					description: 'Electric bill',
				},
				deviceInformation,
				serviceProviderName: selectedProvider.name,
			} as {
				userId: string;
				transactionDetails: {
					meterNumber: string;
					state: string;
					amount: string;
					billerId: string; // Remains as string
					distributionCompany: string;
					subscriptionType: number; // Must be a number
					serviceProviderName: string;
					description: string;
				};
				deviceInformation: Record<string, unknown>;
				serviceProviderName: string;
			};

			// Handle payment method
			if (paymentMethod === 'Pay with wallet') {
				electricityWalletPayload.walletIdentifier =
					userProfile.wallet.walletIdentifier;
				const [apiResponse, error] = await makeWalletRequest(
					electricityWalletPayload
				);
				handleApiResponse(apiResponse, error);
				setOpenModal(false);
			} else if (paymentMethod === 'Pay with Paystack') {
				const [apiResponse, error] = await makePaystackRequest(
					electricityPaystackPayload
				);

				if (apiResponse?.data?.data?.authorizationUrl) {
					window.location.href = apiResponse.data.data.authorizationUrl;
				} else {
					toast.error('Failed to initiate payment with Paystack');
				}
			}
		} catch (error) {
			console.error('Payment failed:', error);
			toast.error('Payment failed. Please try again.');
		}
	};
	const handleApiResponse = (apiResponse: any, error?: any) => {
		if (error) {
			toast.error(error.message || 'An unexpected error occurred');
			return;
		}
		if (apiResponse?.succeeded) {
			toast.success('Operation successful');
		} else {
			toast.error(apiResponse?.message || 'An unexpected error occurred');
			if (apiResponse?.errors?.length > 0) {
				apiResponse.errors.forEach((err: string) => toast.error(err));
			}
		}
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
							Electricity
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
								Meter Type
							</Typography>
							<Select
								fullWidth
								value={meterType}
								onChange={e => setMeterType(e.target.value)}
								displayEmpty
								variant="outlined"
								error={!!errors.meterType}
							>
								<MenuItem
									value=""
									disabled
								>
									Select a meter type
								</MenuItem>
								<MenuItem value="0">PREPAID</MenuItem>
								<MenuItem value="1">POSTPAID</MenuItem>
							</Select>

							{errors.meterType && (
								<Typography
									color="error"
									sx={{ fontSize: '0.8rem' }}
								>
									{errors.meterType}
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
								Provider
							</Typography>
							<Select
								fullWidth
								value={selectedProvider ? JSON.stringify(selectedProvider) : ''}
								onChange={event => handleProviderChange(event.target.value)}
								displayEmpty
								variant="outlined"
								disabled={!meterType}
							>
								<MenuItem
									value=""
									disabled
								>
									{meterType
										? 'Select a provider'
										: 'Choose a meter type first'}
								</MenuItem>
								{providerOptions.map((option: any) => (
									<MenuItem
										key={option.id}
										value={JSON.stringify(option)}
									>
										{option.name}
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
								Distribution Company
							</Typography>
							<Select
								fullWidth
								value={selectedDisco}
								onChange={handleDiscoChange}
								displayEmpty
								variant="outlined"
							>
								<MenuItem
									value=""
									disabled
								>
									Please select distribution company
								</MenuItem>
								{allDiscoEnumOptions.map((option: DiscoOption) => (
									<MenuItem
										key={option.value}
										value={option.value}
									>
										{option.name}
									</MenuItem>
								))}
							</Select>

							{errors.provider && (
								<Typography
									color="error"
									sx={{ fontSize: '0.8rem' }}
								>
									{errors.selectedDisco}
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
								Meter Number
							</Typography>
							<TextField
								fullWidth
								variant="outlined"
								onChange={e => setMeterNumber(e.target.value)}
								value={meterNumber}
								placeholder="Enter meter number"
								error={!!errors.meterNumber}
								// helperText={errors.meterNumber}
							/>
							{errors.meterNumber && (
								<Typography
									color="error"
									sx={{ fontSize: '0.8rem' }}
								>
									{errors.meterNumber}
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
								onChange={e => setElectricityAmount(e.target.value)}
								value={electricityAmount}
								placeholder="Enter amount"
								error={!!errors.electricityAmount}
								// helperText={errors.electricityAmount}
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
					</Box>
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
								<PaymentDetails
									orderDetails={[
										{
											label: 'Provider',
											value: selectedProvider ? selectedProvider.name : '',
										}, // Extract name if available
										{ label: 'Meter Type', value: meterType },
										{ label: 'Meter Number', value: meterNumber },
										{ label: 'Amount', value: electricityAmount },
									]}
									paymentMethod={paymentMethod}
									onPaymentMethodChange={handlePaymentMethodChange}
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
										onClick={handleCloseModal}
									>
										Back
									</Button>
									<Button
										variant="contained"
										// onClick={changeStage}
										onClick={handlePay}
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
										{
											label: 'Provider',
											value: selectedProvider ? selectedProvider.name : '',
										},
										{ label: 'Meter Type', value: meterType },
										{ label: 'Meter Number', value: meterNumber },
										{ label: 'Amount', value: electricityAmount },
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

export default ElectricityBills;
