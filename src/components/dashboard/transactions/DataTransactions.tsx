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
import DataPlansTabs from './DataPage/DataPlanTabs';
import { useNavigate } from 'react-router-dom';
import PaymentDetails from './Payments/PaymentDetails';
import CardPayment from './Payments/CardPayment';
import succ from '../../../assets/icons/success.svg';

// Define type for carrier options
interface CarrierOption {
	value: string;
	label: string;
	logo: string;
}

const DataTransactions: React.FC = () => {
	const isfirstTime = true;
	const [selectedCarrier, setSelectedCarrier] = useState<string>('MTN');
	const [carrierLogo, setCarrierLogo] = useState<string>(mtnLogo); // Default to MTN
	const [openDropdown, setOpenDropdown] = useState<boolean>(false);
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [dataInput, setDataInput] = useState<string>('');
	const [dataAmount, setDataAmount] = useState<string>('');
	const [stage, setStage] = useState(isfirstTime ? 1 : 2);
	const [openModal, setOpenModal] = useState(false);
	const carrierOptions: CarrierOption[] = [
		{ value: 'MTN', label: 'MTN', logo: mtnLogo },
		{ value: 'GLO', label: 'GLO', logo: gloLogo },
		{ value: '9 MOBILE', label: '9 MOBILE', logo: mobile9Logo },
		{ value: 'AIRTEL', label: 'AIRTEL', logo: airtelLogo },
	];
	const navigate = useNavigate();
	const handleCarrierChange = (carrier: CarrierOption) => {
		setSelectedCarrier(carrier.value);
		setCarrierLogo(carrier.logo);
		setOpenDropdown(false);
	};

	// This function updates dataInput and dataAmount when a plan is selected
	const handleDataSelection = (data: string, price: string) => {
		setDataInput(data);
		setDataAmount(price);
	};

	const handleCancelDataSelection = () => {
		setDataInput('');
		setDataAmount('');
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
							Data
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
								Phone Number
							</Typography>
							<TextField
								fullWidth
								variant="outlined"
								type="number"
								value={phoneNumber}
								onChange={e => setPhoneNumber(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<IconButton
												onClick={() => setOpenDropdown(!openDropdown)}
											>
												<img
													src={carrierLogo}
													alt="carrier logo"
													style={{ width: 24, height: 24 }}
												/>
												<ArrowDropDownIcon />
											</IconButton>
										</InputAdornment>
									),
								}}
								placeholder="Enter phone number"
							/>
							<Typography
								sx={{
									fontSize: '0.88rem',
									color: '#636559',
									paddingTop: '1.5rem',
									lineHeight: '1.25rem',
									paddingBottom: '0.38rem',
								}}
							>
								Data
							</Typography>
							<TextField
								fullWidth
								variant="outlined"
								value={dataInput} // Will update when a data plan is selected
								placeholder="Select a data plan"
							/>
							<Typography
								sx={{
									fontSize: '0.88rem',
									color: '#636559',
									paddingTop: '1.5rem',
									lineHeight: '1.25rem',
									paddingBottom: '0.38rem',
								}}
							>
								Amount
							</Typography>
							<TextField
								fullWidth
								variant="outlined"
								value={dataAmount} // Will update when a data plan is selected
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
					<DataPlansTabs onSelectData={handleDataSelection} />
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
							onClick={handleCancelDataSelection}
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
							onClick={handleOpenModal}
							variant="outlined"
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
							Proceed to Payment
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
										{ label: 'Phone Number', value: phoneNumber },
										{ label: 'Network Provider', value: selectedCarrier },
										{ label: 'plan', value: dataInput },
										{ label: 'Amount', value: dataAmount },
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
						{stage === 2 && (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
									gap: '2.5rem',
								}}
							>
								<CardPayment
									orderDetails={[
										{ label: 'Phone Number', value: phoneNumber },
										{ label: 'Network Provider', value: selectedCarrier },
										{ label: 'Plan', value: dataInput },
										{ label: 'Amount', value: dataAmount },
									]}
								/>
								{/* <CardPayment
									phoneNumber={phoneNumber} // Pass phoneNumber here
									networkProvider={selectedCarrier} // Pass selectedCarrier here
									plan={dataInput} // Pass the selected data plan
									amount={dataAmount}
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
										onClick={() => setStage(1)}
									>
										Back
									</Button>
									<Button
										variant="contained"
										onClick={() => setStage(3)}
										sx={{
											color: 'white',
											backgroundColor: '#AAC645',
											paddingX: '2.5rem',
											paddingY: '1rem',
										}}
									>
										Next
									</Button>
								</Box>
								{/* <button onClick={() => setStage(1)}>Back</button>
								<button onClick={() => setStage(3)}>Next</button> */}
							</Box>
						)}
						{stage === 3 && (
							<Box
								sx={{
									width: '100%',
									maxWidth: '25rem',

									margin: '0 auto',
									textAlign: 'center',
								}}
							>
								{/* Success Icon */}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										marginBottom: '3.1rem',
									}}
								>
									<img
										src={succ}
										alt={succ}
									/>
								</Box>

								{/* Success Message */}
								<Typography
									sx={{
										fontWeight: 'medium',
										color: '#353535',
										marginBottom: '1rem',
										fontSize: '1.25rem',
									}}
								>
									Transaction Successful!
								</Typography>

								{/* Success Description */}
								<Typography
									sx={{
										color: '#A2A49B',
										marginBottom: '3.1rem',
										fontSize: '1rem',
									}}
								>
									Your payment was processed successfully. Tap the button below
									to view, share, or download the receipt.
								</Typography>

								{/* Buttons */}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										flexDirection: { lg: 'row', xs: 'column' },
										gap: '1rem',
									}}
								>
									<Button
										variant="outlined"
										sx={{
											borderColor: '#000',
											color: '#000',
											textTransform: 'none',
											borderRadius: '20px',
											padding: '0.5rem 1.5rem',
										}}
									>
										View receipt
									</Button>

									<Button
										variant="contained"
										sx={{
											backgroundColor: '#AAC645',
											color: '#fff',
											textTransform: 'none',
											borderRadius: '20px',
											padding: '0.5rem 1.5rem',
											'&:hover': {
												backgroundColor: '#92A837',
											},
										}}
										onClick={handleCloseModalSuccess}
									>
										Return to dashboard
									</Button>
								</Box>
							</Box>
						)}
						{stage === 4 && (
							<Box
								sx={{
									width: '100%',
									maxWidth: '25rem',

									margin: '0 auto',
									textAlign: 'center',
								}}
							>
								{/* Success Icon */}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										marginBottom: '3.1rem',
									}}
								>
									<img
										src={succ}
										alt={succ}
									/>
								</Box>

								{/* Success Message */}
								<Typography
									sx={{
										fontWeight: 'medium',
										color: '#353535',
										marginBottom: '1rem',
										fontSize: '1.25rem',
									}}
								>
									Transaction Error!
								</Typography>

								{/* Success Description */}
								<Typography
									sx={{
										color: '#A2A49B',
										marginBottom: '3.1rem',
										fontSize: '1rem',
									}}
								>
									Oops! Something went wrong, please try again if the problem
									persist please contact our customer support for further
									assistance
								</Typography>

								{/* Buttons */}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										flexDirection: { lg: 'row', xs: 'column' },
										gap: '1rem',
									}}
								>
									<Button
										variant="outlined"
										sx={{
											borderColor: '#000',
											color: '#000',
											textTransform: 'none',
											borderRadius: '20px',
											padding: '0.5rem 1.5rem',
										}}
										onClick={handleCloseModal}
									>
										Cancel
									</Button>

									<Button
										variant="contained"
										sx={{
											backgroundColor: '#AAC645',
											color: '#fff',
											textTransform: 'none',
											borderRadius: '20px',
											padding: '0.5rem 1.5rem',
											'&:hover': {
												backgroundColor: '#92A837',
											},
										}}
										onClick={() => setStage(1)}
									>
										Try again
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

export default DataTransactions;
