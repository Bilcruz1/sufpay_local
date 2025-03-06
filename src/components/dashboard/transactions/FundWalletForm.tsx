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
import AirtimePaymentDetails from './Payments/AirtimePaymentDetails';
import CardPayment from './Payments/CardPayment';
import PaymentDetails from './Payments/PaymentDetails';
import { useRequest } from '../../../hooks/use-request';
import { initialiseCardPayment, fundwallet } from '../../../Apis/card-payment';

// Define type for carrier options
interface CarrierOption {
	value: string;
	label: string;
	logo: string;
}

const FundWalletForm: React.FC = () => {
	const isfirstTime = true;
	const [selectedCarrier, setSelectedCarrier] = useState<string>('MTN');
	const [carrierLogo, setCarrierLogo] = useState<string>(mtnLogo); // Default to MTN
	const [openDropdown, setOpenDropdown] = useState<boolean>(false);
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [AirtimeAmount, setAirtimeAmount] = useState<string>('');
	const [stage, setStage] = useState(isfirstTime ? 1 : 2);
	const [openModal, setOpenModal] = useState(false);
	const carrierOptions: CarrierOption[] = [
		{ value: 'MTN', label: 'MTN', logo: mtnLogo },
		{ value: 'GLO', label: 'GLO', logo: gloLogo },
		{ value: '9 MOBILE', label: '9 MOBILE', logo: mobile9Logo },
		{ value: 'AIRTEL', label: 'AIRTEL', logo: airtelLogo },
	];
	const navigate = useNavigate();

	const { isLoading, response, makeRequest } = useRequest(fundwallet);

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

	const initialisePayment = async () => {
		const userProfileItem = localStorage.getItem('userProfile');

		const userProfile = JSON.parse(userProfileItem || '');

		console.log(userProfile, 'USER profile');

		const [response, error] = await makeRequest({
			amount: AirtimeAmount,
			walletIdentifier: userProfile.wallet.walletIdentifier,
			userId: userProfile.userId,
		});

		if (error) {
			console.log(error, 'ERROR');
			return;
		}

		window.location.href = response.data.data.authorizationUrl;

		console.log(response, 'res');
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
				<Box>
					<Box>
						<Typography
							sx={{
								fontSize: '1.25rem',
								color: '#636559',
								fontWeight: 'medium',
							}}
						>
							Fund Wallet
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
								Wallet Amount
							</Typography>
							<TextField
								fullWidth
								variant="outlined"
								onChange={e => setAirtimeAmount(e.target.value)}
								value={AirtimeAmount}
								placeholder="Enter value"
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
					{/* Data Plans Tabs Component */}
					{/* <DataPlansTabs onSelectData={handleDataSelection} /> */}
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
							// onClick={handleOpenModal}
							onClick={initialisePayment}
							variant="outlined"
							disabled={isLoading}
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
							{isLoading ? 'processing...' : 'Proceed to payment'}
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
								{/* <PaymentDetails
									orderDetails={[
										{ label: 'Phone number', value: phoneNumber },
										{ label: 'Network Provider', value: selectedCarrier },
										{ label: 'Amount', value: AirtimeAmount },
									]}
								/> */}
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
										onClick={changeStage}
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
					</Box>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default FundWalletForm;
