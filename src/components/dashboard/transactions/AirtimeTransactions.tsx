import React, { useEffect, useState } from 'react';
import {
	TextField,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Box,
	Typography,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	InputAdornment,
	SelectChangeEvent,
	CircularProgress,
	IconButton,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '../../../hooks/use-request';
import {
	initiateWalletAirtime,
	initiatePaystackAirtime,
	getAirtimeBillers,
	initiateTransferAirtime,
	initiateUssdAirtime,
	getPhoneOperator, // Added import for phone validation
} from '../../../Apis/card-payment';
import mtnLogo from '../../../assets/icons/mtn-logo.svg';
import gloLogo from '../../../assets/icons/glo-logo.svg';
import mobile9Logo from '../../../assets/icons/9mobile-logo.svg';
import airtelLogo from '../../../assets/icons/airtel-logo.svg';
import USSD from '../../payments/ussd';
import BankTransfer from '../../payments/bankTransfer';
import CardPayment from '../../payments/cardPayment';
import Failed from '../../payments/failed';
import Success from '../../payments/success';
import Processing from '../../payments/processing';
import MethodSelection from '../../payments/methodSelection';

interface CarrierOption {
	value: string;
	label: string;
	logo: string;
	billerId: string;
	minAmount: number;
	maxAmount: number;
}

interface CardDetails {
	number: string;
	expiryMonth: string;
	expiryYear: string;
	cvv: string;
}

interface TransferDetails {
	accountNumber: string;
	bankName: string;
	accountName: string;
	amount: string;
	reference: string;
	expiration: number;
}

interface PhoneValidation {
	isValid: boolean;
	isLoading: boolean;
	error: string;
	detectedOperator?: string;
}

const AirtimeTransactions: React.FC = () => {
	const navigate = useNavigate();
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [amount, setAmount] = useState<string>('');
	const [selectedCarrier, setSelectedCarrier] = useState<string>('');
	const [carrierLogo, setCarrierLogo] = useState<string>('');
	const [carrierOptions, setCarrierOptions] = useState<CarrierOption[]>([]);
	const [openModal, setOpenModal] = useState(false);
	const [paymentStatus, setPaymentStatus] = useState<
		'idle' | 'processing' | 'success' | 'failed'
	>('idle');
	const [currentStage, setCurrentStage] = useState<
		'method-selection' | 'card-details' | 'transfer-display' | 'ussd-display'
	>('method-selection');
	const [paymentMethod, setPaymentMethod] = useState<string>('wallet');
	const [cardDetails, setCardDetails] = useState<CardDetails>({
		number: '',
		expiryMonth: '',
		expiryYear: '',
		cvv: '',
	});
	const [transferDetails, setTransferDetails] =
		useState<TransferDetails | null>(null);
	const [ussdCode, setUssdCode] = useState<string>('');
	const [timeLeft, setTimeLeft] = useState<number | null>(null);
	const [isExpired, setIsExpired] = useState(false);
	const [phoneValidation, setPhoneValidation] = useState<PhoneValidation>({
		isValid: false,
		isLoading: false,
		error: '',
		detectedOperator: '',
	});
	const [isCarrierAutoSelected, setIsCarrierAutoSelected] = useState(false);

	const {
		isLoading: isLoadingCarriers,
		makeRequest: makeAirtimeCarrierRequest,
	} = useRequest(getAirtimeBillers);
	const { isLoading: isLoadingWallet, makeRequest: makeWalletRequest } =
		useRequest(initiateWalletAirtime);
	const { isLoading: isLoadingPaystack, makeRequest: makePaystackRequest } =
		useRequest(initiatePaystackAirtime);
	const { isLoading: isLoadingTransfer, makeRequest: makeTransferRequest } =
		useRequest(initiateTransferAirtime);
	const { isLoading: isLoadingUssd, makeRequest: makeUssdRequest } =
		useRequest(initiateUssdAirtime);
	const { isLoading: isLoadingValidation, makeRequest: makeValidationRequest } =
		useRequest(getPhoneOperator);

	// Logo mapping functions
	const getCarrierLogo = (name: string): string => {
		const logoMap: { [key: string]: string } = {
			'MTN Nigeria': mtnLogo,
			'Glo Nigeria': gloLogo,
			'9Mobile (Etisalat) Nigeria': mobile9Logo,
			'Airtel Nigeria': airtelLogo,
		};
		return logoMap[name] || mtnLogo;
	};

	const getCarrierLabel = (name: string): string => {
		const labelMap: { [key: string]: string } = {
			'MTN Nigeria': 'MTN',
			'Glo Nigeria': 'GLO',
			'9Mobile (Etisalat) Nigeria': '9 MOBILE',
			'Airtel Nigeria': 'AIRTEL',
		};
		return labelMap[name] || name;
	};

	// Function to validate manually selected carrier against detected operator
	const validateManualCarrierSelection = (
		detectedOperator: string,
		selectedCarrierValue: string
	) => {
		const operator = detectedOperator.toLowerCase();
		const selectedCarrierName = selectedCarrierValue.toLowerCase();

		// Check if the detected operator matches the manually selected carrier
		const isValid =
			operator.includes(selectedCarrierName.split(' ')[0]) || // Check first word (e.g., "mtn")
			selectedCarrierName.includes(operator) ||
			(operator.includes('mtn') && selectedCarrierName.includes('mtn')) ||
			(operator.includes('glo') && selectedCarrierName.includes('glo')) ||
			(operator.includes('airtel') && selectedCarrierName.includes('airtel')) ||
			((operator.includes('9mobile') || operator.includes('etisalat')) &&
				selectedCarrierName.includes('9mobile'));

		if (!isValid) {
			setPhoneValidation(prev => ({
				...prev,
				isValid: false,
				error: `Phone number belongs to ${detectedOperator}, but you selected ${selectedCarrierValue.replace(
					' Nigeria',
					''
				)}. Please select the correct network.`,
			}));
		} else {
			setPhoneValidation(prev => ({
				...prev,
				isValid: true,
				error: '',
			}));
		}
	};

	// Function to map operator name to carrier option
	const mapOperatorToCarrier = (operatorName: string): CarrierOption | null => {
		if (!operatorName) return null;

		const operator = operatorName.toLowerCase();

		// Find matching carrier based on operator name
		return (
			carrierOptions.find(carrier => {
				const carrierName = carrier.value.toLowerCase();
				const carrierLabel = carrier.label.toLowerCase();

				return (
					carrierName.includes(operator) ||
					carrierLabel.includes(operator) ||
					operator.includes(carrierName.split(' ')[0]) || // Match first word (e.g., "mtn")
					operator.includes(carrierLabel)
				);
			}) || null
		);
	};

	const fetchAirtimeBillers = async () => {
		try {
			const [apiResponse, error] = await makeAirtimeCarrierRequest({});

			if (error) {
				console.error('Error fetching airtime billers:', error);
				// Fallback to default carriers
				const defaultCarriers = [
					{
						value: 'MTN Nigeria',
						label: 'MTN',
						logo: mtnLogo,
						billerId: '341',
						minAmount: 50,
						maxAmount: 50000,
					},
					{
						value: 'Glo Nigeria',
						label: 'GLO',
						logo: gloLogo,
						billerId: '344',
						minAmount: 50,
						maxAmount: 50000,
					},
					{
						value: '9Mobile (Etisalat) Nigeria',
						label: '9 MOBILE',
						logo: mobile9Logo,
						billerId: '340',
						minAmount: 50,
						maxAmount: 50000,
					},
					{
						value: 'Airtel Nigeria',
						label: 'AIRTEL',
						logo: airtelLogo,
						billerId: '342',
						minAmount: 50,
						maxAmount: 50000,
					},
				];
				setCarrierOptions(defaultCarriers);
				return;
			}

			if (apiResponse?.data) {
				const transformedCarriers: CarrierOption[] = apiResponse.data.map(
					(biller: any) => ({
						value: biller.name,
						label: getCarrierLabel(biller.name),
						logo: getCarrierLogo(biller.name),
						billerId: biller.billerId.toString(),
						minAmount: biller.minLocalTransactionAmount,
						maxAmount: biller.maxLocalTransactionAmount,
					})
				);

				setCarrierOptions(transformedCarriers);
			}
		} catch (error) {
			console.error('Error in fetchAirtimeBillers:', error);
		}
	};

	// Validate phone number and auto-select carrier
	const validatePhoneNumber = async (phone: string) => {
		if (!phone) {
			setPhoneValidation({
				isValid: false,
				isLoading: false,
				error: '',
				detectedOperator: '',
			});
			setSelectedCarrier('');
			setCarrierLogo('');
			setIsCarrierAutoSelected(false);
			return;
		}

		// Check if phone is in correct format
		if (!phone.startsWith('+234') && !phone.startsWith('234')) {
			setPhoneValidation({
				isValid: false,
				isLoading: false,
				error: 'Phone number must start with +234 or 234',
				detectedOperator: '',
			});
			return;
		}

		// Check if phone number is complete (should be 14 characters: +234XXXXXXXXX)
		if (phone.length < 14) {
			setPhoneValidation({
				isValid: false,
				isLoading: false,
				error: '',
				detectedOperator: '',
			});
			return;
		}

		setPhoneValidation(prev => ({ ...prev, isLoading: true, error: '' }));

		try {
			const [response, error] = await makeValidationRequest({
				phoneNumber: phone,
			});

			if (error) {
				setPhoneValidation({
					isValid: false,
					isLoading: false,
					error: 'Unable to validate phone number. Please try again.',
					detectedOperator: '',
				});
				return;
			}

			const detectedOperator = response.data?.name || '';

			if (detectedOperator) {
				// Find matching carrier
				const matchingCarrier = mapOperatorToCarrier(detectedOperator);

				if (matchingCarrier) {
					// Auto-select the matching carrier
					setSelectedCarrier(matchingCarrier.value);
					setCarrierLogo(matchingCarrier.logo);
					setIsCarrierAutoSelected(true);

					setPhoneValidation({
						isValid: true,
						isLoading: false,
						error: '',
						detectedOperator: detectedOperator,
					});
				} else {
					// Operator detected but no matching carrier found
					setPhoneValidation({
						isValid: false,
						isLoading: false,
						error: `Detected operator "${detectedOperator}" is not supported`,
						detectedOperator: detectedOperator,
					});
				}
			} else {
				setPhoneValidation({
					isValid: false,
					isLoading: false,
					error: 'Could not detect phone operator',
					detectedOperator: '',
				});
			}
		} catch (error) {
			console.error('Phone validation error:', error);
			setPhoneValidation({
				isValid: false,
				isLoading: false,
				error: 'Validation failed. Please try again.',
				detectedOperator: '',
			});
		}
	};

	// Function to check if amount is valid based on selected carrier limits
	const isAmountValid = (): boolean => {
		if (!amount || !selectedCarrier) return false;

		const numAmount = parseInt(amount);
		const carrier = carrierOptions.find(c => c.value === selectedCarrier);

		if (!carrier) return false;

		return numAmount >= carrier.minAmount && numAmount <= carrier.maxAmount;
	};

	// Function to check if form is valid for payment
	const isFormValid = (): boolean => {
		// Basic field validation
		if (!amount || !phoneNumber || !selectedCarrier) return false;

		// Phone number validation
		if (phoneValidation.error && !phoneValidation.isValid) return false;

		// Amount validation
		if (!isAmountValid()) return false;

		// Phone number still loading
		if (phoneValidation.isLoading) return false;

		return true;
	};

	useEffect(() => {
		fetchAirtimeBillers();
	}, []);

	useEffect(() => {
		if (!timeLeft) return;

		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev !== null && prev <= 1) {
					clearInterval(timer);
					setIsExpired(true);
					return 0;
				}
				return prev !== null ? prev - 1 : null;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft]);

	// Validate phone number when phone changes
	useEffect(() => {
		if (phoneNumber) {
			// Debounce the validation to avoid too many API calls
			const timeoutId = setTimeout(() => {
				validatePhoneNumber(phoneNumber);
			}, 800);

			return () => clearTimeout(timeoutId);
		} else {
			setPhoneValidation({
				isValid: false,
				isLoading: false,
				error: '',
				detectedOperator: '',
			});
			setSelectedCarrier('');
			setCarrierLogo('');
			setIsCarrierAutoSelected(false);
		}
	}, [phoneNumber]);

	const handleCarrierChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value;
		setSelectedCarrier(value);
		const carrier = carrierOptions.find(c => c.value === value);
		if (carrier) {
			setCarrierLogo(carrier.logo);
		}
		// Mark that user manually selected a carrier
		setIsCarrierAutoSelected(false);

		// Validate the phone number against the manually selected carrier
		if (phoneNumber && phoneValidation.detectedOperator) {
			validateManualCarrierSelection(phoneValidation.detectedOperator, value);
		}
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, '');
		setAmount(value);
	};

	const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters

		// Convert to international format if it starts with 0
		if (value.startsWith('0') && value.length > 1) {
			value = '+234' + value.substring(1);
		}
		// Ensure it starts with +234 if it starts with 234
		else if (value.startsWith('234') && !value.startsWith('+234')) {
			value = '+' + value;
		}
		// For other cases (like partial input), just keep the cleaned value

		setPhoneNumber(value);
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

	const handleCancel = () => {
		setAmount('');
		setPhoneNumber('');
		navigate(-1);
	};

	const handleOpenModal = () => {
		// Only open modal if form is valid
		if (!isFormValid()) return;

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

	const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
		setPaymentMethod(event.target.value);
	};

	const handleProceedToCardDetails = () => {
		setCurrentStage('card-details');
	};

	const handleInitiateTransferPayment = async () => {
		setPaymentStatus('processing');
		try {
			const carrier = carrierOptions.find(c => c.value === selectedCarrier);
			if (!carrier) throw new Error('Invalid carrier selected');

			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) throw new Error('User profile not found');
			const userProfile = JSON.parse(userProfileItem);

			const payload = {
				initialiseAirtimeTransaction: {
					userId: userProfile.userId,
					transactionDetails: {
						phoneNumber,
						amount: parseInt(amount),
						billerId: carrier.billerId,
						serviceProviderName: selectedCarrier,
						description: 'airtime',
					},
				},
			};

			const [response, error] = await makeTransferRequest(payload);
			if (error) throw error;

			// Extract transfer details from response
			const transferDetails = {
				accountNumber: response.data.accountNumber || 'Not available',
				bankName: response.data.bankName || 'Not specified',
				accountName: response.data.accountName || 'Not available',
				amount: response.data.amount || amount,
				reference: response.data.reference || 'Use your user ID',
				expiration: response.data.expiration || 300, // 5 minutes default
			};

			setTransferDetails(transferDetails);

			// Start countdown
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
		code: any;
		name: any;
	}) => {
		setPaymentStatus('processing');
		try {
			const carrier = carrierOptions.find(c => c.value === selectedCarrier);
			if (!carrier) throw new Error('Invalid carrier selected');

			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) throw new Error('User profile not found');
			const userProfile = JSON.parse(userProfileItem);

			const payload = {
				AccountBank: selectedBank.code,
				initialiseAirtimeTransaction: {
					userId: userProfile.userId,
					transactionDetails: {
						phoneNumber,
						amount: parseInt(amount),
						billerId: carrier.billerId,
						serviceProviderName: selectedCarrier,
						description: 'airtime',
					},
				},
			};

			const [response, error] = await makeUssdRequest(payload);
			if (error) throw error;

			console.log('USSD Response:', response);

			if (response?.data?.meta?.authorization?.note) {
				setUssdCode(response.data.meta.authorization.note);
				setTimeLeft(300);
				setIsExpired(false);
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
	};

	const getSelectedCarrierDetails = () => {
		return carrierOptions.find(c => c.value === selectedCarrier);
	};

	// Get amount error message
	const getAmountErrorMessage = (): string => {
		if (!amount || !selectedCarrier) return '';

		const numAmount = parseInt(amount);
		const carrier = carrierOptions.find(c => c.value === selectedCarrier);

		if (!carrier) return '';

		if (numAmount < carrier.minAmount) {
			return `Minimum amount is ₦${carrier.minAmount}`;
		}

		if (numAmount > carrier.maxAmount) {
			return `Maximum amount is ₦${carrier.maxAmount}`;
		}

		return '';
	};

	const paymentMethods = [
		{ id: 'wallet', label: 'Pay with Wallet' },
		{ id: 'card', label: 'Pay with Card' },
		{ id: 'transfer', label: 'Pay with Bank Transfer' },
		{ id: 'ussd', label: 'Pay with USSD' },
	];

	if (isLoadingCarriers) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '50vh',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	const handleSubmitPayment = async () => {
		// Validate form before proceeding
		if (!isFormValid()) {
			setPaymentStatus('failed');
			return;
		}

		setPaymentStatus('processing');

		try {
			// Validate required fields
			if (!amount || !phoneNumber || !selectedCarrier) {
				throw new Error('Please fill all required fields');
			}

			// Get carrier details
			const carrier = carrierOptions.find(c => c.value === selectedCarrier);
			if (!carrier) throw new Error('Invalid carrier selected');

			// Get user profile
			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) throw new Error('User profile not found');
			const userProfile = JSON.parse(userProfileItem);

			// Common payload for all payment methods
			const commonPayload = {
				userId: userProfile.userId,
				transactionDetails: {
					phoneNumber,
					amount: parseInt(amount),
					billerId: carrier.billerId,
					serviceProviderName: selectedCarrier,
					description: 'airtime',
				},
			};

			// Handle each payment method differently
			switch (paymentMethod) {
				case 'wallet':
					// Wallet payment payload
					const walletPayload = {
						...commonPayload,
						walletIdentifier: userProfile.wallet?.walletIdentifier,
						serviceProviderName: selectedCarrier,
						passKey: '111111', // Default passKey
					};

					const [walletResponse, walletError] = await makeWalletRequest(
						walletPayload
					);
					if (walletError) throw walletError;
					setPaymentStatus('success');
					break;

				case 'card':
					// Card payment payload
					const cardPayload = {
						initialiseAirtimeTransaction: commonPayload,
						cardNumber: cardDetails.number,
						expiryMonth: cardDetails.expiryMonth,
						expiryYear: cardDetails.expiryYear,
						cvv: cardDetails.cvv,
						redirectUrl: `${window.location.origin}/dashboard`,
					};

					const [cardResponse, cardError] = await makePaystackRequest(
						cardPayload
					);
					if (cardError) throw cardError;

					if (cardResponse?.data?.authUrl) {
						// Redirect to payment gateway
						window.location.href = cardResponse.data.authUrl;
					} else {
						setPaymentStatus('success');
					}
					break;

				case 'transfer':
					// Bank transfer payment
					const [transferResponse, transferError] = await makeTransferRequest(
						commonPayload
					);
					if (transferError) throw transferError;

					// Extract transfer details from response
					const transferDetails = {
						accountNumber:
							transferResponse.data.accountNumber || 'Not available',
						bankName: transferResponse.data.bankName || 'Not specified',
						accountName: transferResponse.data.accountName || 'Not available',
						amount: transferResponse.data.amount || amount,
						reference: transferResponse.data.reference || 'Use your user ID',
						expiration: transferResponse.data.expiration || 300, // 5 minutes default
					};

					setTransferDetails(transferDetails);
					setTimeLeft(transferDetails.expiration);
					setIsExpired(false);
					setCurrentStage('transfer-display');
					break;

				case 'ussd':
					// USSD payment
					const [ussdResponse, ussdError] = await makeUssdRequest(
						commonPayload
					);
					if (ussdError) throw ussdError;

					setUssdCode(ussdResponse.data.ussdCode || '*123*1#');
					setCurrentStage('ussd-display');
					break;

				default:
					throw new Error('Invalid payment method selected');
			}
		} catch (error) {
			console.error('Payment failed:', error);
			setPaymentStatus('failed');
		}
	};

	return (
		<>
			{/* Main Form */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					height: '85vh',
					width: { xs: '100%', md: '45%' },
					gap: '2rem',
				}}
			>
				<Box>
					<Typography
						sx={{ fontSize: '1.25rem', color: '#636559', fontWeight: 'medium' }}
					>
						Airtime Purchase
					</Typography>

					<Box mt={3}>
						<Typography
							sx={{
								fontSize: '0.88rem',
								color: '#636559',
								lineHeight: '1.25rem',
								pb: 1,
							}}
						>
							Phone Number
						</Typography>
						<TextField
							fullWidth
							variant="outlined"
							value={phoneNumber}
							onChange={handlePhoneNumberChange}
							placeholder="Enter phone number"
							error={!!phoneValidation.error}
							helperText={
								phoneValidation.isLoading
									? 'loading...'
									: phoneValidation.error
									? phoneValidation.error
									: phoneValidation.isValid &&
									  phoneValidation.detectedOperator &&
									  isCarrierAutoSelected
									? ``
									: phoneValidation.isValid &&
									  phoneValidation.detectedOperator &&
									  !isCarrierAutoSelected
									? ``
									: ''
							}
							InputProps={{
								startAdornment: carrierLogo && (
									<InputAdornment position="start">
										<img
											src={carrierLogo}
											alt="carrier logo"
											style={{ width: 24, height: 24, marginRight: 8 }}
										/>
									</InputAdornment>
								),
								endAdornment: phoneValidation.isLoading ? (
									<InputAdornment position="end">
										<CircularProgress size={20} />
									</InputAdornment>
								) : phoneNumber && phoneNumber.length >= 14 ? (
									<InputAdornment position="end">
										{phoneValidation.isValid ? (
											<CheckCircleIcon color="success" />
										) : (
											<ErrorIcon color="error" />
										)}
									</InputAdornment>
								) : null,
								inputProps: {
									maxLength: 14, // +234XXXXXXXXX (1 + 3 + 10)
									pattern: '^\\+?234\\d{10}$', // Optional: HTML5 validation pattern
								},
							}}
						/>
					</Box>

					<Box mt={3}>
						<Typography
							sx={{
								fontSize: '0.88rem',
								color: '#636559',
								lineHeight: '1.25rem',
								pb: 1,
							}}
						>
							Select Your Network
						</Typography>
						<FormControl fullWidth>
							<Select
								value={selectedCarrier}
								onChange={handleCarrierChange}
								IconComponent={ArrowDropDownIcon}
								disabled={carrierOptions.length === 0}
								error={
									!isCarrierAutoSelected &&
									!!phoneValidation.detectedOperator &&
									!!selectedCarrier &&
									!phoneValidation.isValid
								}
							>
								{carrierOptions.map(carrier => (
									<MenuItem
										key={carrier.value}
										value={carrier.value}
									>
										<Box
											display="flex"
											alignItems="center"
											gap={1}
										>
											<img
												src={carrier.logo}
												alt={carrier.label}
												style={{ width: 24, height: 24 }}
											/>
											{carrier.label}
										</Box>
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Box mt={3}>
						<Typography
							sx={{
								fontSize: '0.88rem',
								color: '#636559',
								lineHeight: '1.25rem',
								pb: 1,
							}}
						>
							Amount
							{getSelectedCarrierDetails() && (
								<span style={{ fontSize: '0.75rem', color: '#999' }}>
									{' '}
									(Min: ₦{getSelectedCarrierDetails()?.minAmount}, Max: ₦
									{getSelectedCarrierDetails()?.maxAmount})
								</span>
							)}
						</Typography>
						<TextField
							fullWidth
							variant="outlined"
							value={amount}
							onChange={handleAmountChange}
							placeholder="Enter amount"
							error={!!getAmountErrorMessage()}
							helperText={getAmountErrorMessage()}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">₦</InputAdornment>
								),
								inputProps: {
									inputMode: 'numeric',
									pattern: '[0-9]*',
								},
							}}
						/>
					</Box>
				</Box>

				<Box>
					<Divider />
					<Box sx={{ mt: 2, mb: 1, display: 'flex', gap: '1rem' }}>
						<Button
							onClick={handleCancel}
							variant="outlined"
							sx={{
								px: 3,
								py: 1.5,
								color: '#353535',
								borderColor: '#353535',
								'&:hover': { borderColor: '#92A837' },
							}}
						>
							Cancel
						</Button>

						<Button
							onClick={handleOpenModal}
							variant="contained"
							disabled={!isFormValid()}
							sx={{
								px: 3,
								py: 1.5,
								backgroundColor: '#AAC645',
								color: '#ffffff',
								'&:hover': { backgroundColor: '#92A837' },
								'&:disabled': {
									backgroundColor: '#cccccc',
									color: '#666666',
								},
							}}
						>
							Proceed to payment
						</Button>
					</Box>
				</Box>
			</Box>

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
					<Success handleCloseModal={handleCloseModal} />
				) : paymentStatus === 'failed' ? (
					<Failed setPaymentStatus={setPaymentStatus} />
				) : currentStage === 'method-selection' ? (
					<>
						<MethodSelection
							paymentMethods={paymentMethods}
							handlePaymentMethodChange={handlePaymentMethodChange}
							handleCloseModal={handleCloseModal}
							handleProceedToCardDetails={handleProceedToCardDetails}
							handleInitiateTransferPayment={handleInitiateTransferPayment}
							handleInitiateUssdPayment={handleInitiateUssdPayment}
							paymentMethod={paymentMethod}
							handleSubmitPayment={handleSubmitPayment}
							amount={amount}
							setCurrentStage={setCurrentStage}
							serviceType="airtime"
							identifier={phoneNumber}
							selectedProvider={selectedCarrier}
							setUssdCode={setUssdCode}
						/>
					</>
				) : currentStage === 'card-details' ? (
					<>
						<CardPayment
							handleCloseModal={handleCloseModal}
							handleCardDetailChange={handleCardDetailChange}
							cardDetails={cardDetails}
							amount={amount}
							handleSubmitPayment={handleSubmitPayment}
							setCurrentStage={setCurrentStage}
						/>
					</>
				) : currentStage === 'transfer-display' && transferDetails ? (
					<>
						<BankTransfer
							handleCopyToClipboard={handleCopyToClipboard}
							transferDetails={transferDetails}
							setCurrentStage={setCurrentStage}
							handleConfirmTransferPayment={handleConfirmTransferPayment}
						/>
					</>
				) : currentStage === 'ussd-display' ? (
					<>
						<USSD
							handleCloseModal={handleCloseModal}
							handleCopyToClipboard={handleCopyToClipboard}
							setCurrentStage={setCurrentStage}
							ussdCode={ussdCode}
							timeLeft={timeLeft}
							setIsExpired={setIsExpired}
						/>
					</>
				) : null}
			</Dialog>
		</>
	);
};

export default AirtimeTransactions;
