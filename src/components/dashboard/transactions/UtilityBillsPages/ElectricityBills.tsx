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
import { stat } from 'fs';

interface Provider {
	id: number;
	name: string;
}

interface DiscoOption {
	name: string;
	value: number;
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

const ElectricityBills: React.FC = () => {
	const navigate = useNavigate();
	const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
		null
	);
	const [selectedDisco, setSelectedDisco] = useState<string>('');
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
		setSelectedProvider(JSON.parse(value));
	};

	const handleDiscoChange = (event: SelectChangeEvent<string>) => {
		setSelectedDisco(event.target.value as string);
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

	const handleOpenModal = () => {
		if (!selectedProvider || !meterNumber || !electricityAmount || !meterType) {
			setErrors({
				...(!selectedProvider && { provider: 'Provider is required' }),
				...(!meterNumber && { meterNumber: 'Meter number is required' }),
				...(!electricityAmount && { amount: 'Amount is required' }),
				...(!meterType && { meterType: 'Meter type is required' }),
			});
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
						distributionCompany: selectedDisco,
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
						distributionCompany: selectedDisco,
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
					distributionCompany: selectedDisco,
					subscriptionType: Number(meterType),
					serviceProviderName: selectedProvider?.name,
					description: 'electricity',
					state: 'abuja',
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

	// Data preparation
	const discos = AllEnumResponse?.[15]?.values || [];

	const prepaidProviderOptions =
		prepaidElectricBillersResponse?.data.map(
			(biller: { name: string; billerId: string }) => ({
				name: biller.name,
				id: biller.billerId,
			})
		) || [];

	const postpaidProviderOptions =
		postpaidElectricBillersResponse?.data.map(
			(biller: { name: string; billerId: string }) => ({
				name: biller.name,
				id: biller.billerId,
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

						{/* Distribution Company */}
						<Typography
							sx={{ fontSize: '0.88rem', color: '#636559', pt: 3, pb: 1 }}
						>
							Distribution Company
						</Typography>
						<Select
							fullWidth
							value={selectedDisco}
							onChange={handleDiscoChange}
							error={!!errors.selectedDisco}
						>
							<MenuItem
								value=""
								disabled
							>
								Select distribution company
							</MenuItem>
							{discos.map((option: DiscoOption) => (
								<MenuItem
									key={option.value}
									value={option.value}
								>
									{option.name}
								</MenuItem>
							))}
						</Select>

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
							onChange={e => setElectricityAmount(e.target.value)}
							placeholder="Enter amount"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">₦</InputAdornment>
								),
							}}
							error={!!errors.amount}
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
								!meterType
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
						identifier={meterNumber} // Smartcard number
						selectedProvider={selectedProvider?.name}
						amount={electricityAmount}
						setCurrentStage={setCurrentStage}
						setUssdCode={setUssdCode}
					/>
				) : null}
			</Dialog>

			<ToastContainer position="bottom-right" />
		</>
	);
};

export default ElectricityBills;
function makeTransferRequest(payload: {
	initialiseElectricityTransaction: {
		userId: any;
		transactionDetails: {
			meterNumber: string;
			amount: string;
			billerId: string;
			distributionCompany: string;
			subscriptionType: number;
			serviceProviderName: string | undefined;
			description: string;
		};
	};
}): [any, any] | PromiseLike<[any, any]> {
	throw new Error('Function not implemented.');
}
function makeUssdRequest(payload: {
	initialiseElectricityTransaction: {
		userId: any;
		bankCode: string;
		bankName: string;
		transactionDetails: {
			meterNumber: string;
			amount: string;
			billerId: string;
			distributionCompany: string;
			subscriptionType: number;
			serviceProviderName: string | undefined;
			description: string;
		};
	};
}): [any, any] | PromiseLike<[any, any]> {
	throw new Error('Function not implemented.');
}
