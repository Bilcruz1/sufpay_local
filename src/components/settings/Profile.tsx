import {
	Box,
	Divider,
	Stack,
	TextField,
	Typography,
	InputAdornment,
	Avatar,
	Button,
	IconButton,
	CircularProgress,
	Alert,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRequest } from '../../hooks/use-request';
import { setPasskey } from '../../Apis/card-payment';

interface UserProfile {
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	userId: string;
	wallet: {
		id: string;
		walletIdentifier: string;
		passPinIsSet: boolean;
		balance: {
			actualBalance: number;
			currentBalance: number;
		};
	};
}

interface PasskeyData {
	passkey: string;
	confirmPasskey: string;
	showPasskey: boolean;
	showConfirmPasskey: boolean;
}

interface FormErrors {
	firstName?: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
	oldPasskey?: string;
	passkey?: string;
	confirmPasskey?: string;
}

export default function Profile() {
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
	});
	const [passkeyData, setPasskeyData] = useState<PasskeyData>({
		passkey: '',
		confirmPasskey: '',
		showPasskey: false,
		showConfirmPasskey: false,
	});
	const [oldPasskey, setOldPasskey] = useState('');
	const [showOldPasskey, setShowOldPasskey] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const { makeRequest: makeSetPasskeyRequest } = useRequest(setPasskey);

	// Load user profile from localStorage on component mount
	useEffect(() => {
		const userProfileItem = localStorage.getItem('userProfile');
		if (userProfileItem) {
			const profile = JSON.parse(userProfileItem);
			setUserProfile(profile);
			setFormData({
				firstName: profile.firstName || '',
				lastName: profile.lastName || '',
				email: profile.email || '',
				phoneNumber: profile.phoneNumber || '',
			});
		}
	}, []);

	// Handle form field changes
	const handleFormChange =
		(field: keyof typeof formData) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData(prev => ({
				...prev,
				[field]: e.target.value,
			}));

			// Clear error when user starts typing
			if (field in errors && errors[field as keyof FormErrors]) {
				setErrors(prev => ({ ...prev, [field]: '' }));
			}
		};

	// Handle old passkey change
	const handleOldPasskeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, '').substring(0, 6);
		setOldPasskey(value);

		if (errors.oldPasskey) {
			setErrors(prev => ({ ...prev, oldPasskey: '' }));
		}
	};
	const handlePasskeyChange =
		(field: keyof PasskeyData) => (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;

			// Only allow numeric input for passkey
			if (field === 'passkey' || field === 'confirmPasskey') {
				const numericValue = value.replace(/\D/g, '').substring(0, 6);
				setPasskeyData(prev => ({
					...prev,
					[field]: numericValue,
				}));
			} else {
				setPasskeyData(prev => ({
					...prev,
					[field]: value,
				}));
			}

			// Clear passkey errors when user starts typing
			if (field in errors && errors[field as keyof FormErrors]) {
				setErrors(prev => ({ ...prev, [field]: '' }));
			}
		};

	const togglePasskeyVisibility = (
		field: 'showPasskey' | 'showConfirmPasskey'
	) => {
		setPasskeyData(prev => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	// Validate form
	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};
		const isPasskeySet = userProfile?.wallet?.passPinIsSet;

		// Validate passkey fields if provided
		if (passkeyData.passkey || passkeyData.confirmPasskey || oldPasskey) {
			// If passkey is already set, require old passkey for reset
			if (isPasskeySet) {
				if (!oldPasskey) {
					newErrors.oldPasskey = 'Current PIN is required';
				} else if (oldPasskey.length !== 6) {
					newErrors.oldPasskey = 'Current PIN must be 6 digits';
				}
			}

			if (!passkeyData.passkey) {
				newErrors.passkey = 'New PIN is required';
			} else if (passkeyData.passkey.length !== 6) {
				newErrors.passkey = 'New PIN must be 6 digits';
			}

			if (!passkeyData.confirmPasskey) {
				newErrors.confirmPasskey = 'Please confirm your new PIN';
			} else if (passkeyData.passkey !== passkeyData.confirmPasskey) {
				newErrors.confirmPasskey = 'PINs do not match';
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle save
	const handleSave = async () => {
		if (!validateForm()) {
			return;
		}

		// Only proceed if passkey fields are filled
		if (!passkeyData.passkey) {
			setErrorMessage('Please enter a PIN to save changes');
			return;
		}

		setIsLoading(true);
		setSuccessMessage('');
		setErrorMessage('');

		try {
			if (userProfile) {
				const passkeyPayload = {
					walletIdentifier: userProfile.wallet?.walletIdentifier,
					passPin: passkeyData.passkey,
					userId: userProfile.userId,
				};

				const [response, error] = await makeSetPasskeyRequest(passkeyPayload);

				if (error) {
					throw new Error(error.message || 'Failed to set PIN');
				}

				// Update user profile in localStorage to reflect passkey is now set
				const updatedProfile = {
					...userProfile,
					wallet: {
						...userProfile.wallet,
						passPinIsSet: true,
					},
				};

				localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
				setUserProfile(updatedProfile);

				const isReset = userProfile.wallet?.passPinIsSet;
				setSuccessMessage(
					isReset ? 'PIN reset successfully!' : 'PIN set successfully!'
				);

				// Clear passkey fields after successful save
				setPasskeyData({
					passkey: '',
					confirmPasskey: '',
					showPasskey: false,
					showConfirmPasskey: false,
				});
				setOldPasskey('');
				setShowOldPasskey(false);
			}
		} catch (error) {
			console.error('Save failed:', error);
			setErrorMessage(
				error instanceof Error ? error.message : 'Failed to save PIN'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setPasskeyData({
			passkey: '',
			confirmPasskey: '',
			showPasskey: false,
			showConfirmPasskey: false,
		});
		setOldPasskey('');
		setShowOldPasskey(false);
		setErrors({});
		setSuccessMessage('');
		setErrorMessage('');
	};

	return (
		<>
			<Box
				marginTop={2}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					minHeight: '80vh',
				}}
			>
				<Box>
					<Typography
						sx={{
							fontSize: '18px',
							fontWeight: '600',
							lineHeight: '28px',
							color: '#344054',
						}}
					>
						Personal Information
					</Typography>
					<Typography
						sx={{ fontSize: '14px', lineHeight: '20px', paddingTop: '5px' }}
					>
						Update your photo and personal details here.
					</Typography>
					<Divider sx={{ marginTop: '20px', color: '#475467' }} />

					{/* Success/Error Messages */}
					{successMessage && (
						<Alert
							severity="success"
							sx={{ mt: 2, mb: 2 }}
						>
							{successMessage}
						</Alert>
					)}
					{errorMessage && (
						<Alert
							severity="error"
							sx={{ mt: 2, mb: 2 }}
						>
							{errorMessage}
						</Alert>
					)}

					{/* Name Section */}
					<Box
						marginTop="24px"
						sx={{ width: { lg: '75%', xs: '100%' } }}
					>
						<Stack
							direction="row"
							sx={{
								display: 'flex',
								gap: '32px',
							}}
						>
							<Typography
								sx={{
									color: '#344054',
									fontWeight: '600',
									fontSize: '14px',
									flexBasis: '30%',
									flexGrow: 0,
								}}
							>
								Name
							</Typography>
							<Stack
								direction="row"
								sx={{
									display: 'flex',
									gap: '24px',
									flexBasis: { lg: '75%', xs: '100%' },
								}}
							>
								<TextField
									fullWidth
									value={formData.firstName}
									placeholder="First Name"
									InputProps={{
										readOnly: true,
										startAdornment: (
											<InputAdornment position="start">
												<PersonIcon />
											</InputAdornment>
										),
									}}
									sx={{
										fontSize: '16px',
										color: '#101828',
										'& .MuiOutlinedInput-root': {
											backgroundColor: '#f9f9f9',
											'& fieldset': {
												borderColor: '#D0D5DD',
											},
											'&:hover fieldset': {
												borderColor: '#D0D5DD',
											},
											'&.Mui-focused fieldset': {
												borderColor: '#D0D5DD',
											},
										},
									}}
								/>
								<TextField
									fullWidth
									value={formData.lastName}
									placeholder="Last Name"
									InputProps={{
										readOnly: true,
									}}
									sx={{
										fontSize: '16px',
										color: '#101828',
										'& .MuiOutlinedInput-root': {
											backgroundColor: '#f9f9f9',
											'& fieldset': {
												borderColor: '#D0D5DD',
											},
											'&:hover fieldset': {
												borderColor: '#D0D5DD',
											},
											'&.Mui-focused fieldset': {
												borderColor: '#D0D5DD',
											},
										},
									}}
								/>
							</Stack>
						</Stack>
					</Box>

					<Divider sx={{ marginTop: '20px', color: '#475467' }} />

					{/* Email Section */}
					<Box
						marginTop="24px"
						sx={{ width: { lg: '75%', xs: '100%' } }}
					>
						<Stack
							direction="row"
							sx={{
								display: 'flex',
								gap: '32px',
							}}
						>
							<Typography
								sx={{
									color: '#344054',
									fontWeight: '600',
									fontSize: '14px',
									flexBasis: '30%',
									flexGrow: 0,
								}}
							>
								Email Address
							</Typography>
							<Stack
								direction="row"
								sx={{ width: { lg: '75%', xs: '100%' } }}
							>
								<TextField
									fullWidth
									type="email"
									value={formData.email}
									placeholder="Enter email address"
									InputProps={{
										readOnly: true,
										startAdornment: (
											<InputAdornment position="start">
												<MailOutlineIcon />
											</InputAdornment>
										),
									}}
									sx={{
										fontSize: '16px',
										color: '#101828',
										'& .MuiOutlinedInput-root': {
											backgroundColor: '#f9f9f9',
											'& fieldset': {
												borderColor: '#D0D5DD',
											},
											'&:hover fieldset': {
												borderColor: '#D0D5DD',
											},
											'&.Mui-focused fieldset': {
												borderColor: '#D0D5DD',
											},
										},
									}}
								/>
							</Stack>
						</Stack>
					</Box>

					<Divider sx={{ marginTop: '20px', color: '#475467' }} />

					{/* Phone Number Section */}
					<Box
						marginTop="24px"
						sx={{ width: { lg: '75%', xs: '100%' } }}
					>
						<Stack
							direction="row"
							sx={{
								display: 'flex',
								gap: '32px',
							}}
						>
							<Typography
								sx={{
									color: '#344054',
									fontWeight: '600',
									fontSize: '14px',
									flexBasis: '30%',
									flexGrow: 0,
								}}
							>
								Phone Number
							</Typography>
							<Stack
								direction="row"
								sx={{ width: { lg: '75%', xs: '100%' } }}
							>
								<TextField
									fullWidth
									value={formData.phoneNumber}
									placeholder="Enter phone number"
									InputProps={{
										readOnly: true,
										startAdornment: (
											<InputAdornment position="start">
												<PhoneIcon />
											</InputAdornment>
										),
									}}
									sx={{
										fontSize: '16px',
										color: '#101828',
										'& .MuiOutlinedInput-root': {
											backgroundColor: '#f9f9f9',
											'& fieldset': {
												borderColor: '#D0D5DD',
											},
											'&:hover fieldset': {
												borderColor: '#D0D5DD',
											},
											'&.Mui-focused fieldset': {
												borderColor: '#D0D5DD',
											},
										},
									}}
								/>
							</Stack>
						</Stack>
					</Box>

					<Divider sx={{ marginTop: '20px', color: '#475467' }} />

					{/* Passkey Section */}
					<Box
						marginTop="24px"
						sx={{ width: { lg: '75%', xs: '100%' } }}
					>
						<Stack
							direction="row"
							sx={{
								display: 'flex',
								gap: '32px',
							}}
						>
							<Typography
								sx={{
									color: '#344054',
									fontWeight: '600',
									fontSize: '14px',
									flexBasis: '30%',
									flexGrow: 0,
								}}
							>
								{userProfile?.wallet?.passPinIsSet
									? 'Reset Wallet PIN'
									: 'Set Wallet PIN'}
							</Typography>
							<Stack
								direction="column"
								sx={{
									display: 'flex',
									gap: '16px',
									flexBasis: { lg: '75%', xs: '100%' },
								}}
							>
								{/* Current PIN Status */}
								{userProfile?.wallet?.passPinIsSet && (
									<Box sx={{ mb: 1 }}>
										<Typography
											variant="body2"
											sx={{ color: '#059669', fontSize: '12px' }}
										>
											✓ Wallet PIN is currently set
										</Typography>
									</Box>
								)}

								{/* Old PIN field - only show if PIN is already set */}
								{userProfile?.wallet?.passPinIsSet && (
									<TextField
										fullWidth
										type={showOldPasskey ? 'text' : 'password'}
										value={oldPasskey}
										onChange={handleOldPasskeyChange}
										placeholder="Enter current PIN"
										error={!!errors.oldPasskey}
										helperText={
											errors.oldPasskey || 'Enter your current 6-digit PIN'
										}
										inputProps={{
											maxLength: 6,
											inputMode: 'numeric',
											pattern: '[0-9]*',
										}}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<LockIcon />
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														onClick={() => setShowOldPasskey(!showOldPasskey)}
														edge="end"
													>
														{showOldPasskey ? (
															<VisibilityOffIcon />
														) : (
															<VisibilityIcon />
														)}
													</IconButton>
												</InputAdornment>
											),
										}}
										sx={{
											fontSize: '16px',
											color: '#101828',
											'& .MuiOutlinedInput-root': {
												'& fieldset': {
													borderColor: '#D0D5DD',
												},
												'&:hover fieldset': {
													borderColor: '#D0D5DD',
												},
												'&.Mui-focused fieldset': {
													borderColor: '#D0D5DD',
												},
											},
										}}
									/>
								)}

								{/* New PIN */}
								<TextField
									fullWidth
									type={passkeyData.showPasskey ? 'text' : 'password'}
									value={passkeyData.passkey}
									onChange={handlePasskeyChange('passkey')}
									placeholder={
										userProfile?.wallet?.passPinIsSet
											? 'Enter new 6-digit PIN'
											: 'Enter 6-digit PIN'
									}
									error={!!errors.passkey}
									helperText={
										errors.passkey ||
										(userProfile?.wallet?.passPinIsSet
											? 'Enter your new 6-digit PIN'
											: 'Create a 6-digit PIN for wallet transactions')
									}
									inputProps={{
										maxLength: 6,
										inputMode: 'numeric',
										pattern: '[0-9]*',
									}}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<LockIcon />
											</InputAdornment>
										),
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													onClick={() => togglePasskeyVisibility('showPasskey')}
													edge="end"
												>
													{passkeyData.showPasskey ? (
														<VisibilityOffIcon />
													) : (
														<VisibilityIcon />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
									sx={{
										fontSize: '16px',
										color: '#101828',
										'& .MuiOutlinedInput-root': {
											'& fieldset': {
												borderColor: '#D0D5DD',
											},
											'&:hover fieldset': {
												borderColor: '#D0D5DD',
											},
											'&.Mui-focused fieldset': {
												borderColor: '#D0D5DD',
											},
										},
									}}
								/>

								{/* Confirm New PIN */}
								<TextField
									fullWidth
									type={passkeyData.showConfirmPasskey ? 'text' : 'password'}
									value={passkeyData.confirmPasskey}
									onChange={handlePasskeyChange('confirmPasskey')}
									placeholder={
										userProfile?.wallet?.passPinIsSet
											? 'Confirm new 6-digit PIN'
											: 'Confirm 6-digit PIN'
									}
									error={!!errors.confirmPasskey}
									helperText={errors.confirmPasskey}
									inputProps={{
										maxLength: 6,
										inputMode: 'numeric',
										pattern: '[0-9]*',
									}}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<LockIcon />
											</InputAdornment>
										),
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													onClick={() =>
														togglePasskeyVisibility('showConfirmPasskey')
													}
													edge="end"
												>
													{passkeyData.showConfirmPasskey ? (
														<VisibilityOffIcon />
													) : (
														<VisibilityIcon />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
									sx={{
										fontSize: '16px',
										color: '#101828',
										'& .MuiOutlinedInput-root': {
											'& fieldset': {
												borderColor: '#D0D5DD',
											},
											'&:hover fieldset': {
												borderColor: '#D0D5DD',
											},
											'&.Mui-focused fieldset': {
												borderColor: '#D0D5DD',
											},
										},
									}}
								/>
							</Stack>
						</Stack>
					</Box>

					<Divider sx={{ marginTop: '20px', color: '#475467' }} />
				</Box>

				{/* Action Buttons */}
				<Box>
					<Divider sx={{ marginTop: '20px', color: '#475467' }} />
					<Box sx={{ display: 'flex', gap: '24px', marginTop: '2rem' }}>
						<Button
							variant="outlined"
							onClick={handleCancel}
							disabled={isLoading}
							sx={{
								backgroundColor: '#ffffff',
								color: '#000000',
								boxShadow: 'none',
								'&:hover': {
									backgroundColor: '#ffffff',
									boxShadow: 'none',
								},
							}}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							onClick={handleSave}
							disabled={isLoading}
							sx={{
								backgroundColor: '#AAC645',
								color: '#ffffff',
								'&:hover': { backgroundColor: '#92A837' },
								'&:disabled': {
									backgroundColor: '#cccccc',
									color: '#666666',
								},
							}}
						>
							{isLoading ? (
								<>
									<CircularProgress
										size={20}
										sx={{ mr: 1 }}
									/>
									Saving...
								</>
							) : (
								'Save'
							)}
						</Button>
					</Box>
				</Box>
			</Box>
		</>
	);
}
