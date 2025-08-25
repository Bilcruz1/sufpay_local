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
	Tabs,
	Tab,
	Card,
	CardContent,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '../../../hooks/use-request';
import {
	initiateWalletData,
	getDataBillers,
	initiateCardData,
	initiateTransferData,
	initiateUssdData,
	getPhoneOperator,
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

interface DataVariation {
	billerVariationId: string;
	name: string;
	amount: number;
	days?: number; // Extracted from name
	category?: 'regular' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

interface DataBiller {
	billerId: string;
	name: string;
	operator: number;
	dataoperatorValue: string;
	minLocalTransactionAmount: number;
	maxLocalTransactionAmount: number;
	logoUrl: string;
	dataVariations: DataVariation[];
}

interface CarrierOption {
	value: string;
	label: string;
	logo: string;
	billerId: string;
	minAmount: number;
	maxAmount: number;
	dataVariations: DataVariation[];
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
}

interface CategorizedPlans {
	regular: DataVariation[];
	daily: DataVariation[];
	weekly: DataVariation[];
	monthly: DataVariation[];
	yearly: DataVariation[];
}

const DataTransactions: React.FC = () => {
	const navigate = useNavigate();
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [amount, setAmount] = useState<string>('');
	const [selectedCarrier, setSelectedCarrier] = useState<string>('');
	const [selectedPlan, setSelectedPlan] = useState<DataVariation | null>(null);
	const [carrierLogo, setCarrierLogo] = useState<string>('');
	const [carrierOptions, setCarrierOptions] = useState<CarrierOption[]>([]);
	const [categorizedPlans, setCategorizedPlans] = useState<CategorizedPlans>({
		regular: [],
		daily: [],
		weekly: [],
		monthly: [],
		yearly: [],
	});
	const [selectedCategory, setSelectedCategory] = useState<string>('regular');
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
	});
	const [forceProceed, setForceProceed] = useState(false);

	const { isLoading: isLoadingCarriers, makeRequest: makeDataCarrierRequest } =
		useRequest(getDataBillers);
	const { isLoading: isLoadingWallet, makeRequest: makeWalletRequest } =
		useRequest(initiateWalletData);
	const { isLoading: isLoadingPaystack, makeRequest: makePaystackRequest } =
		useRequest(initiateCardData);
	const { isLoading: isLoadingTransfer, makeRequest: makeTransferRequest } =
		useRequest(initiateTransferData);
	const { isLoading: isLoadingUssd, makeRequest: makeUssdRequest } =
		useRequest(initiateUssdData);
	const { isLoading: isLoadingValidation, makeRequest: makeValidationRequest } =
		useRequest(getPhoneOperator);

	// Logo mapping functions
	const getCarrierLogo = (name: string): string => {
		const logoMap: { [key: string]: string } = {
			'9mobile Data': mobile9Logo,
			'MTN Data': mtnLogo,
			'Glo Data': gloLogo,
			'Airtel Data': airtelLogo,
		};
		return logoMap[name] || mobile9Logo;
	};

	const getCarrierLabel = (name: string): string => {
		const labelMap: { [key: string]: string } = {
			'9mobile Data': '9MOBILE',
			'MTN Data': 'MTN',
			'Glo Data': 'GLO',
			'Airtel Data': 'AIRTEL',
		};
		return labelMap[name] || name;
	};

	// Function to extract days from plan name and categorize
	const extractDaysAndCategorize = (
		planName: string
	): {
		days: number;
		category: 'regular' | 'daily' | 'weekly' | 'monthly' | 'yearly';
	} => {
		const lowerName = planName.toLowerCase();

		// Extract days from the plan name
		const dayMatch = lowerName.match(/(\d+)\s*day[s]?/);
		let days = 0;

		if (dayMatch) {
			days = parseInt(dayMatch[1]);
		}

		// Categorize based on days
		if (days === 1) {
			return { days, category: 'daily' };
		} else if (days >= 2 && days <= 7) {
			return { days, category: 'weekly' };
		} else if (days >= 8 && days <= 31) {
			return { days, category: 'monthly' };
		} else if (days >= 32 && days <= 90) {
			return { days, category: 'monthly' }; // Treat 90-day plans as monthly
		} else if (days >= 180 && days <= 365) {
			return { days, category: 'yearly' };
		} else {
			// Default categorization for plans without clear day indication
			return { days, category: 'regular' };
		}
	};

	// Function to categorize data variations
	const categorizeDataVariations = (
		variations: DataVariation[]
	): CategorizedPlans => {
		const categorized: CategorizedPlans = {
			regular: [],
			daily: [],
			weekly: [],
			monthly: [],
			yearly: [],
		};

		variations.forEach(variation => {
			const { days, category } = extractDaysAndCategorize(variation.name);
			const enhancedVariation = { ...variation, days, category };
			categorized[category].push(enhancedVariation);
		});

		// Sort each category by amount
		Object.keys(categorized).forEach(key => {
			categorized[key as keyof CategorizedPlans].sort(
				(a, b) => a.amount - b.amount
			);
		});

		return categorized;
	};

	const fetchDataBillers = async () => {
		try {
			const [apiResponse, error] = await makeDataCarrierRequest({});

			if (error) {
				console.error('Error fetching data billers:', error);
				// Fallback to default carriers with empty variations
				setCarrierOptions([
					{
						value: '9mobile Data',
						label: '9MOBILE',
						logo: mobile9Logo,
						billerId: 'etisalat-data',
						minAmount: 1,
						maxAmount: 1000000,
						dataVariations: [],
					},
				]);
				return;
			}

			if (apiResponse?.data) {
				const transformedCarriers: CarrierOption[] = apiResponse.data.map(
					(biller: DataBiller) => ({
						value: biller.name,
						label: getCarrierLabel(biller.name),
						logo: getCarrierLogo(biller.name),
						billerId: biller.billerId,
						minAmount: biller.minLocalTransactionAmount,
						maxAmount: biller.maxLocalTransactionAmount,
						dataVariations: biller.dataVariations || [],
					})
				);

				setCarrierOptions(transformedCarriers);

				// Check if there's a previously selected carrier in sessionStorage
				const savedCarrier = sessionStorage.getItem('selectedDataCarrier');
				let carrierToSelect = transformedCarriers[0]; // Default to first carrier

				if (savedCarrier) {
					const foundCarrier = transformedCarriers.find(
						c => c.value === savedCarrier
					);
					if (foundCarrier) {
						carrierToSelect = foundCarrier;
					}
					// Clear the saved carrier after using it
					sessionStorage.removeItem('selectedDataCarrier');
				}

				if (carrierToSelect) {
					setSelectedCarrier(carrierToSelect.value);
					setCarrierLogo(carrierToSelect.logo);

					// Categorize plans for the selected carrier
					const categorized = categorizeDataVariations(
						carrierToSelect.dataVariations
					);
					setCategorizedPlans(categorized);

					// Set to first category that has plans
					const firstCategory =
						['regular', 'daily', 'weekly', 'monthly', 'yearly'].find(
							cat => categorized[cat as keyof CategorizedPlans].length > 0
						) || 'regular';
					setSelectedCategory(firstCategory);
				}
			}
		} catch (error) {
			console.error('Error in fetchDataBillers:', error);
		}
	};

	// Validate phone number against selected carrier
	const validatePhoneNumber = async (phone: string, carrier: string) => {
		if (!phone || !carrier) {
			setPhoneValidation({ isValid: false, isLoading: false, error: '' });
			return;
		}

		// Check if phone is in correct format
		if (!phone.startsWith('+234') && !phone.startsWith('234')) {
			setPhoneValidation({
				isValid: false,
				isLoading: false,
				error: 'Phone number must start with +234 or 234',
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
				});
				return;
			}

			const operator = response.data?.name?.toLowerCase() || '';
			const selectedCarrierName = carrier.toLowerCase().replace(' data', '');

			// Check if the detected operator matches the selected carrier
			const isValid =
				operator &&
				(operator.includes(selectedCarrierName) ||
					selectedCarrierName.includes(operator));

			setPhoneValidation({
				isValid: !!isValid,
				isLoading: false,
				error: isValid
					? ''
					: `Phone number appears to be from a different network. Expected: ${carrier}, Detected: ${
							operator || 'Unknown'
					  }`,
			});
		} catch (error) {
			console.error('Phone validation error:', error);
			setPhoneValidation({
				isValid: false,
				isLoading: false,
				error: 'Validation failed. Please try again.',
			});
		}
	};

	useEffect(() => {
		fetchDataBillers();
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

	// Validate phone number when phone or carrier changes
	useEffect(() => {
		if (phoneNumber && selectedCarrier) {
			const timeoutId = setTimeout(() => {
				validatePhoneNumber(phoneNumber, selectedCarrier);
			}, 800);

			return () => clearTimeout(timeoutId);
		} else {
			setPhoneValidation({ isValid: false, isLoading: false, error: '' });
		}
	}, [phoneNumber, selectedCarrier]);

	const handleCarrierChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value;

		// Store the selected carrier in sessionStorage before refresh
		sessionStorage.setItem('selectedDataCarrier', value);

		// Refresh the page to ensure proper data categorization
		window.location.reload();
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
		setPhoneNumber('');
		setSelectedPlan(null);
		navigate(-1);
	};

	const handleOpenModal = () => {
		if (!phoneNumber || !selectedCarrier || !selectedPlan) return;

		// Check if phone number validation failed and user hasn't chosen to proceed anyway
		if (phoneValidation.error && !phoneValidation.isValid && !forceProceed) {
			return;
		}

		setOpenModal(true);
		setCurrentStage('method-selection');
		setPaymentStatus('idle');
	};

	const handleForceProceed = () => {
		setForceProceed(true);
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
		setForceProceed(false);
	};

	const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
		setPaymentMethod(event.target.value);
	};

	const handleProceedToCardDetails = () => {
		setCurrentStage('card-details');
	};

	const handleCategoryChange = (
		event: React.SyntheticEvent,
		newValue: string
	) => {
		setSelectedCategory(newValue);
		setSelectedPlan(null); // Reset selected plan when category changes
	};

	const handlePlanSelect = (plan: DataVariation) => {
		setSelectedPlan(plan);
	};

	const formatPlanName = (name: string) => {
		// Extract key information from plan name
		const parts = name.split(' - ');
		if (parts.length >= 3) {
			const size = parts[1]; // e.g., "650MB", "1.5GB"
			const duration = parts[2]; // e.g., "1 day", "30 days"
			return `${size} - ${duration}`;
		}
		return name;
	};
	const handleConfirmTransferPayment = () => {
		setPaymentStatus('processing');
		setTimeout(() => {
			setPaymentStatus('success');
			setTimeout(handleCloseModal, 2000);
		}, 1500);
	};
	const handleInitiateTransferPayment = async () => {
		setPaymentStatus('processing');
		if (!selectedPlan) return;
		try {
			const carrier = carrierOptions.find(c => c.value === selectedCarrier);
			if (!carrier) throw new Error('Invalid carrier selected');

			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) throw new Error('User profile not found');
			const userProfile = JSON.parse(userProfileItem);

			const payload = {
				InitialiseDataTransaction: {
					userId: userProfile.userId,
					transactionDetails: {
						phoneNumber,
						amount: selectedPlan.amount,
						billerId: carrier.billerId,
						DataBundle: selectedPlan.billerVariationId,
						networkProviderName: selectedCarrier,
						ServiceProviderName: selectedCarrier,
						description: 'data',
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
		if (!selectedPlan) return;
		try {
			const carrier = carrierOptions.find(c => c.value === selectedCarrier);
			if (!carrier) throw new Error('Invalid carrier selected');

			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) throw new Error('User profile not found');
			const userProfile = JSON.parse(userProfileItem);

			const payload = {
				AccountBank: selectedBank.code,
				InitialiseDataTransaction: {
					userId: userProfile.userId,
					transactionDetails: {
						phoneNumber,
						amount: selectedPlan.amount,
						billerId: carrier.billerId,
						DataBundle: selectedPlan.billerVariationId,
						networkProviderName: selectedCarrier,
						ServiceProviderName: selectedCarrier,
						description: 'data',
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

	const handleSubmitPayment = async () => {
		if (!selectedPlan) return;

		// Validate phone number before proceeding
		if (phoneValidation.error && !phoneValidation.isValid && !forceProceed) {
			setPaymentStatus('failed');
			return;
		}

		setPaymentStatus('processing');

		try {
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
					amount: selectedPlan.amount,
					billerId: carrier.billerId,
					DataBundle: selectedPlan.billerVariationId,
					networkProviderName: selectedCarrier,
					ServiceProviderName: selectedCarrier,
					description: 'data',
				},
			};

			// Handle each payment method differently
			switch (paymentMethod) {
				case 'wallet':
					const walletPayload = {
						...commonPayload,
						walletIdentifier: userProfile.wallet?.walletIdentifier,
						networkProviderName: selectedCarrier,
						ServiceProviderName: selectedCarrier,
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
						initialiseDataTransaction: commonPayload,
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
						window.location.href = cardResponse.data.authUrl;
					} else {
						setPaymentStatus('success');
					}
					break;

				case 'transfer':
					const [transferResponse, transferError] = await makeTransferRequest(
						commonPayload
					);
					if (transferError) throw transferError;

					const transferDetails = {
						accountNumber:
							transferResponse.data.accountNumber || 'Not available',
						bankName: transferResponse.data.bankName || 'Not specified',
						accountName: transferResponse.data.accountName || 'Not available',
						amount:
							transferResponse.data.amount || selectedPlan.amount.toString(),
						reference: transferResponse.data.reference || 'Use your user ID',
						expiration: transferResponse.data.expiration || 300,
					};

					setTransferDetails(transferDetails);
					setTimeLeft(transferDetails.expiration);
					setIsExpired(false);
					setCurrentStage('transfer-display');
					break;

				case 'ussd':
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

	return (
		<>
			{/* Main Form */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					height: '85vh',
					width: '100%',
					gap: '2rem',
				}}
			>
				<Box>
					<Typography
						sx={{ fontSize: '1.25rem', color: '#636559', fontWeight: 'medium' }}
					>
						Data Purchase
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
							sx={{ width: { xs: '100%', lg: '40%' } }}
							variant="outlined"
							value={phoneNumber}
							onChange={handlePhoneNumberChange}
							placeholder="Enter phone number"
							error={!!phoneValidation.error && !forceProceed}
							helperText={
								phoneValidation.error && !forceProceed
									? phoneValidation.error
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
								) : phoneNumber && selectedCarrier ? (
									<InputAdornment position="end">
										{phoneValidation.isValid ? (
											<CheckCircleIcon color="success" />
										) : (
											<ErrorIcon color="error" />
										)}
									</InputAdornment>
								) : null,
								inputProps: {
									maxLength: 14,
									pattern: '^\\+?234\\d{10}$',
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
						<FormControl sx={{ width: { xs: '100%', lg: '40%' } }}>
							<Select
								value={selectedCarrier}
								onChange={handleCarrierChange}
								IconComponent={ArrowDropDownIcon}
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
							Select Data Plan
						</Typography>

						{/* Category Tabs */}
						<Tabs
							value={selectedCategory}
							onChange={handleCategoryChange}
							variant="scrollable"
							scrollButtons="auto"
							sx={{ mb: 2 }}
						>
							{Object.entries(categorizedPlans).map(
								([category, plans]) =>
									plans.length > 0 && (
										<Tab
											key={category}
											value={category}
											label={category.toUpperCase()}
										/>
									)
							)}
						</Tabs>
						{/* Selected Plan Display */}
						{selectedPlan && (
							<Box
								mt={2}
								mb={3}
								p={2}
								sx={{
									backgroundColor: '#f5f5f5',
									borderRadius: 1,
									border: '1px solid #AAC645',
									width: { xs: '100%', lg: '40%' },
								}}
							>
								<Typography
									variant="body2"
									color="primary"
								>
									Selected Plan:
								</Typography>
								<Typography
									variant="body1"
									fontWeight="medium"
								>
									{selectedPlan.name}
								</Typography>
								<Typography
									variant="h6"
									color="#AAC645"
								>
									₦{selectedPlan.amount.toLocaleString()}
								</Typography>
							</Box>
						)}

						{/* Plan Cards */}
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: {
									xs: 'repeat(3, 1fr)',
									sm: 'repeat(3, 1fr)',
									md: 'repeat(3, 1fr)',
									lg: 'repeat(6, 1fr)',
								},
								gap: 2,
								marginRight: { xs: 0, lg: '3rem' },
							}}
						>
							{categorizedPlans[selectedCategory as keyof CategorizedPlans].map(
								plan => (
									<Card
										key={plan.billerVariationId}
										sx={{
											cursor: 'pointer',
											border:
												selectedPlan?.billerVariationId ===
												plan.billerVariationId
													? '2px solid #AAC645'
													: '1px solid #e0e0e0',
											'&:hover': { borderColor: '#AAC645' },
										}}
										onClick={() => handlePlanSelect(plan)}
									>
										<CardContent sx={{ p: 2 }}>
											<Typography
												variant="h6"
												sx={{ fontSize: '1rem', mb: 1 }}
											>
												{formatPlanName(plan.name)}
											</Typography>
											<Typography
												variant="h5"
												sx={{
													color: '#AAC645',
													fontWeight: 'bold',
													fontSize: '1.2rem',
												}}
											>
												₦{plan.amount.toLocaleString()}
											</Typography>
											{plan.days !== null &&
												plan.days !== undefined &&
												plan.days !== 0 && (
													<Typography
														variant="body2"
														color="text.secondary"
													>
														{plan.days} day{plan.days > 1 ? 's' : ''}
													</Typography>
												)}
										</CardContent>
									</Card>
								)
							)}
						</Box>
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
							onClick={
								phoneValidation.error &&
								!phoneValidation.isValid &&
								!forceProceed
									? handleForceProceed
									: handleOpenModal
							}
							variant="contained"
							disabled={!phoneNumber || !selectedCarrier || !selectedPlan}
							sx={{
								px: 3,
								py: 1.5,
								backgroundColor: '#AAC645',
								color: '#ffffff',
								'&:hover': { backgroundColor: '#92A837' },
							}}
						>
							{phoneValidation.error &&
							!phoneValidation.isValid &&
							!forceProceed
								? 'Proceed Anyway'
								: 'Proceed to payment'}
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
					<MethodSelection
						paymentMethods={paymentMethods}
						handlePaymentMethodChange={handlePaymentMethodChange}
						handleCloseModal={handleCloseModal}
						handleProceedToCardDetails={handleProceedToCardDetails}
						handleInitiateTransferPayment={handleInitiateTransferPayment}
						handleInitiateUssdPayment={handleInitiateUssdPayment}
						paymentMethod={paymentMethod}
						handleSubmitPayment={handleSubmitPayment}
						amount={selectedPlan?.amount.toString() || '0'}
						setCurrentStage={setCurrentStage}
						serviceType="data"
						identifier={phoneNumber}
						selectedProvider={selectedCarrier}
						setUssdCode={setUssdCode}
					/>
				) : currentStage === 'card-details' ? (
					<CardPayment
						handleCloseModal={handleCloseModal}
						handleCardDetailChange={handleCardDetailChange}
						cardDetails={cardDetails}
						amount={selectedPlan?.amount.toString() || '0'}
						handleSubmitPayment={handleSubmitPayment}
						setCurrentStage={setCurrentStage}
					/>
				) : currentStage === 'transfer-display' && transferDetails ? (
					<BankTransfer
						handleCopyToClipboard={(text: string) =>
							navigator.clipboard.writeText(text)
						}
						transferDetails={transferDetails}
						setCurrentStage={setCurrentStage}
						handleConfirmTransferPayment={handleConfirmTransferPayment}
					/>
				) : currentStage === 'ussd-display' ? (
					<USSD
						handleCloseModal={handleCloseModal}
						handleCopyToClipboard={(text: string) =>
							navigator.clipboard.writeText(text)
						}
						setCurrentStage={setCurrentStage}
						ussdCode={ussdCode}
						timeLeft={timeLeft}
						setIsExpired={setIsExpired}
					/>
				) : null}
			</Dialog>
		</>
	);
};

export default DataTransactions;
