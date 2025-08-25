import React, { useState, useEffect } from 'react';
import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
	InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useFetcher } from '../../../../../hooks/use-fetcher';
import { fetchCableTvServices } from '../../../../../Apis/card-payment';
import { useRequest } from '../../../../../hooks/use-request';
import {
	initiateWalletCableTv,
	initiateCardCableTv,
	initiateTransferCableTv,
	initiateUssdCableTv,
} from '../../../../../Apis/card-payment';
import MethodSelection from '../../../../payments/methodSelection';
import CardPayment from '../../../../payments/cardPayment';
import BankTransfer from '../../../../payments/bankTransfer';
import USSD from '../../../../payments/ussd';
import Processing from '../../../../payments/processing';
import Success from '../../../../payments/success';
import Failed from '../../../../payments/failed';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Variation {
	variationCode: string;
	name: string;
	variationAmount: number;
	fixedPrice: string;
	valueAddedServiceType: string;
}

interface CableService {
	serviceId: string;
	serviceName: string;
	minimiumAmount: number;
	maximumAmount: number;
	image: string;
	variations: Variation[];
}

interface CableServiceResponse {
	data: CableService[];
	succeeded: boolean;
	message: string;
	errors: any[];
	statusCode: number;
	statusCodeMessage: string;
}

interface TransferDetails {
	accountNumber: string;
	bankName: string;
	accountName: string;
	amount: string;
	reference: string;
	expiration: number;
}

interface CardDetails {
	number: string;
	expiryMonth: string;
	expiryYear: string;
	cvv: string;
}

const CableTvPage = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const navigate = useNavigate();
	const [selectedService, setSelectedService] = useState<CableService | null>(
		null
	);
	const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
		null
	);
	const [smartcardNumber, setSmartcardNumber] = useState<string>('');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [step, setStep] = useState<number>(1);
	const [showSmartcardField, setShowSmartcardField] = useState(false);

	// Payment states
	const [openModal, setOpenModal] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState<string>('wallet');
	const [currentStage, setCurrentStage] = useState<
		'method-selection' | 'card-details' | 'transfer-display' | 'ussd-display'
	>('method-selection');
	const [paymentStatus, setPaymentStatus] = useState<
		'idle' | 'processing' | 'success' | 'failed'
	>('idle');
	const [transferDetails, setTransferDetails] =
		useState<TransferDetails | null>(null);
	const [ussdCode, setUssdCode] = useState<string>('');
	const [timeLeft, setTimeLeft] = useState<number | null>(null);
	const [isExpired, setIsExpired] = useState(false);
	const [cardDetails, setCardDetails] = useState<CardDetails>({
		number: '',
		expiryMonth: '',
		expiryYear: '',
		cvv: '',
	});

	// API hooks
	const {
		response: cableServiceResponse,
		makeRequest: fetchCableServices,
		isLoading,
		error,
	} = useFetcher<CableServiceResponse>(fetchCableTvServices);

	const { makeRequest: makeWalletRequest } = useRequest(initiateWalletCableTv);
	const { makeRequest: makeCardRequest } = useRequest(initiateCardCableTv);
	const { makeRequest: makeTransferRequest } = useRequest(
		initiateTransferCableTv
	);
	const { makeRequest: makeUssdRequest } = useRequest(initiateUssdCableTv);

	useEffect(() => {
		fetchCableServices();
	}, []);

	const filteredServices =
		cableServiceResponse?.data?.filter((service: CableService) =>
			service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
		) || [];

	const handleServiceChange = (event: SelectChangeEvent) => {
		const serviceId = event.target.value;
		const service = cableServiceResponse?.data?.find(
			(s: { serviceId: string }) => s.serviceId === serviceId
		);
		setSelectedService(service || null);
		setSelectedVariation(null);
		setShowSmartcardField(false);
		setStep(2);
	};

	const handleVariationChange = (event: SelectChangeEvent) => {
		const variationCode = event.target.value;
		const variation = selectedService?.variations.find(
			v => v.variationCode === variationCode
		);
		setSelectedVariation(variation || null);
		setShowSmartcardField(true);
	};

	const handleSmartcardNumberChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value.replace(/\D/g, '');
		setSmartcardNumber(value);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleBackToServices = () => {
		setStep(1);
		setSelectedService(null);
		setSelectedVariation(null);
		setSmartcardNumber('');
		setShowSmartcardField(false);
	};

	const handleOpenPaymentModal = () => {
		if (!smartcardNumber || smartcardNumber.length < 10) {
			toast.error('Please enter a valid 10-digit smartcard number');
			return;
		}
		if (!selectedService || !selectedVariation) {
			toast.error('Please select a package');
			return;
		}
		setOpenModal(true);
		setCurrentStage('method-selection');
		setPaymentStatus('idle');
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setPaymentMethod('wallet');
		setPaymentStatus('idle');
		setCurrentStage('method-selection');
		setCardDetails({
			number: '',
			expiryMonth: '',
			expiryYear: '',
			cvv: '',
		});
		setTransferDetails(null);
		setUssdCode('');
	};

	const handleCloseModalSuccess = () => {
		setOpenModal(false);
		navigate('/dashboard');
	};

	const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
		setPaymentMethod(event.target.value);
	};

	const handleProceedToCardDetails = () => {
		setCurrentStage('card-details');
	};

	const handleCardDetailChange =
		(field: keyof CardDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
			let value = e.target.value;

			if (field === 'expiryMonth' || field === 'expiryYear') {
				value = value.replace(/\D/g, '');
				if (value.length > 2) return;

				if (field === 'expiryMonth' && value.length === 2) {
					const month = parseInt(value);
					if (month < 1) value = '01';
					if (month > 12) value = '12';
				}
			}

			setCardDetails(prev => ({
				...prev,
				[field]: value,
			}));
		};

	const handleInitiateTransferPayment = async () => {
		setPaymentStatus('processing');
		try {
			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) throw new Error('User profile not found');
			const userProfile = JSON.parse(userProfileItem);

			const payload = {
				InitialiseCableTransaction: {
					userId: userProfile.userId,
					transactionDetails: {
						phoneNumber: userProfile.phoneNumber,
						amount: selectedVariation?.variationAmount.toString(),
						billerId: selectedService?.serviceId,
						serviceProviderName: selectedService?.serviceName,
						cablePlanId: selectedVariation?.variationCode,
						smartCardNumber: smartcardNumber,
						description: 'cable-tv',
					},
				},
			};

			const [response, error] = await makeTransferRequest(payload);
			if (error) throw error;

			const transferDetails = {
				accountNumber: response.data.accountNumber || 'Not available',
				bankName: response.data.bankName || 'Not specified',
				accountName: response.data.accountName || 'Not available',
				amount:
					response.data.amount ||
					selectedVariation?.variationAmount.toString() ||
					'',
				reference: response.data.reference || 'Use your user ID',
				expiration: response.data.expiration || 300,
			};

			setTransferDetails(transferDetails);
			setTimeLeft(transferDetails.expiration);
			setIsExpired(false);
			setCurrentStage('transfer-display');
			setPaymentStatus('idle');
		} catch (error) {
			console.error('Transfer initiation failed:', error);
			setPaymentStatus('failed');
		}
	};

	const handleInitiateUssdPayment = async (selectedBank: {
		code: string;
		name: string;
	}) => {
		setPaymentStatus('processing');
		try {
			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) throw new Error('User profile not found');
			const userProfile = JSON.parse(userProfileItem);

			const payload = {
				AccountBank: selectedBank.code,
				InitialiseCableTransaction: {
					userId: userProfile.userId,
					transactionDetails: {
						phoneNumber: userProfile.phoneNumber,
						amount: selectedVariation?.variationAmount.toString(),
						billerId: selectedService?.serviceId,
						serviceProviderName: selectedService?.serviceName,
						cablePlanId: selectedVariation?.variationCode,
						smartCardNumber: smartcardNumber,
						description: 'cable-tv',
					},
				},
			};

			const [response, error] = await makeUssdRequest(payload);
			if (error) throw error;

			if (response?.data?.meta?.authorization?.note) {
				setUssdCode(response.data.meta.authorization.note);
				setTimeLeft(300);
				setIsExpired(false);
				setCurrentStage('ussd-display');
				setPaymentStatus('idle');
				return response;
			} else {
				throw new Error('USSD code not found in response');
			}
		} catch (error) {
			console.error('USSD initiation failed:', error);
			setPaymentStatus('failed');
			throw error;
		}
	};

	const handleConfirmTransferPayment = () => {
		setPaymentStatus('processing');
		setTimeout(() => {
			setPaymentStatus('success');
			setTimeout(handleCloseModal, 2000);
		}, 1500);
	};

	const handleCopyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success('Copied to clipboard');
	};

	const handlePay = async () => {
		setPaymentStatus('processing');
		try {
			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) throw new Error('User profile not found');
			const userProfile = JSON.parse(userProfileItem);

			const commonPayload = {
				userId: userProfile.userId,
				transactionDetails: {
					phoneNumber: userProfile.phoneNumber,
					amount: selectedVariation?.variationAmount.toString(),
					billerId: selectedService?.serviceId,
					serviceProviderName: selectedService?.serviceName,
					cablePlanId: selectedVariation?.variationCode,
					smartCardNumber: smartcardNumber,
					description: 'cable-tv',
				},
			};

			switch (paymentMethod) {
				case 'wallet':
					const walletPayload = {
						...commonPayload,
						walletIdentifier: userProfile.wallet?.walletIdentifier,
						passKey: '111111',
					};
					const [walletResponse, walletError] = await makeWalletRequest(
						walletPayload
					);
					if (walletError) throw walletError;
					setPaymentStatus('success');
					break;

				case 'card':
					const cardPayload = {
						InitialiseCableTransaction: commonPayload,
						cardNumber: cardDetails.number,
						expiryMonth: cardDetails.expiryMonth,
						expiryYear: cardDetails.expiryYear,
						cvv: cardDetails.cvv,
						redirectUrl: `${window.location.origin}/dashboard`,
					};
					const [cardResponse, cardError] = await makeCardRequest(cardPayload);
					if (cardError) throw cardError;
					if (cardResponse?.data?.authUrl) {
						window.location.href = cardResponse.data.authUrl;
					} else {
						setPaymentStatus('success');
					}
					break;

				case 'transfer':
					await handleInitiateTransferPayment();
					break;

				case 'ussd':
					// Bank selection will be handled in MethodSelection
					break;

				default:
					throw new Error('Invalid payment method selected');
			}
		} catch (error) {
			console.error('Payment failed:', error);
			setPaymentStatus('failed');
		}
	};

	const paymentMethods = [
		{ id: 'wallet', label: 'Pay with Wallet' },
		{ id: 'card', label: 'Pay with Card' },
		{ id: 'transfer', label: 'Pay with Bank Transfer' },
		{ id: 'ussd', label: 'Pay with USSD' },
	];

	if (isLoading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="80vh"
			>
				<CircularProgress size={60} />
			</Box>
		);
	}

	if (error) {
		return (
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
				gap={2}
			>
				<Typography
					color="error"
					variant="h6"
				>
					{error.message || 'Failed to load services'}
				</Typography>
				<Button
					variant="contained"
					color="primary"
					onClick={() => fetchCableServices()}
				>
					Retry
				</Button>
			</Box>
		);
	}

	if (!cableServiceResponse?.data?.length) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
			>
				<Typography variant="h6">No cable TV services available</Typography>
			</Box>
		);
	}

	return (
		<Box
			maxWidth="md"
			sx={{ py: 2 }}
		>
			{step !== 1 && (
				<Box
					display="flex"
					justifyContent="flex-start"
					mb={2}
				>
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={handleBackToServices}
						variant="outlined"
						sx={{ color: '#00000044' }}
					>
						Back to Services
					</Button>
				</Box>
			)}

			<Typography
				variant="h4"
				component="h1"
				gutterBottom
				align="left"
			>
				Cable TV Subscription
			</Typography>

			{/* Step 1: Service Selection */}
			{step === 1 && (
				<>
					<FormControl sx={{ mb: 3, width: { xs: '100%', md: '45%' } }}>
						<InputLabel id="service-select-label">
							Select Service Provider
						</InputLabel>
						<Select
							labelId="service-select-label"
							id="service-select"
							value={selectedService?.serviceId || ''}
							label="Select Service Provider"
							onChange={handleServiceChange}
						>
							{filteredServices.map((service: CableService) => (
								<MenuItem
									key={service.serviceId}
									value={service.serviceId}
								>
									{service.serviceName}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</>
			)}

			{/* Step 2: Package Selection and Smartcard Number */}
			{step === 2 && selectedService && (
				<Box sx={{ width: { xs: '100%', md: '45%' } }}>
					{/* Package Selection */}
					<FormControl
						fullWidth
						sx={{ mb: 2 }}
					>
						<InputLabel id="package-select-label">Select Package</InputLabel>
						<Select
							labelId="package-select-label"
							id="package-select"
							value={selectedVariation?.variationCode || ''}
							label="Select Package"
							onChange={handleVariationChange}
						>
							{selectedService.variations.map((variation: Variation) => (
								<MenuItem
									key={variation.variationCode}
									value={variation.variationCode}
								>
									{variation.name} - ₦
									{variation.variationAmount.toLocaleString()}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Smartcard Number Input - appears below package selection */}
					{showSmartcardField && (
						<TextField
							fullWidth
							label="Smartcard Number"
							variant="outlined"
							value={smartcardNumber}
							onChange={handleSmartcardNumberChange}
							sx={{ mb: 3 }}
							required
							inputProps={{
								maxLength: 15,
								pattern: '[0-9]*',
								inputMode: 'numeric',
							}}
							helperText="Enter your smartcard number (10-15 digits)"
						/>
					)}

					{/* Action Buttons */}
					<Box
						display="flex"
						justifyContent="space-between"
						sx={{ mt: 2 }}
					>
						<Button
							variant="outlined"
							onClick={handleBackToServices}
							sx={{
								color: 'text.primary',
								minWidth: 120,
								'&:hover': {
									borderColor: 'primary.main',
								},
							}}
						>
							Back
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								if (!selectedVariation) {
									toast.error('Please select a package');
									return;
								}
								if (!smartcardNumber || smartcardNumber.length < 10) {
									toast.error(
										'Please enter a valid smartcard number (10-15 digits)'
									);
									return;
								}
								setStep(3);
							}}
							disabled={
								!selectedVariation ||
								!smartcardNumber ||
								smartcardNumber.length < 10
							}
							sx={{
								minWidth: 120,
								fontWeight: 600,
							}}
						>
							Continue
						</Button>
					</Box>
				</Box>
			)}

			{/* Step 3: Confirmation */}
			{step === 3 && selectedVariation && (
				<>
					<Paper
						elevation={3}
						sx={{ p: 3, mb: 3, width: { xs: '100%', md: '45%' } }}
					>
						<Typography
							variant="h6"
							gutterBottom
						>
							{selectedService?.serviceName} - {selectedVariation.name}
						</Typography>
						<Divider sx={{ my: 2 }} />

						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={6}
							>
								<Typography variant="subtitle2">Smartcard Number:</Typography>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<Typography>{smartcardNumber}</Typography>
							</Grid>

							<Grid
								item
								xs={6}
							>
								<Typography variant="subtitle2">Package:</Typography>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<Typography>{selectedVariation.name}</Typography>
							</Grid>

							<Grid
								item
								xs={6}
							>
								<Typography variant="subtitle2">Amount:</Typography>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<Typography
									color="success.main"
									fontWeight="bold"
								>
									₦{selectedVariation.variationAmount.toLocaleString()}
								</Typography>
							</Grid>

							<Grid
								item
								xs={6}
							>
								<Typography variant="subtitle2">Service Type:</Typography>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<Typography>
									{selectedVariation.valueAddedServiceType}
								</Typography>
							</Grid>
						</Grid>
					</Paper>

					<Box
						display="flex"
						justifyContent="space-between"
						sx={{ width: { xs: '100%', md: '45%' } }}
					>
						<Button
							variant="outlined"
							size="large"
							onClick={() => setStep(2)}
							sx={{ minWidth: '120px', color: 'black' }}
						>
							Back
						</Button>
						<Button
							variant="contained"
							size="large"
							color="primary"
							onClick={handleOpenPaymentModal}
							sx={{ minWidth: '120px' }}
						>
							Proceed to Payment
						</Button>
					</Box>
				</>
			)}

			{/* Payment Modal */}
			<Dialog
				open={openModal}
				onClose={handleCloseModal}
				maxWidth="sm"
				fullWidth
				sx={{ '& .MuiDialog-paper': { borderRadius: '8px', p: 3 } }}
			>
				{paymentStatus === 'processing' ? (
					<Processing />
				) : paymentStatus === 'success' ? (
					<Success handleCloseModal={handleCloseModalSuccess} />
				) : paymentStatus === 'failed' ? (
					<Failed setPaymentStatus={setPaymentStatus} />
				) : currentStage === 'ussd-display' ? (
					<USSD
						handleCloseModal={handleCloseModal}
						handleCopyToClipboard={handleCopyToClipboard}
						setCurrentStage={setCurrentStage}
						ussdCode={ussdCode}
						timeLeft={timeLeft}
						setIsExpired={setIsExpired}
					/>
				) : currentStage === 'transfer-display' && transferDetails ? (
					<BankTransfer
						handleCopyToClipboard={handleCopyToClipboard}
						transferDetails={transferDetails}
						setCurrentStage={setCurrentStage}
						handleConfirmTransferPayment={handleConfirmTransferPayment}
					/>
				) : currentStage === 'card-details' ? (
					<CardPayment
						handleCloseModal={handleCloseModal}
						handleCardDetailChange={handleCardDetailChange}
						cardDetails={cardDetails}
						amount={selectedVariation?.variationAmount.toString() || ''}
						handleSubmitPayment={handlePay}
						setCurrentStage={setCurrentStage}
					/>
				) : currentStage === 'method-selection' ? (
					<MethodSelection
						paymentMethods={paymentMethods}
						handlePaymentMethodChange={handlePaymentMethodChange}
						handleCloseModal={handleCloseModal}
						handleProceedToCardDetails={handleProceedToCardDetails}
						handleInitiateTransferPayment={handleInitiateTransferPayment}
						handleInitiateUssdPayment={handleInitiateUssdPayment}
						paymentMethod={paymentMethod}
						handleSubmitPayment={handlePay}
						serviceType="cable"
						identifier={smartcardNumber}
						selectedProvider={selectedService?.serviceName || ''}
						amount={selectedVariation?.variationAmount.toString() || ''}
						setCurrentStage={setCurrentStage}
						setUssdCode={setUssdCode}
					/>
				) : null}
			</Dialog>

			<ToastContainer position="bottom-right" />
		</Box>
	);
};

export default CableTvPage;
