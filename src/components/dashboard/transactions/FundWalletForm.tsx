import React, { useEffect, useState } from 'react';
import {
	TextField,
	Button,
	Dialog,
	Divider,
	Box,
	Typography,
	InputAdornment,
	CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '../../../hooks/use-request';
import {
	getTransactionFee,
	fundWalletWithCard,
	fundWalletByTransfer,
} from '../../../Apis/card-payment';
import USSD from '../../payments/ussd';
import BankTransfer from '../../payments/bankTransfer';
import CardPayment from '../../payments/cardPayment';
import Failed from '../../payments/failed';
import Success from '../../payments/success';
import Processing from '../../payments/processing';
import MethodSelection from '../../payments/methodSelection';

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

const FundWalletForm: React.FC = () => {
	const navigate = useNavigate();
	const [amount, setAmount] = useState<string>('');
	const [originalAmount, setOriginalAmount] = useState<string>(''); // Track user input
	const [transactionFee, setTransactionFee] = useState<number>(0);
	const [totalAmount, setTotalAmount] = useState<string>(''); // Amount + fee
	const [isFetchingFee, setIsFetchingFee] = useState<boolean>(false);
	const [openModal, setOpenModal] = useState(false);
	const [timeLeft, setTimeLeft] = useState<number | null>(null);
	const [isExpired, setIsExpired] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState<string>('card');
	const [cardDetails, setCardDetails] = useState<CardDetails>({
		number: '',
		expiryMonth: '',
		expiryYear: '',
		cvv: '',
	});
	const [transferDetails, setTransferDetails] =
		useState<TransferDetails | null>(null);
	const [ussdCode, setUssdCode] = useState<string>('');
	const [paymentStatus, setPaymentStatus] = useState<
		'idle' | 'processing' | 'success' | 'failed'
	>('idle');
	const [currentStage, setCurrentStage] = useState<
		'method-selection' | 'card-details' | 'transfer-display' | 'ussd-display'
	>('method-selection');

	const {
		isLoading: isLoadingFundWalletByTransfer,
		makeRequest: makeRequestFundWalletByTransfer,
	} = useRequest(fundWalletByTransfer);
	const {
		isLoading: isLoadingFundWalletWithCard,
		makeRequest: makeRequestFundWalletWithCard,
	} = useRequest(fundWalletWithCard);
	const {
		isLoading: isLoadingGetTransactionFee,
		makeRequest: makeRequestGetTransactionFee,
	} = useRequest(getTransactionFee);

	const paymentMethods = [
		{ id: 'card', label: 'Pay with Card' },
		{ id: 'transfer', label: 'Pay with Bank Transfer' },
		{ id: 'ussd', label: 'Pay with USSD' },
	];

	// Fetch transaction fee when amount changes
	useEffect(() => {
		if (!originalAmount || parseInt(originalAmount) <= 0) {
			setTransactionFee(0);
			setTotalAmount('');
			setAmount('');
			setIsFetchingFee(false);
			return;
		}

		const fetchTransactionFee = async () => {
			setIsFetchingFee(true);
			try {
				const [response, error] = await makeRequestGetTransactionFee({
					amount: originalAmount,
				});

				if (error) {
					console.error('Error fetching transaction fee:', error);
					setTransactionFee(0);
					setTotalAmount(originalAmount);
					setAmount(originalAmount);
					return;
				}

				// Assuming the API returns the fee in response.data.fee or similar
				const fee = response?.data?.data?.fee || 0;
				setTransactionFee(fee);

				const total = parseInt(originalAmount) + fee;
				setTotalAmount(total.toString());
				setAmount(total.toString());
			} catch (err) {
				console.error('Error calculating transaction fee:', err);
				setTransactionFee(0);
				setTotalAmount(originalAmount);
				setAmount(originalAmount);
			} finally {
				setIsFetchingFee(false);
			}
		};

		// Debounce the API call to avoid too many requests
		const timeoutId = setTimeout(fetchTransactionFee, 500);
		return () => clearTimeout(timeoutId);
	}, [originalAmount]);

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

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, '');
		setOriginalAmount(value); // Store the user's input
	};

	const handleCardDetailChange =
		(field: keyof CardDetails) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			let value = event.target.value;

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
		setOriginalAmount('');
		setAmount('');
		setTransactionFee(0);
		setTotalAmount('');
		navigate(-1);
	};

	const handleOpenModal = () => {
		if (!amount) return;
		setOpenModal(true);
		setCurrentStage('method-selection');
		setPaymentStatus('idle');
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setPaymentMethod('card');
		setCardDetails({
			number: '',
			expiryMonth: '',
			expiryYear: '',
			cvv: '',
		});
		setTransferDetails(null);
		setUssdCode('');
		setPaymentStatus('idle');
		setCurrentStage('method-selection');
	};

	const handlePaymentMethodChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setPaymentMethod(event.target.value);
	};

	const handleProceedToCardDetails = () => {
		setCurrentStage('card-details');
	};

	const handleInitiateTransferPayment = async () => {
		setPaymentStatus('processing');
		try {
			const userProfileItems = localStorage.getItem('userProfile');
			const userProfiles = JSON.parse(userProfileItems || '{}');
			const transferPaymentData = {
				amount: totalAmount, // Use total amount including fee
				WalletIdentifier: userProfiles.wallet?.walletIdentifier,
				UserId: userProfiles.userId,
			};

			const [response, error] = await makeRequestFundWalletByTransfer(
				transferPaymentData
			);

			if (error) {
				setPaymentStatus('failed');
				return;
			}

			// Extract all needed details
			const transferDetails = {
				bankName:
					response.data.meta.authorization.transferBank || 'Not specified',
				accountNumber:
					response.data.meta.authorization.transferAccount || 'Not available',
				accountName:
					response.data.meta.authorization.transferAccountName ||
					'Not available',
				reference:
					response.data.meta.authorization.transferReference ||
					'Use your user ID',
				amount: response.data.meta.authorization.transferAmount || totalAmount,
				expiration: response.data.meta.authorization.accountExpiration || 150,
			};

			setTransferDetails(transferDetails);

			// Start countdown if expiration exists
			if (transferDetails.expiration) {
				setTimeLeft(transferDetails.expiration);
				setIsExpired(false);
			}

			setCurrentStage('transfer-display');
			setPaymentStatus('idle');
		} catch (err) {
			setPaymentStatus('failed');
		}
	};

	const handleInitiateUssdPayment = async (selectedBank: {
		code: any;
		name: any;
	}) => {
		setPaymentStatus('processing');
		try {
			const userProfileItems = localStorage.getItem('userProfile');
			const userProfiles = JSON.parse(userProfileItems || '{}');

			// Mock USSD implementation - replace with actual API call
			const ussdPaymentData = {
				amount: totalAmount,
				WalletIdentifier: userProfiles.wallet?.walletIdentifier,
				UserId: userProfiles.userId,
				bankCode: selectedBank.code,
			};

			// Simulate API call delay
			await new Promise(resolve => setTimeout(resolve, 2000));

			// Mock USSD code generation
			const mockUssdCode = `*737*1*${totalAmount}*${userProfiles.userId}#`;
			setUssdCode(mockUssdCode);

			setTimeLeft(300); // 5 minutes
			setIsExpired(false);
			setPaymentStatus('idle');

			return { data: { ussdCode: mockUssdCode } };
		} catch (error) {
			console.error('USSD initiation failed:', error);
			setPaymentStatus('failed');
			throw error;
		}
	};

	const handleSubmitPayment = async () => {
		setPaymentStatus('processing');

		try {
			const userProfileItem = localStorage.getItem('userProfile');
			const userProfile = JSON.parse(userProfileItem || '{}');

			switch (paymentMethod) {
				case 'card':
					const cardPaymentData = {
						amount: originalAmount, // Use original amount for card payment
						walletIdentifier: userProfile.wallet?.walletIdentifier,
						userId: userProfile.userId,
						cardNumber: cardDetails.number,
						expiryMonth: cardDetails.expiryMonth,
						expiryYear: cardDetails.expiryYear,
						cvv: cardDetails.cvv,
						redirectUrl: 'http://localhost:3000/dashboard',
						email: userProfile.email,
					};

					const [cardResponse, cardError] = await makeRequestFundWalletWithCard(
						cardPaymentData
					);

					if (cardError) {
						setPaymentStatus('failed');
						return;
					}

					if (cardResponse?.data?.authUrl) {
						window.location.href = cardResponse.data.authUrl;
					} else {
						setPaymentStatus('success');
						setTimeout(handleCloseModal, 2000);
					}
					break;

				case 'transfer':
					// This is handled by handleInitiateTransferPayment
					await handleInitiateTransferPayment();
					break;

				case 'ussd':
					// This is handled by handleInitiateUssdPayment
					// The USSD flow is different and handled in the method selection
					break;

				default:
					throw new Error('Invalid payment method selected');
			}
		} catch (err) {
			console.error('Payment failed:', err);
			setPaymentStatus('failed');
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

	const isFormValid = (): boolean => {
		return !(!amount || isFetchingFee);
	};

	return (
		<>
			{/* Main Form */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					height: '85vh',
					width: { xs: '100%', md: '35%' },
					gap: '2rem',
				}}
			>
				<Box>
					<Typography
						sx={{ fontSize: '1.25rem', color: '#636559', fontWeight: 'medium' }}
					>
						Fund Wallet
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
							Amount
						</Typography>
						<TextField
							fullWidth
							variant="outlined"
							value={originalAmount}
							onChange={handleAmountChange}
							placeholder="Enter amount"
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

						{/* Display transaction fee if available */}
						{transactionFee > 0 && (
							<Box mt={1}>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Transaction Fee: ₦{transactionFee}
								</Typography>
								<Typography
									variant="body2"
									fontWeight="medium"
								>
									Total Amount: ₦{totalAmount}
								</Typography>
							</Box>
						)}
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
							{isFetchingFee ? 'Loading...' : 'Proceed to payment'}
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
						amount={totalAmount || amount}
						setCurrentStage={setCurrentStage}
						serviceType="wallet"
						identifier={``}
						selectedProvider="Fund Wallet"
						setUssdCode={setUssdCode}
					/>
				) : currentStage === 'card-details' ? (
					<CardPayment
						handleCloseModal={handleCloseModal}
						handleCardDetailChange={handleCardDetailChange}
						cardDetails={cardDetails}
						amount={totalAmount || amount}
						handleSubmitPayment={handleSubmitPayment}
						setCurrentStage={setCurrentStage}
					/>
				) : currentStage === 'transfer-display' && transferDetails ? (
					<BankTransfer
						handleCopyToClipboard={handleCopyToClipboard}
						transferDetails={transferDetails}
						setCurrentStage={setCurrentStage}
						handleConfirmTransferPayment={handleConfirmTransferPayment}
					/>
				) : currentStage === 'ussd-display' ? (
					<USSD
						handleCloseModal={handleCloseModal}
						handleCopyToClipboard={handleCopyToClipboard}
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

export default FundWalletForm;
