import React, { useState, useEffect } from 'react';
import {
	TextField,
	MenuItem,
	Typography,
	Button,
	Dialog,
	DialogContent,
	Divider,
	Select,
	Box,
	CircularProgress,
	IconButton,
	InputAdornment,
	SelectChangeEvent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '../../../../hooks/use-request';
import { useFetcher } from '../../../../hooks/use-fetcher';
import {
	fetchEnums,
	fetchprepaidElectricBillers,
	fetchpostpaidElectricBillers,
	initiateCardElectricity,
	initiateWalletElectricity,
	initiateTransferElectricity,
	initiateUssdElectricity,
} from '../../../../Apis/card-payment';
import { toast, ToastContainer } from 'react-toastify';
import USSD from '../../../payments/ussd';
import BankTransfer from '../../../payments/bankTransfer';
import CardPayment from '../../../payments/cardPayment';
import MethodSelection from '../../../payments/methodSelection';
import Processing from '../../../payments/processing';
import Success from '../../../payments/success';
import Failed from '../../../payments/failed';
import PasskeyModal from '../../../payments/passkeyModal';

interface Provider {
	id: number;
	name: string;
	discos: any; // This could be an array or a number
	minLocalTransactionAmount: number;
	maxLocalTransactionAmount: number;
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

interface PasskeyState {
	isSet: boolean;
	checked: boolean;
	modalOpen: boolean;
	value: string;
	error: string;
	loading: boolean;
}

const ElectricityBills: React.FC = () => {
	const navigate = useNavigate();
	const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
		null
	);
	const [electricityAmount, setElectricityAmount] = useState<string>('');
	const [meterType, setMeterType] = useState<string>('');
	const [meterNumber, setMeterNumber] = useState<string>('');
	const [openModal, setOpenModal] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState<string>('wallet');
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Payment flow states
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
	const [passkeyState, setPasskeyState] = useState<PasskeyState>({
		isSet: false,
		checked: false,
		modalOpen: false,
		value: '',
		error: '',
		loading: false,
	});

	// Fetch data hooks
	const { response: AllEnumResponse, makeRequest: makeAllEnumRequest } =
		useFetcher(fetchEnums);

	const {
		response: prepaidElectricBillersResponse,
		makeRequest: makeprepaidElectricBillersRequest,
	} = useFetcher(fetchprepaidElectricBillers);

	const {
		response: postpaidElectricBillersResponse,
		makeRequest: makepostpaidElectricBillersRequest,
	} = useFetcher(fetchpostpaidElectricBillers);

	const { makeRequest: makeWalletRequest } = useRequest(
		initiateWalletElectricity
	);

	const { makeRequest: makecardRequest } = useRequest(initiateCardElectricity);

	const { makeRequest: makeTransferRequest } = useRequest(
		initiateTransferElectricity
	);

	const { makeRequest: makeUssdRequest } = useRequest(initiateUssdElectricity);

	// Check passkey status from localStorage
	const checkPasskeySet = async () => {
		try {
			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) {
				console.error('User profile not found in localStorage');
				setPasskeyState(prev => ({
					...prev,
					isSet: false,
					checked: true,
				}));
				return;
			}

			const userProfile = JSON.parse(userProfileItem);

			// Check if wallet and passPinIsSet exist in user profile
			if (!userProfile.wallet) {
				console.error('Wallet not found in user profile');
				setPasskeyState(prev => ({
					...prev,
					isSet: false,
					checked: true,
				}));
				return;
			}

			// Get passPinIsSet directly from localStorage user profile
			const isPasskeySet = userProfile.wallet.passPinIsSet || false;

			setPasskeyState(prev => ({
				...prev,
				isSet: isPasskeySet,
				checked: true,
			}));

			console.log('Passkey status from localStorage:', isPasskeySet);
		} catch (error) {
			console.error('Error in checkPasskeySet:', error);
			// Set as checked even if there's an error to avoid infinite loading
			setPasskeyState(prev => ({
				...prev,
				isSet: false,
				checked: true,
			}));
		}
	};

	// Fetch data on mount
	useEffect(() => {
		makeAllEnumRequest();
	}, []);

	useEffect(() => {
		if (meterType === '0') {
			makeprepaidElectricBillersRequest();
		} else if (meterType === '1') {
			makepostpaidElectricBillersRequest();
		}
	}, [meterType]);

	// Timer effect
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

	// Handler functions
	const handleProviderChange = (value: string) => {
		const provider = JSON.parse(value);
		setSelectedProvider(provider);
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
		setElectricityAmount(value);

		// Validate amount against provider limits
		if (selectedProvider && value) {
			const amount = parseFloat(value);
			const min = selectedProvider.minLocalTransactionAmount;
			const max = selectedProvider.maxLocalTransactionAmount;

			if (amount < min) {
				setErrors(prev => ({
					...prev,
					amount: `Amount must be at least ₦${min}`,
				}));
			} else if (amount > max) {
				setErrors(prev => ({
					...prev,
					amount: `Amount cannot exceed ₦${max}`,
				}));
			} else {
				setErrors(prev => ({ ...prev, amount: '' }));
			}
		}
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

	const handleOpenModal = async () => {
		console.log('Opening modal with:', {
			selectedProvider,
			meterNumber,
			electricityAmount,
			meterType,
			errors,
		});

		const newErrors: Record<string, string> = {};

		if (!selectedProvider) newErrors.provider = 'Provider is required';
		if (!meterNumber) newErrors.meterNumber = 'Meter number is required';
		if (!electricityAmount) newErrors.amount = 'Amount is required';
		if (!meterType) newErrors.meterType = 'Meter type is required';

		// Validate amount against provider limits
		if (selectedProvider && electricityAmount) {
			const amount = parseFloat(electricityAmount);
			const min = selectedProvider.minLocalTransactionAmount;
			const max = selectedProvider.maxLocalTransactionAmount;

			if (amount < min) {
				newErrors.amount = `Amount must be at least ₦${min}`;
			} else if (amount > max) {
				newErrors.amount = `Amount cannot exceed ₦${max}`;
			}
		}

		console.log('Validation errors:', newErrors);

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		// Check if passkey is set before opening the modal
		setPaymentStatus('processing');
		try {
			await checkPasskeySet();
			setOpenModal(true);
			setCurrentStage('method-selection');
			setPaymentStatus('idle');
		} catch (error) {
			console.error('Error checking passkey:', error);
			setPaymentStatus('idle');
		}
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
		setElectricityAmount('');
		setMeterNumber('');
		setSelectedProvider(null);
		setMeterType('');
		setErrors({});
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

	const handleInitiateTransferPayment = async () => {
		setPaymentStatus('processing');
		try {
			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) throw new Error('User profile not found');
			const userProfile = JSON.parse(userProfileItem);

			const payload = {
				InitialiseElectricityBill: {
					userId: userProfile.userId,
					transactionDetails: {
						meterNumber,
						amount: electricityAmount,
						billerId: String(selectedProvider?.id),
						distributionCompany: selectedProvider?.discos,
						subscriptionType: Number(meterType),
						serviceProviderName: selectedProvider?.name,
						description: 'electricity',
						state: 'abuja',
					},
				},
			};

			const [response, error] = await makeTransferRequest(payload);
			if (error) throw error;

			const transferDetails = {
				accountNumber: response.data.accountNumber || 'Not available',
				bankName: response.data.bankName || 'Not specified',
				accountName: response.data.accountName || 'Not available',
				amount: response.data.amount || electricityAmount,
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
				InitialiseElectricityBill: {
					userId: userProfile.userId,
					transactionDetails: {
						meterNumber,
						amount: electricityAmount,
						billerId: String(selectedProvider?.id),
						distributionCompany: selectedProvider?.discos,
						subscriptionType: Number(meterType),
						serviceProviderName: selectedProvider?.name,
						description: 'electricity',
						state: 'abuja',
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

	const handleWalletPayment = async () => {
		// Check passkey status from localStorage first
		if (!passkeyState.checked) {
			await checkPasskeySet();
		}

		// If passkey is not set, show modal to prompt user to set it
		if (!passkeyState.isSet) {
			setPasskeyState(prev => ({
				...prev,
				modalOpen: true,
				error:
					'You need to set up your wallet PIN before making payments. Please set your PIN first.',
			}));
			return;
		}

		// If passkey is set, proceed to show the passkey input modal
		setPasskeyState(prev => ({
			...prev,
			modalOpen: true,
			error: '',
			value: '',
		}));
	};

	const handlePasskeySubmit = async (passkey: string) => {
		setPasskeyState(prev => ({ ...prev, loading: true, error: '' }));

		try {
			// Validate required fields
			if (!selectedProvider || !meterNumber || !electricityAmount) {
				throw new Error('Please fill all required fields');
			}

			// Get user profile
			const userProfileItem = localStorage.getItem('userProfile');
			if (!userProfileItem) throw new Error('User profile not found');
			const userProfile = JSON.parse(userProfileItem);

			// Wallet payment payload with passkey
			const walletPayload = {
				userId: userProfile.userId,
				transactionDetails: {
					meterNumber,
					amount: electricityAmount,
					billerId: String(selectedProvider.id),
					distributionCompany: selectedProvider.discos,
					subscriptionType: Number(meterType),
					serviceProviderName: selectedProvider.name,
					description: 'electricity',
					state: 'abuja',
				},
				walletIdentifier: userProfile.wallet?.walletIdentifier,
				passKey: passkey,
			};

			const [walletResponse, walletError] = await makeWalletRequest(
				walletPayload
			);
			if (walletError) throw walletError;

			setPaymentStatus('success');
			setPasskeyState(prev => ({
				...prev,
				modalOpen: false,
				loading: false,
				value: '',
			}));
		} catch (error) {
			console.error('Payment failed:', error);
			setPasskeyState(prev => ({
				...prev,
				error: 'Invalid passkey or payment failed',
				loading: false,
			}));
		}
	};

	const handlePasskeyClose = () => {
		setPasskeyState(prev => ({
			...prev,
			modalOpen: false,
			value: '',
			error: '',
		}));
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
					meterNumber,
					amount: electricityAmount,
					billerId: String(selectedProvider?.id),
					distributionCompany: selectedProvider?.discos,
					subscriptionType: Number(meterType),
					serviceProviderName: selectedProvider?.name,
					description: 'electricity',
					state: 'abuja',
				},
			};

			switch (paymentMethod) {
				case 'wallet':
					// Check if passkey is set from localStorage
					if (!passkeyState.checked) {
						await checkPasskeySet();
					}

					// If passkey is not set, show error and prompt to set it
					if (!passkeyState.isSet) {
						setPaymentStatus('failed');
						setPasskeyState(prev => ({
							...prev,
							modalOpen: true,
							error:
								'Please set up your wallet PIN first to use wallet payments.',
						}));
						return;
					}

					// If passkey is set, open passkey input modal
					setPaymentStatus('idle');
					setPasskeyState(prev => ({
						...prev,
						modalOpen: true,
						error: '',
						value: '',
					}));
					break;

				case 'card':
					const cardPayload = {
						InitialiseElectricityBill: commonPayload,
						cardNumber: cardDetails.number,
						expiryMonth: cardDetails.expiryMonth,
						expiryYear: cardDetails.expiryYear,
						cvv: cardDetails.cvv,
						redirectUrl: `${window.location.origin}/dashboard`,
					};
					const [cardResponse, cardError] = await makecardRequest(cardPayload);
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
					break;

				default:
					throw new Error('Invalid payment method selected');
			}
		} catch (error) {
			console.error('Payment failed:', error);
			setPaymentStatus('failed');
		}
	};

	const prepaidProviderOptions =
		prepaidElectricBillersResponse?.data
			.filter(
				(biller: {
					name: string;
					billerId: string;
					discos: any;
					minLocalTransactionAmount: number;
					maxLocalTransactionAmount: number;
				}) => biller.discos !== 0
			)
			.map(
				(biller: {
					name: string;
					billerId: string;
					discos: any;
					minLocalTransactionAmount: number;
					maxLocalTransactionAmount: number;
				}) => ({
					name: biller.name,
					id: biller.billerId,
					discos: biller.discos,
					minLocalTransactionAmount: biller.minLocalTransactionAmount,
					maxLocalTransactionAmount: biller.maxLocalTransactionAmount,
				})
			) || [];

	const postpaidProviderOptions =
		postpaidElectricBillersResponse?.data
			.filter(
				(biller: {
					name: string;
					billerId: string;
					discos: any;
					minLocalTransactionAmount: number;
					maxLocalTransactionAmount: number;
				}) => biller.discos !== 0
			)
			.map(
				(biller: {
					name: string;
					billerId: string;
					discos: any;
					minLocalTransactionAmount: number;
					maxLocalTransactionAmount: number;
				}) => ({
					name: biller.name,
					id: biller.billerId,
					discos: biller.discos,
					minLocalTransactionAmount: biller.minLocalTransactionAmount,
					maxLocalTransactionAmount: biller.maxLocalTransactionAmount,
				})
			) || [];

	const providerOptions =
		meterType === '0' ? prepaidProviderOptions : postpaidProviderOptions;

	const paymentMethods = [
		{ id: 'wallet', label: 'Pay with Wallet' },
		{ id: 'card', label: 'Pay with Card' },
		{ id: 'transfer', label: 'Pay with Bank Transfer' },
		{ id: 'ussd', label: 'Pay with USSD' },
	];

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					height: '85vh',
					width: { xs: '100%', md: '45%' },
					gap: '2rem',
				}}
			>
				{/* Form Section */}
				<Box>
					<Typography
						sx={{ fontSize: '1.25rem', color: '#636559', fontWeight: 'medium' }}
					>
						Electricity
					</Typography>

					<Box mt={3}>
						{/* Meter Type */}
						<Typography sx={{ fontSize: '0.88rem', color: '#636559', pb: 1 }}>
							Meter Type
						</Typography>
						<Select
							fullWidth
							value={meterType}
							onChange={e => setMeterType(e.target.value)}
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

						{/* Provider */}
						<Typography
							sx={{ fontSize: '0.88rem', color: '#636559', pt: 3, pb: 1 }}
						>
							Provider
						</Typography>
						<Select
							fullWidth
							value={selectedProvider ? JSON.stringify(selectedProvider) : ''}
							onChange={e => handleProviderChange(e.target.value)}
							disabled={!meterType}
							error={!!errors.provider}
						>
							<MenuItem
								value=""
								disabled
							>
								{meterType ? 'Select a  provider' : 'Choose a meter type first'}
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

						{/* Meter Number */}
						<Typography
							sx={{ fontSize: '0.88rem', color: '#636559', pt: 3, pb: 1 }}
						>
							Meter Number
						</Typography>
						<TextField
							fullWidth
							variant="outlined"
							value={meterNumber}
							onChange={e => setMeterNumber(e.target.value)}
							placeholder="Enter meter number"
							error={!!errors.meterNumber}
						/>
						{errors.meterNumber && (
							<Typography
								color="error"
								sx={{ fontSize: '0.8rem' }}
							>
								{errors.meterNumber}
							</Typography>
						)}

						{/* Amount */}
						<Typography
							sx={{ fontSize: '0.88rem', color: '#636559', pt: 3, pb: 1 }}
						>
							Amount
						</Typography>
						<TextField
							fullWidth
							variant="outlined"
							value={electricityAmount}
							onChange={handleAmountChange}
							placeholder="Enter amount"
							type="text"
							inputMode="numeric"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">₦</InputAdornment>
								),
							}}
							error={!!errors.amount}
							helperText={
								selectedProvider &&
								`Min: ₦${selectedProvider.minLocalTransactionAmount.toLocaleString()}, Max: ₦${selectedProvider.maxLocalTransactionAmount.toLocaleString()}`
							}
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

				{/* Action Buttons */}
				<Box>
					<Divider />
					<Box sx={{ mt: 2, mb: 1, display: 'flex', gap: '1rem' }}>
						<Button
							onClick={() => navigate(-1)}
							variant="outlined"
							sx={{ px: 3, py: 1.5, color: 'black' }}
						>
							Cancel
						</Button>
						<Button
							onClick={handleOpenModal}
							variant="contained"
							disabled={
								!selectedProvider ||
								!meterNumber ||
								!electricityAmount ||
								!meterType ||
								!!errors.amount
							}
							sx={{
								px: 3,
								py: 1.5,
								backgroundColor: '#AAC645',
								color: '#ffffff',
								'&:hover': { backgroundColor: '#92A837' },
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
						amount={electricityAmount}
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
						serviceType="electricity"
						identifier={meterNumber}
						selectedProvider={selectedProvider?.name}
						amount={electricityAmount}
						setCurrentStage={setCurrentStage}
						setUssdCode={setUssdCode}
						passkeyState={passkeyState}
						checkPasskeySet={checkPasskeySet}
						handleWalletPayment={handleWalletPayment}
					/>
				) : null}
			</Dialog>

			{/* Passkey Modal */}
			<PasskeyModal
				open={passkeyState.modalOpen}
				onClose={handlePasskeyClose}
				onSubmit={handlePasskeySubmit}
				error={passkeyState.error}
				loading={passkeyState.loading}
			/>

			<ToastContainer position="bottom-right" />
		</>
	);
};

export default ElectricityBills;
