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
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SimCardIcon from '@mui/icons-material/SimCard';
import BoltIcon from '@mui/icons-material/Bolt';
import TvIcon from '@mui/icons-material/Tv';

const banks = [
	{ code: '060004', name: 'First Bank of Nigeria' },
	{ code: '060001', name: 'Access Bank' },
	{ code: '060002', name: 'Diamond Bank' },
	{ code: '060003', name: 'Ecobank Nigeria' },
	{ code: '060006', name: 'Fidelity Bank' },
];

const getServiceIcon = serviceType => {
	switch (serviceType) {
		case 'electricity':
			return <BoltIcon color="warning" />;
		case 'cable':
			return <TvIcon color="primary" />;
		case 'airtime':
		default:
			return <SimCardIcon color="success" />;
	}
};

export default function MethodSelection({
	paymentMethod,
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
			case 'airtime':
			default:
				return 'Network Provider';
		}
	};

	const getPaymentMethodIcon = method => {
		switch (method) {
			case 'card':
				return <CreditCardIcon fontSize="small" />;
			case 'transfer':
				return <AccountBalanceIcon fontSize="small" />;
			case 'ussd':
				return <SimCardIcon fontSize="small" />;
			default:
				return null;
		}
	};

	const handleContinue = () => {
		if (paymentMethod === 'card') {
			handleProceedToCardDetails();
		} else if (paymentMethod === 'transfer') {
			handleInitiateTransferPayment();
		} else if (paymentMethod === 'ussd') {
			setShowBankSelection(true);
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

	return (
		<Box>
			<DialogTitle sx={{ pb: 1 }}>
				<Typography
					variant="h6"
					fontWeight="600"
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

			<DialogContent>
				<Box sx={{ mt: 1 }}>
					<FormControl
						fullWidth
						sx={{ mb: 2 }}
					>
						<InputLabel>Payment Method</InputLabel>
						<Select
							value={paymentMethod}
							onChange={handlePaymentMethodChange}
							label="Payment Method"
							IconComponent={ArrowDropDownIcon}
							sx={{
								'& .MuiSelect-select': {
									display: 'flex',
									alignItems: 'center',
									gap: 1,
								},
							}}
						>
							{paymentMethods.map(method => (
								<MenuItem
									key={method.id}
									value={method.id}
									sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
								>
									{getPaymentMethodIcon(method.id)}
									{method.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Enhanced Transaction Summary */}
					<Box
						sx={{
							mt: 3,
							p: 2.5,
							border: '1px solid',
							borderColor: 'divider',
							borderRadius: 2,
							mb: 2,
							backgroundColor: 'background.paper',
							boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
						}}
					>
						<Stack
							direction="row"
							alignItems="center"
							spacing={2}
							mb={2}
						>
							<Avatar sx={{ bgcolor: 'primary.light' }}>
								{getServiceIcon(serviceType)}
							</Avatar>
							<Typography
								variant="subtitle1"
								fontWeight="500"
							>
								Transaction Summary
							</Typography>
						</Stack>

						<Divider sx={{ mb: 2 }} />

						<Stack spacing={1.5}>
							<Box
								display="flex"
								justifyContent="space-between"
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
								>
									{selectedProvider}
								</Typography>
							</Box>

							<Box
								display="flex"
								justifyContent="space-between"
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
								>
									{identifier}
								</Typography>
							</Box>

							<Box
								display="flex"
								justifyContent="space-between"
							>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Amount
								</Typography>
								<Typography
									variant="body1"
									fontWeight="600"
								>
									₦{amount.toLocaleString()}
								</Typography>
							</Box>
						</Stack>
					</Box>

					<Box
						sx={{
							mt: 3,
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
								},
							}}
						>
							Back
						</Button>
						<Button
							onClick={handleContinue}
							variant="contained"
							fullWidth
							sx={{
								py: 1.5,
								fontWeight: '600',
								boxShadow: 'none',
								'&:hover': {
									boxShadow: 'none',
								},
							}}
						>
							Continue
						</Button>
					</Box>
				</Box>
			</DialogContent>

			{/* Bank Selection Dialog for USSD */}
			<Dialog
				open={showBankSelection}
				onClose={handleCloseBankSelection}
				PaperProps={{
					sx: {
						borderRadius: 3,
					},
				}}
			>
				<DialogTitle sx={{ pb: 1 }}>
					<Typography
						variant="h6"
						fontWeight="600"
					>
						Select Your Bank
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Choose your bank for USSD payment
					</Typography>
				</DialogTitle>
				<DialogContent>
					<Box sx={{ mt: 1, minWidth: 300 }}>
						<FormControl
							fullWidth
							sx={{ mb: 3 }}
						>
							<InputLabel>Bank</InputLabel>
							<Select
								value={accountBank}
								onChange={e => setAccountBank(e.target.value)}
								label="Bank"
								sx={{
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
										sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
									>
										<AccountBalanceIcon fontSize="small" />
										{bank.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

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
								Cancel
							</Button>
							<Button
								onClick={handleBankSelect}
								variant="contained"
								fullWidth
								disabled={!accountBank || isLoading}
								sx={{
									py: 1.5,
									fontWeight: '600',
									boxShadow: 'none',
								}}
							>
								{isLoading ? (
									<CircularProgress
										size={24}
										color="inherit"
									/>
								) : (
									'Proceed'
								)}
							</Button>
						</Box>
					</Box>
				</DialogContent>
			</Dialog>
		</Box>
	);
}
