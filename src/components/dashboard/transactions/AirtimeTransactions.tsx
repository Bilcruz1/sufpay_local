import React, { useState } from 'react';
import {
	TextField,
	MenuItem,
	InputAdornment,
	IconButton,
	Typography,
	Button,
	Dialog,
	DialogContent,
	Divider,
} from '@mui/material';
import { Box } from '@mui/system';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import mtnLogo from '../../../assets/icons/mtn-logo.svg';
import gloLogo from '../../../assets/icons/glo-logo.svg';
import mobile9Logo from '../../../assets/icons/9mobile-logo.svg';
import airtelLogo from '../../../assets/icons/airtel-logo.svg';
import { useNavigate } from 'react-router-dom';
import succ from '../../../assets/icons/success.svg';
import CardPayment from './Payments/CardPayment';
import PaymentDetails from './Payments/PaymentDetails';
import { useRequest } from '../../../hooks/use-request';
import {
	initiateWalletAirtime,
	initiatePaystackAirtime,
} from '../../../Apis/card-payment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define type for carrier options
interface CarrierOption {
	value: string;
	label: string;
	logo: string;
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

const AirtimeTransactions: React.FC = () => {
	const isfirstTime = true;
	const [selectedCarrier, setSelectedCarrier] = useState<string>('MTN Nigeria');
	const [carrierLogo, setCarrierLogo] = useState<string>(mtnLogo); // Default to MTN
	const [openDropdown, setOpenDropdown] = useState<boolean>(false);
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [AirtimeAmount, setAirtimeAmount] = useState<string>('');
	const [stage, setStage] = useState(isfirstTime ? 1 : 2);
	const [openModal, setOpenModal] = useState(false);
	const carrierOptions: CarrierOption[] = [
		{ value: 'MTN Nigeria', label: 'MTN', logo: mtnLogo },
		{ value: 'Glo Nigeria', label: 'GLO', logo: gloLogo },
		{
			value: '9Mobile (Etisalat) Nigeria',
			label: '9 MOBILE',
			logo: mobile9Logo,
		},
		{ value: 'Airtel Nigeria', label: 'AIRTEL', logo: airtelLogo },
	];
	const navigate = useNavigate();

	const handleCarrierChange = (carrier: CarrierOption) => {
		setSelectedCarrier(carrier.value);
		setCarrierLogo(carrier.logo);
		setOpenDropdown(false);
	};

	const handleCancelAirtimeSelection = () => {
		setAirtimeAmount('');
		navigate(-1);
	};

	const handleOpenModal = () => {
		setOpenModal(true);
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

	const getBillerId = (selectedCarrier: string): string => {
		const billerIdMap: { [key: string]: string } = {
			'MTN Nigeria': '341',
			'Glo Nigeria': '344',
			'Airtel Nigeria': '342',
			'9Mobile (Etisalat) Nigeria': '340',
		};

		return billerIdMap[selectedCarrier] || 'unknown'; // Default to 'unknown' if no match
	};

	// const { isLoading, response, makeRequest } = useRequest(
	// 	initiatePaystackAirtime,
	// 	initiateWalletAirtime
	// );
	const {
		isLoading: isLoadingWallet,
		response: walletResponse,
		makeRequest: makeWalletRequest,
	} = useRequest(initiateWalletAirtime);
	const {
		isLoading: isLoadingPaystack,
		response: paystackResponse,
		makeRequest: makePaystackRequest,
	} = useRequest(initiatePaystackAirtime);

	const [paymentMethod, setPaymentMethod] = useState('Pay with Paystack');

	const handlePaymentMethodChange = (method: string) => {
		setPaymentMethod(method);
	};

	const handlePay = async () => {
		try {
			// Load user profile
			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) {
				toast.error('User profile not found');
				return;
			}
			const userProfile = JSON.parse(userProfileItem);

			// Prepare common payload
			const deviceInformation = await getDeviceInformation();
			const billerId = getBillerId(selectedCarrier);
			if (billerId === 'unknown') {
				toast.error('Invalid carrier selected');
				return;
			}

			const airtimeWalletPayload = {
				userId: userProfile.userId,
				transactionDetails: {
					phoneNumber: phoneNumber, // Dynamic phone number
					amount: AirtimeAmount, // Dynamic airtime amount
					billerId,
					description: 'Airtime purchase',
				},
				deviceInformation,
				serviceProviderName: selectedCarrier,
				passKey: null,
			} as {
				userId: string;
				transactionDetails: {
					phoneNumber: string;
					amount: string;
					billerId: string;
					description: string;
				};
				deviceInformation: Record<string, unknown>;
				serviceProviderName: string;
				passKey: string | null;
				// passKey?: null;
				walletIdentifier?: string;
			};

			const airtimePaystackPayload = {
				userId: userProfile.userId,
				transactionDetails: {
					phoneNumber: phoneNumber, // Dynamic phone number
					amount: AirtimeAmount, // Dynamic airtime amount
					billerId,
					description: 'Airtime purchase',
				},
				deviceInformation,
				serviceProviderName: selectedCarrier,
			} as {
				userId: string;
				transactionDetails: {
					phoneNumber: string;
					amount: string;
					billerId: string;
					description: string;
				};
				deviceInformation: Record<string, unknown>;
				serviceProviderName: string;
			};

			// Conditional endpoint call
			if (paymentMethod === 'Pay with wallet') {
				airtimeWalletPayload.walletIdentifier =
					userProfile.wallet.walletIdentifier;
				const [apiResponse, error] = await makeWalletRequest(
					airtimeWalletPayload
				);

				handleApiResponse(apiResponse, error);
				setOpenModal(false);
			} else {
				if (paymentMethod === 'Pay with Paystack') {
					const [apiResponse, error] = await makePaystackRequest(
						airtimePaystackPayload
					);

					window.location.href = apiResponse.data.data.authorizationUrl;
					// handleApiResponse(apiResponse, error);
					// setOpenModal(false);
				}
			}
		} catch (error) {
			// console.error('Payment failed:', error);
			// toast.error('Payment failed.');
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
				<Box sx={{ position: 'absolute', top: '0px' }}>
					<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={true}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
					/>
				</Box>

				<Box>
					<Box>
						<Typography
							sx={{
								fontSize: '1.25rem',
								color: '#636559',
								fontWeight: 'medium',
							}}
						>
							Airtime
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
								Phone Number
							</Typography>
							<TextField
								fullWidth
								variant="outlined"
								type="number"
								value={phoneNumber}
								onChange={e => setPhoneNumber(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<IconButton
												onClick={() => setOpenDropdown(!openDropdown)}
											>
												<img
													src={carrierLogo}
													alt="carrier logo"
													style={{ width: 24, height: 24 }}
												/>
												<ArrowDropDownIcon />
											</IconButton>
										</InputAdornment>
									),
								}}
								placeholder="Enter phone number"
							/>

							<Typography
								sx={{
									fontSize: '0.88rem',
									color: '#636559',
									paddingTop: '1.5rem',
									lineHeight: '1.25rem',
									paddingBottom: '0.38rem',
								}}
							>
								Amount
							</Typography>
							<TextField
								fullWidth
								variant="outlined"
								onChange={e => setAirtimeAmount(e.target.value)}
								value={AirtimeAmount}
							/>
						</Box>

						{/* Dropdown for carrier selection */}
						{openDropdown && (
							<Box
								position="absolute"
								top={70}
								left={0}
								bgcolor="white"
								boxShadow={3}
								zIndex={10}
								borderRadius="5px"
								sx={{ width: { lg: '15%' } }}
							>
								{carrierOptions.map(carrier => (
									<MenuItem
										key={carrier.value}
										onClick={() => handleCarrierChange(carrier)}
										sx={{
											paddingY: '0.88rem',
											fontSize: '1rem',
											color: '#636559',
											fontWeight: 'medium',
										}}
									>
										<img
											src={carrier.logo}
											alt={carrier.label}
											style={{ width: 24, height: 24, marginRight: 8 }}
										/>
										{carrier.label}
									</MenuItem>
								))}
							</Box>
						)}
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
							// disabled={isLoading}
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
							{/* {isLoading ? 'Loading...' : 'Proceed to payment'} */}
							Proceed to payment
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
										{ label: 'Phone number', value: phoneNumber },
										{ label: 'Network Provider', value: selectedCarrier },
										{ label: 'Amount', value: AirtimeAmount },
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
										{ label: 'Phone number', value: phoneNumber },
										{ label: 'Network Provider', value: selectedCarrier },
										{ label: 'Amount', value: AirtimeAmount },
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
								{/* <button onClick={() => setStage(1)}>Back</button>
								<button onClick={() => setStage(3)}>Next</button> */}
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

export default AirtimeTransactions;
