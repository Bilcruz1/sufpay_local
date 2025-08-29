import React, { useState } from 'react';
import {
	DialogTitle,
	DialogContent,
	Button,
	Typography,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Dialog,
	CircularProgress,
	Divider,
	Avatar,
	Stack,
	Card,
	CardContent,
	Chip,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SimCardIcon from '@mui/icons-material/SimCard';
import BoltIcon from '@mui/icons-material/Bolt';
import TvIcon from '@mui/icons-material/Tv';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const banks = [
	{ code: '060004', name: 'First Bank of Nigeria' },
	{ code: '060001', name: 'Access Bank' },
	{ code: '060002', name: 'Diamond Bank' },
	{ code: '060003', name: 'Ecobank Nigeria' },
	{ code: '060006', name: 'Fidelity Bank' },
	{ code: '060005', name: 'GTBank' },
	{ code: '060007', name: 'Zenith Bank' },
	{ code: '060008', name: 'UBA' },
];

const getServiceIcon = serviceType => {
	switch (serviceType) {
		case 'electricity':
			return <BoltIcon sx={{ color: '#AAC645' }} />;
		case 'cable':
			return <TvIcon sx={{ color: '#AAC645' }} />;
		case 'wallet funding':
			return <AccountBalanceWalletIcon sx={{ color: '#AAC645' }} />;
		case 'airtime':
		default:
			return <SimCardIcon sx={{ color: '#AAC645' }} />;
	}
};

const paymentMethodDetails = {
	wallet: {
		icon: AccountBalanceWalletIcon,
		title: 'Pay with Wallet',
		description: 'Pay instantly from your wallet',
		features: ['Instant', 'No fees', 'Secure'],
		processingTime: 'Instant',
		color: '#AAC645',
	},
	card: {
		icon: CreditCardIcon,
		title: 'Pay with Card',
		description: 'Pay with your bank card',
		features: ['Secure', 'Instant', 'Any bank'],
		processingTime: 'Instant',
		color: '#AAC645',
	},
	transfer: {
		icon: AccountBalanceIcon,
		title: 'Pay with Bank Transfer',
		description: 'Transfer from your bank account',
		features: ['Secure', 'No card needed', 'Direct'],
		processingTime: '2-5 minutes',
		color: '#AAC645',
	},
	ussd: {
		icon: SimCardIcon,
		title: 'Pay with USSD',
		description: 'Pay using your phone',
		features: ['No internet', 'Any phone', 'Secure'],
		processingTime: '1-3 minutes',
		color: '#AAC645',
	},
};

export default function MethodSelection({
	paymentMethod = '', // Set default to empty string
	handlePaymentMethodChange,
	paymentMethods,
	handleProceedToCardDetails,
	handleInitiateTransferPayment,
	handleInitiateUssdPayment,
	handleSubmitPayment,
	handleCloseModal,
	identifier,
	serviceType,
	selectedProvider,
	amount,
	setCurrentStage,
	setUssdCode,
}) {
	const [showBankSelection, setShowBankSelection] = useState(false);
	const [accountBank, setAccountBank] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Dynamic labels based on service type
	const getIdentifierLabel = () => {
		switch (serviceType) {
			case 'electricity':
				return 'Meter Number';
			case 'cable':
				return 'Smartcard Number';
			case 'wallet funding':
				return 'Amount';
			case 'airtime':
			default:
				return 'Phone Number';
		}
	};

	const getProviderLabel = () => {
		switch (serviceType) {
			case 'electricity':
				return 'Electricity Company';
			case 'cable':
				return 'Cable Provider';
			case 'wallet':
				return 'Transaction Type';
			case 'airtime':
			default:
				return 'Network Provider';
		}
	};

	const handleContinue = () => {
		if (paymentMethod === 'card') {
			handleProceedToCardDetails();
		} else if (paymentMethod === 'transfer') {
			handleInitiateTransferPayment();
		} else if (paymentMethod === 'ussd') {
			setShowBankSelection(true);
		} else if (paymentMethod === 'wallet') {
			handleSubmitPayment();
		} else {
			handleSubmitPayment();
		}
	};

	const handleBankSelect = async () => {
		setIsLoading(true);
		try {
			const selectedBank = banks.find(bank => bank.code === accountBank);
			if (!selectedBank) throw new Error('Bank not found');

			await handleInitiateUssdPayment(selectedBank);
			setCurrentStage('ussd-display');
		} catch (error) {
			console.error('Error initiating USSD:', error);
		} finally {
			setIsLoading(false);
			setShowBankSelection(false);
		}
	};

	const handleCloseBankSelection = () => {
		setShowBankSelection(false);
		setAccountBank('');
	};

	const selectedMethod = paymentMethods.find(
		method => method.id === paymentMethod
	);
	const selectedDetails = paymentMethod
		? paymentMethodDetails[paymentMethod]
		: null;

	return (
		<Box>
			<DialogTitle sx={{ pb: 1 }}>
				<Typography
					variant="h6"
					fontWeight="600"
					sx={{ mb: 0.5, color: '#333' }}
				>
					Select Payment Method
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
				>
					Choose how you want to complete this transaction
				</Typography>
			</DialogTitle>

			<DialogContent sx={{ mt: 1 }}>
				{/* Payment Method Dropdown */}
				<Box sx={{ mb: 3 }}>
					<FormControl
						fullWidth
						sx={{ mb: 5 }}
					>
						<InputLabel
							sx={{
								color: 'text.secondary',
								'&.Mui-focused': {
									color: '#AAC645',
								},
								marginTop: '4px',
							}}
						>
							Payment Method
						</InputLabel>
						<Select
							value={paymentMethod || ''}
							onChange={handlePaymentMethodChange}
							label="Payment Method"
							displayEmpty
							renderValue={value => {
								if (!value) {
									return (
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 1.5,
												color: 'text.secondary',
											}}
										>
											Select Payment Method
										</Box>
									);
								}

								const details = paymentMethodDetails[value];
								const IconComponent = details?.icon || CreditCardIcon;

								return (
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
										<Avatar
											sx={{
												bgcolor: '#AAC64515',
												color: '#AAC645',
												width: 32,
												height: 32,
											}}
										>
											<IconComponent sx={{ fontSize: 18 }} />
										</Avatar>
										<Typography>{details?.title || value}</Typography>
									</Box>
								);
							}}
							sx={{
								'& .MuiOutlinedInput-notchedOutline': {
									borderColor: 'divider',
								},
								'&:hover .MuiOutlinedInput-notchedOutline': {
									borderColor: '#AAC645',
								},
								'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
									borderColor: '#AAC645',
								},
								'& .MuiSelect-select': {
									py: 1.5,
								},
							}}
						>
							<MenuItem
								value=""
								disabled
								sx={{ color: 'text.secondary', fontStyle: 'italic' }}
							>
								Select Payment Method
							</MenuItem>
							{paymentMethods.map(method => {
								const details = paymentMethodDetails[method.id];
								const IconComponent = details?.icon || CreditCardIcon;

								return (
									<MenuItem
										key={method.id}
										value={method.id}
										sx={{
											py: 1.5,
											'&:hover': {
												backgroundColor: '#AAC64508',
											},
											'&.Mui-selected': {
												backgroundColor: '#AAC64515',
												'&:hover': {
													backgroundColor: '#AAC64520',
												},
											},
										}}
									>
										<ListItemIcon sx={{ minWidth: 40 }}>
											<Avatar
												sx={{
													bgcolor: '#AAC64515',
													color: '#AAC645',
													width: 32,
													height: 32,
												}}
											>
												<IconComponent sx={{ fontSize: 18 }} />
											</Avatar>
										</ListItemIcon>
										<ListItemText
											primary={
												<Typography
													variant="body1"
													fontWeight="500"
												>
													{details?.title || method.label}
												</Typography>
											}
											secondary={
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{ fontSize: '0.875rem' }}
												>
													{details?.description || 'Standard payment method'}
												</Typography>
											}
										/>
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>

					{/* Selected Payment Method Details */}
					{paymentMethod && selectedDetails && (
						<Card
							variant="outlined"
							sx={{
								border: '2px solid #AAC645',
								borderRadius: 2,
								backgroundColor: '#AAC64508',
								mt: 2,
							}}
						>
							<CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
								<Box
									display="flex"
									alignItems="center"
									gap={2}
									mb={2}
								>
									<Avatar
										sx={{
											bgcolor: '#AAC645',
											color: 'white',
											width: 40,
											height: 40,
										}}
									>
										<selectedDetails.icon sx={{ fontSize: 20 }} />
									</Avatar>
									<Box flex={1}>
										<Box
											display="flex"
											alignItems="center"
											gap={1}
										>
											<Typography
												variant="h6"
												fontWeight="600"
												color="#333"
											>
												{selectedDetails.title}
											</Typography>
											<CheckCircleIcon
												sx={{
													color: '#AAC645',
													fontSize: 20,
												}}
											/>
										</Box>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ mt: 0.5 }}
										>
											{selectedDetails.description}
										</Typography>
									</Box>
								</Box>

								<Box
									display="flex"
									flexWrap="wrap"
									gap={1}
									mb={2}
								>
									{selectedDetails.features?.map((feature, index) => (
										<Chip
											key={index}
											label={feature}
											size="small"
											sx={{
												backgroundColor: '#AAC64515',
												color: '#AAC645',
												fontWeight: '500',
												fontSize: '0.75rem',
												height: 28,
												'& .MuiChip-label': {
													px: 1.5,
												},
											}}
										/>
									))}
								</Box>

								<Box
									display="flex"
									alignItems="center"
									gap={1}
								>
									<AccessTimeIcon sx={{ fontSize: 16, color: '#AAC645' }} />
									<Typography
										variant="body2"
										color="text.secondary"
									>
										<strong>Processing:</strong>{' '}
										{selectedDetails.processingTime}
									</Typography>
								</Box>
							</CardContent>
						</Card>
					)}
				</Box>

				{/* Enhanced Transaction Summary */}
				<Card
					variant="outlined"
					sx={{
						mb: 3,
						borderRadius: 2,
						backgroundColor: 'background.paper',
						boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
					}}
				>
					<CardContent sx={{ p: 3 }}>
						<Stack
							direction="row"
							alignItems="center"
							spacing={2}
							mb={2}
						>
							<Avatar
								sx={{
									bgcolor: '#AAC64515',
									color: '#AAC645',
									width: 40,
									height: 40,
								}}
							>
								{getServiceIcon(serviceType)}
							</Avatar>
							<Box>
								<Typography
									variant="subtitle1"
									fontWeight="600"
									color="#333"
								>
									Transaction Summary
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Review your transaction details
								</Typography>
							</Box>
						</Stack>

						<Divider sx={{ mb: 2 }} />

						<Stack spacing={2}>
							<Box
								display="flex"
								justifyContent="space-between"
								alignItems="center"
							>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{getProviderLabel()}
								</Typography>
								<Typography
									variant="body2"
									fontWeight="500"
									color="#333"
								>
									{selectedProvider}
								</Typography>
							</Box>

							{identifier && getIdentifierLabel() && (
								<Box
									display="flex"
									justifyContent="space-between"
									alignItems="center"
								>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										{getIdentifierLabel()}
									</Typography>
									<Typography
										variant="body2"
										fontWeight="500"
										color="#333"
									>
										{identifier}
									</Typography>
								</Box>
							)}

							<Divider />

							<Box
								display="flex"
								justifyContent="space-between"
								alignItems="center"
							>
								<Typography
									variant="body1"
									color="text.secondary"
									fontWeight="500"
								>
									Total Amount
								</Typography>
								<Typography
									variant="h6"
									fontWeight="700"
									sx={{ color: '#AAC645' }}
								>
									₦
									{typeof amount === 'string'
										? amount
										: amount?.toLocaleString()}
								</Typography>
							</Box>
						</Stack>
					</CardContent>
				</Card>

				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						gap: 2,
					}}
				>
					<Button
						onClick={handleCloseModal}
						variant="outlined"
						fullWidth
						sx={{
							py: 1.5,
							color: 'text.primary',
							borderColor: 'divider',
							fontWeight: '500',
							'&:hover': {
								borderColor: 'text.primary',
								backgroundColor: 'action.hover',
							},
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={handleContinue}
						variant="contained"
						fullWidth
						disabled={!paymentMethod}
						sx={{
							py: 1.5,
							fontWeight: '600',
							backgroundColor: '#AAC645',
							boxShadow: '0 4px 12px rgba(170, 198, 69, 0.3)',
							'&:hover': {
								backgroundColor: '#99B83D',
								boxShadow: '0 6px 16px rgba(170, 198, 69, 0.4)',
								transform: 'translateY(-1px)',
							},
							'&:disabled': {
								backgroundColor: 'action.disabledBackground',
								color: 'action.disabled',
							},
						}}
					>
						{paymentMethod === 'wallet' ? 'Pay Now' : 'Continue'}
					</Button>
				</Box>
			</DialogContent>

			{/* Enhanced Bank Selection Dialog for USSD */}
			<Dialog
				open={showBankSelection}
				onClose={handleCloseBankSelection}
				PaperProps={{
					sx: {
						borderRadius: 3,
						minWidth: 400,
					},
				}}
			>
				<DialogTitle sx={{ pb: 1 }}>
					<Stack
						direction="row"
						alignItems="center"
						spacing={2}
					>
						<Avatar sx={{ bgcolor: '#AAC64515', color: '#AAC645' }}>
							<SimCardIcon />
						</Avatar>
						<Box>
							<Typography
								variant="h6"
								fontWeight="600"
								color="#333"
							>
								Select Your Bank
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
							>
								Choose your bank for USSD payment
							</Typography>
						</Box>
					</Stack>
				</DialogTitle>
				<DialogContent>
					<Box sx={{ mt: 2 }}>
						<FormControl
							fullWidth
							sx={{ mb: 3 }}
						>
							<InputLabel
								sx={{
									'&.Mui-focused': {
										color: '#AAC645',
									},
								}}
							>
								Select Bank
							</InputLabel>
							<Select
								value={accountBank}
								onChange={e => setAccountBank(e.target.value)}
								label="Select Bank"
								sx={{
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#AAC645',
									},
									'& .MuiSelect-select': {
										display: 'flex',
										alignItems: 'center',
										gap: 1,
									},
								}}
							>
								{banks.map(bank => (
									<MenuItem
										key={bank.code}
										value={bank.code}
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 1.5,
											'&:hover': {
												backgroundColor: '#AAC64508',
											},
										}}
									>
										<AccountBalanceIcon
											fontSize="small"
											sx={{ color: '#AAC645' }}
										/>
										{bank.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<Card
							sx={{
								p: 2,
								backgroundColor: '#AAC64508',
								border: '1px solid #AAC64525',
								borderRadius: 2,
								mb: 3,
							}}
						>
							<Typography
								variant="body2"
								color="#333"
							>
								<strong>Note:</strong> You'll receive a USSD code to dial on
								your phone to complete the payment.
							</Typography>
						</Card>

						<Box
							sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
						>
							<Button
								onClick={handleCloseBankSelection}
								variant="outlined"
								fullWidth
								sx={{
									py: 1.5,
									color: 'text.primary',
									borderColor: 'divider',
									fontWeight: '500',
								}}
							>
								Back
							</Button>
							<Button
								onClick={handleBankSelect}
								variant="contained"
								fullWidth
								disabled={!accountBank || isLoading}
								sx={{
									py: 1.5,
									fontWeight: '600',
									backgroundColor: '#AAC645',
									'&:hover': {
										backgroundColor: '#99B83D',
									},
								}}
							>
								{isLoading ? (
									<CircularProgress
										size={24}
										sx={{ color: 'white' }}
									/>
								) : (
									'Get USSD Code'
								)}
							</Button>
						</Box>
					</Box>
				</DialogContent>
			</Dialog>
		</Box>
	);
}
