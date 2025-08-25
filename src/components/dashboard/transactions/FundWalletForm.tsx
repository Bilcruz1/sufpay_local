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
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '../../../hooks/use-request';
import { getTransactionFee } from '../../../Apis/card-payment';
import { fundWalletWithCard } from '../../../Apis/card-payment';
import { fundWalletByTransfer } from '../../../Apis/card-payment';

interface PaymentMethod {
	id: string;
	label: string;
}

interface CardDetails {
	number: string;
	expiryMonth: string;
	expiryYear: string;
	cvv: string;
}

interface Bank {
	id: string;
	name: string;
}

interface TransferDetails {
	accountNumber: string;
	bankName: string;
	accountName: string;
	amount: string;
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
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState<string>('');
	const [cardDetails, setCardDetails] = useState<CardDetails>({
		number: '',
		expiryMonth: '',
		expiryYear: '',
		cvv: '',
	});
	const [selectedBank, setSelectedBank] = useState<string>('');
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
		isLoading: isLoadingFundwalletByTransfer,
		makeRequest: makeRequestFundWalletByTransfer,
	} = useRequest(fundWalletByTransfer);
	const {
		isLoading: isLoadingFundWalletWithCard,
		makeRequest: makeRequestFundWalletWithCard,
	} = useRequest(fundWalletWithCard);

	const {
		isLoading: isLoadinggetTransactionFee,
		makeRequest: makeRequestgetTransactionFee,
	} = useRequest(getTransactionFee);

	const paymentMethods: PaymentMethod[] = [
		{ id: 'card', label: 'Pay by Card' },
		{ id: 'transfer', label: 'Pay by Transfer' },
		{ id: 'ussd', label: 'Pay by USSD' },
	];

	const banks: Bank[] = [
		{ id: '1', name: 'Access Bank' },
		{ id: '2', name: 'GTBank' },
		{ id: '3', name: 'Zenith Bank' },
		{ id: '4', name: 'First Bank' },
		{ id: '5', name: 'UBA' },
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
				const [response, error] = await makeRequestgetTransactionFee({
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
				const fee = response?.data?.data.fee || 0;
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

	const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
		setSelectedPaymentMethod(event.target.value);
	};

	const handleBankChange = (event: SelectChangeEvent<string>) => {
		setSelectedBank(event.target.value);
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

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, '');
		setOriginalAmount(value); // Store the user's input
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
		setSelectedPaymentMethod('');
		setCardDetails({
			number: '',
			expiryMonth: '',
			expiryYear: '',
			cvv: '',
		});
		setSelectedBank('');
		setTransferDetails(null);
		setUssdCode('');
		setPaymentStatus('idle');
	};

	const handleProceedToCardDetails = () => {
		setCurrentStage('card-details');
	};

	const handleProceedToUssd = async () => {
		console.log('Proceeding to USSD payment...');
		if (!selectedBank) return;

		setPaymentStatus('processing');
		// try {
		// 	const [response, error] = await makeUssdRequest({
		// 		amount: totalAmount, // Use total amount including fee
		// 		bankId: selectedBank,
		// 	});

		// 	if (error) {
		// 		setPaymentStatus('failed');
		// 		return;
		// 	}

		// 	setUssdCode(response.data.ussdCode);
		// 	setCurrentStage('ussd-display');
		// 	setPaymentStatus('idle');
		// } catch (err) {
		// 	setPaymentStatus('failed');
		// }
	};

	const handleInitiateTransferPayment = async () => {
		setPaymentStatus('processing');
		try {
			const userProfileItems = localStorage.getItem('userProfile');
			const userProfiles = JSON.parse(userProfileItems || '{}');
			const TransferpaymentData = {
				amount: totalAmount, // Use total amount including fee
				WalletIdentifier: userProfiles.wallet?.walletIdentifier,
				UserId: userProfiles.userId,
			};

			const [response, error] = await makeRequestFundWalletByTransfer(
				TransferpaymentData
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

	const handleSubmitCardPayment = async () => {
		setPaymentStatus('processing');
		try {
			const userProfileItem = localStorage.getItem('userProfile');
			const userProfile = JSON.parse(userProfileItem || '{}');

			const paymentData = {
				amount: originalAmount, // Use total amount including fee
				walletIdentifier: userProfile.wallet?.walletIdentifier,
				userId: userProfile.userId,
				cardNumber: cardDetails.number,
				expiryMonth: cardDetails.expiryMonth,
				expiryYear: cardDetails.expiryYear,
				cvv: cardDetails.cvv,
				redirectUrl: 'http://localhost:3000/dashboard',
				email: userProfile.email,
			};

			const [response, error] = await makeRequestFundWalletWithCard(
				paymentData
			);

			if (error) {
				setPaymentStatus('failed');
				return;
			}

			if (response?.data?.authUrl) {
				window.location.href = response.data.authUrl;
			} else {
				setPaymentStatus('success');
				setTimeout(handleCloseModal, 2000);
			}
		} catch (err) {
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

	return (
		<>
			{/* Main Form */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					height: '85vh',
					width: '35%',
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
							disabled={!amount || isFetchingFee}
							sx={{
								px: 3,
								py: 1.5,
								backgroundColor: '#AAC645',
								color: '#ffffff',
								'&:hover': { backgroundColor: '#92A837' },
							}}
						>
							{isFetchingFee ? 'loading...' : 'Proceed to payment'}
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
					<DialogContent>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								p: 4,
							}}
						>
							<CircularProgress
								size={60}
								sx={{ color: '#AAC645', mb: 3 }}
							/>
							<Typography variant="h6">Processing your payment...</Typography>
						</Box>
					</DialogContent>
				) : paymentStatus === 'success' ? (
					<DialogContent>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								p: 4,
							}}
						>
							<CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 60, mb: 3 }} />
							<Typography
								variant="h6"
								gutterBottom
							>
								Payment Successful!
							</Typography>
							<Typography variant="body1">
								Your wallet has been funded successfully.
							</Typography>
						</Box>
					</DialogContent>
				) : paymentStatus === 'failed' ? (
					<DialogContent>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								p: 4,
							}}
						>
							<ErrorIcon sx={{ color: '#F44336', fontSize: 60, mb: 3 }} />
							<Typography
								variant="h6"
								gutterBottom
							>
								Payment Failed
							</Typography>
							<Typography variant="body1">
								There was an issue processing your payment. Please try again.
							</Typography>
							<Button
								onClick={() => setPaymentStatus('idle')}
								variant="contained"
								sx={{ mt: 3, backgroundColor: '#AAC645', color: '#ffffff' }}
							>
								Try Again
							</Button>
						</Box>
					</DialogContent>
				) : (
					<>
						<DialogTitle>
							<Typography
								variant="h6"
								fontWeight="medium"
							>
								{currentStage === 'method-selection'
									? 'Select Payment Method'
									: currentStage === 'card-details'
									? 'Enter Card Details'
									: currentStage === 'transfer-display'
									? 'Transfer Details'
									: 'USSD Payment'}
							</Typography>
						</DialogTitle>

						<DialogContent>
							{currentStage === 'method-selection' && (
								<Box sx={{ mt: 2 }}>
									<FormControl fullWidth>
										<InputLabel>Payment Method</InputLabel>
										<Select
											value={selectedPaymentMethod}
											onChange={handlePaymentMethodChange}
											label="Payment Method"
											IconComponent={ArrowDropDownIcon}
										>
											{paymentMethods.map(method => (
												<MenuItem
													key={method.id}
													value={method.id}
												>
													{method.label}
												</MenuItem>
											))}
										</Select>
									</FormControl>

									<Box
										sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}
									>
										<Button
											onClick={() => {
												if (selectedPaymentMethod === 'card') {
													handleProceedToCardDetails();
												} else if (selectedPaymentMethod === 'transfer') {
													handleInitiateTransferPayment();
												} else if (selectedPaymentMethod === 'ussd') {
													setCurrentStage('ussd-display');
												}
											}}
											variant="contained"
											disabled={!selectedPaymentMethod}
											sx={{
												px: 3,
												py: 1,
												backgroundColor: '#AAC645',
												color: '#ffffff',
												'&:hover': { backgroundColor: '#92A837' },
											}}
										>
											Proceed
										</Button>
									</Box>
								</Box>
							)}

							{currentStage === 'card-details' && (
								<Box sx={{ mt: 2 }}>
									<TextField
										fullWidth
										label="Card Number"
										placeholder="1234 5678 9012 3456"
										value={cardDetails.number}
										onChange={handleCardDetailChange('number')}
										sx={{ mb: 2 }}
										inputProps={{
											maxLength: 19,
											inputMode: 'numeric',
											pattern: '[0-9]*',
										}}
									/>

									<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
										<TextField
											fullWidth
											label="Expiry Month (MM)"
											placeholder="MM"
											value={cardDetails.expiryMonth}
											onChange={handleCardDetailChange('expiryMonth')}
											inputProps={{
												maxLength: 2,
												inputMode: 'numeric',
												pattern: '[0-9]*',
											}}
										/>

										<TextField
											fullWidth
											label="Expiry Year (YY)"
											placeholder="YY"
											value={cardDetails.expiryYear}
											onChange={handleCardDetailChange('expiryYear')}
											inputProps={{
												maxLength: 2,
												inputMode: 'numeric',
												pattern: '[0-9]*',
											}}
										/>
									</Box>

									<TextField
										fullWidth
										label="CVV"
										placeholder="123"
										value={cardDetails.cvv}
										onChange={handleCardDetailChange('cvv')}
										inputProps={{
											maxLength: 3,
											inputMode: 'numeric',
											pattern: '[0-9]*',
										}}
									/>

									<Box
										sx={{
											mt: 3,
											display: 'flex',
											justifyContent: 'space-between',
										}}
									>
										<Button
											onClick={() => setCurrentStage('method-selection')}
											variant="outlined"
											sx={{ px: 3, py: 1, color: 'black' }}
										>
											Back
										</Button>
										<Button
											onClick={handleSubmitCardPayment}
											variant="contained"
											disabled={
												!cardDetails.number ||
												cardDetails.expiryMonth.length !== 2 ||
												cardDetails.expiryYear.length !== 2 ||
												!cardDetails.cvv
											}
											sx={{
												px: 3,
												py: 1,
												backgroundColor: '#AAC645',
												color: '#ffffff',
												'&:hover': { backgroundColor: '#92A837' },
											}}
										>
											Pay ₦{totalAmount}
										</Button>
									</Box>
								</Box>
							)}

							{currentStage === 'transfer-display' && transferDetails && (
								<Box sx={{ mt: 2 }}>
									<Box
										sx={{
											p: 2,
											backgroundColor: '#f5f5f5',
											borderRadius: 1,
											mb: 3,
										}}
									>
										<Typography
											variant="body2"
											gutterBottom
										>
											Transfer to the account details below:
										</Typography>

										{/* Transfer Amount */}
										<Typography
											variant="body1"
											fontWeight="bold"
											sx={{ mb: 1 }}
										>
											Amount: {transferDetails.amount}
										</Typography>

										{/* Bank Details */}
										<Typography
											variant="body1"
											fontWeight="medium"
										>
											Bank: {transferDetails.bankName}
										</Typography>
										<Typography
											variant="body1"
											fontWeight="medium"
										>
											Account Number: {transferDetails.accountNumber}
										</Typography>

										{/* Countdown Timer */}
										{timeLeft !== null && (
											<Box
												sx={{
													mt: 2,
													p: 1,
													backgroundColor: isExpired ? '#ffebee' : '#e8f5e9',
													borderRadius: 1,
												}}
											>
												<Typography
													variant="body1"
													fontWeight="bold"
													color={isExpired ? 'error' : 'success'}
												>
													{isExpired ? (
														'EXPIRED! Please initiate a new transfer'
													) : (
														<>
															Expires in: {Math.floor(timeLeft / 60)}m{' '}
															{timeLeft % 60}s
														</>
													)}
												</Typography>
												{isExpired && (
													<Typography
														variant="body2"
														sx={{ mt: 1 }}
													>
														These account details are no longer valid
													</Typography>
												)}
											</Box>
										)}

										<Typography
											variant="body2"
											sx={{ mt: 2, fontStyle: 'italic' }}
										>
											Complete your transfer within the time limit
										</Typography>
									</Box>

									<Box
										sx={{
											mt: 3,
											display: 'flex',
											justifyContent: 'space-between',
										}}
									>
										<Button
											onClick={() => setCurrentStage('method-selection')}
											variant="outlined"
											sx={{ px: 3, py: 1, color: 'black' }}
										>
											Back
										</Button>
										<Button
											onClick={handleConfirmTransferPayment}
											variant="contained"
											sx={{
												px: 3,
												py: 1,
												backgroundColor: isExpired ? '#cccccc' : '#AAC645',
												color: '#ffffff',
												'&:hover': {
													backgroundColor: isExpired ? '#cccccc' : '#92A837',
												},
											}}
											disabled={isExpired}
										>
											{isExpired
												? 'Transfer Expired'
												: 'I have made the transfer'}
										</Button>
									</Box>
								</Box>
							)}

							{currentStage === 'ussd-display' && (
								<Box sx={{ mt: 2 }}>
									{!ussdCode ? (
										<>
											<FormControl
												fullWidth
												sx={{ mb: 3 }}
											>
												<InputLabel>Select Bank</InputLabel>
												<Select
													value={selectedBank}
													onChange={handleBankChange}
													label="Select Bank"
													IconComponent={ArrowDropDownIcon}
												>
													{banks.map(bank => (
														<MenuItem
															key={bank.id}
															value={bank.id}
														>
															{bank.name}
														</MenuItem>
													))}
												</Select>
											</FormControl>

											<Box
												sx={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<Button
													onClick={() => setCurrentStage('method-selection')}
													variant="outlined"
													sx={{ px: 3, py: 1, color: 'black' }}
												>
													Back
												</Button>
												<Button
													onClick={handleProceedToUssd}
													variant="contained"
													disabled={!selectedBank}
													sx={{
														px: 3,
														py: 1,
														backgroundColor: '#AAC645',
														color: '#ffffff',
														'&:hover': { backgroundColor: '#92A837' },
													}}
												>
													Proceed
												</Button>
											</Box>
										</>
									) : (
										<>
											<Box
												sx={{
													p: 2,
													backgroundColor: '#f5f5f5',
													borderRadius: 1,
													mb: 3,
												}}
											>
												<Typography
													variant="body2"
													gutterBottom
												>
													Dial the following USSD code on your phone:
												</Typography>
												<Typography
													variant="h6"
													sx={{ textAlign: 'center', my: 2 }}
												>
													<strong>{ussdCode}</strong>
												</Typography>
												<Typography variant="body2">
													Follow the prompts to complete your payment.
												</Typography>
											</Box>

											<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
												<Button
													onClick={handleCloseModal}
													variant="contained"
													sx={{
														px: 3,
														py: 1,
														backgroundColor: '#AAC645',
														color: '#ffffff',
														'&:hover': { backgroundColor: '#92A837' },
													}}
												>
													Done
												</Button>
											</Box>
										</>
									)}
								</Box>
							)}
						</DialogContent>
					</>
				)}
			</Dialog>
		</>
	);
};

export default FundWalletForm;
