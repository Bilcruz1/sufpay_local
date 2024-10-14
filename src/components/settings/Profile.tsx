import {
	Box,
	Divider,
	Stack,
	TextField,
	Typography,
	InputAdornment,
	Avatar,
	Button,
} from '@mui/material';
import React, { useState } from 'react';
import file_upload_icon from '../../assets/icons/file_upload_ icon.svg';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CountryFlagSelector from './CountryFlag';

export default function Profile() {
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			const fileUrl = URL.createObjectURL(file);
			setImageUrl(fileUrl);
		}
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
									defaultValue="Hassan"
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
								<TextField
									fullWidth
									defaultValue="Garba"
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
									defaultValue="hassan@example.com"
									InputProps={{
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
					<Box
						marginTop="24px"
						sx={{ width: { lg: '75%', xs: '100%' } }}
					>
						<Stack
							direction="row"
							sx={{
								display: 'flex',
								flexDirection: { lg: 'row', xs: 'column' },
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
								Your Photo
								<Typography sx={{ fontSize: '14px' }}>
									{' '}
									This will be displayed on your profile.
								</Typography>
							</Typography>
							<Stack
								direction="row"
								sx={{
									width: { lg: '75%', xs: '100%' },
									display: 'flex',
									gap: '24px',
								}}
							>
								{imageUrl && (
									<Avatar
										alt="Uploaded Image"
										src={imageUrl}
										sx={{ width: 56, height: 56 }}
									/>
								)}
								<Box
									sx={{
										border: '1px solid #D0D5DD',
										borderRadius: '8px',
										padding: '20px',
										textAlign: 'center',
										cursor: 'pointer',
										width: '100%',
										transition: 'background-color 0.3s',
										'&:hover': {
											backgroundColor: '#F3F4F6',
										},
									}}
								>
									{/* File input (hidden) */}
									<input
										accept="image/*"
										style={{ display: 'none' }}
										id="upload-file"
										type="file"
										onChange={handleFileChange}
									/>

									{/* Label for the cloud upload icon button, linked to the hidden input */}
									<label htmlFor="upload-file">
										<Stack
											direction="column"
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: '1rem',
											}}
										>
											<Box
												sx={{
													fontSize: '48px',
													color: '#98A2B3',
													marginBottom: '8px',
												}}
											>
												<img
													src={file_upload_icon}
													alt={file_upload_icon}
												/>
											</Box>

											{/* Display avatar with the uploaded image */}

											<Stack
												direction="row"
												sx={{ justifyContent: 'center', gap: '5px' }}
											>
												<Typography
													sx={{
														color: '#AAC645',
														fontWeight: '600',
														fontSize: '16px',
													}}
												>
													Click to upload
												</Typography>
												<Typography
													sx={{
														color: '#667085',
														fontSize: '14px',
													}}
												>
													or drag and drop
												</Typography>
											</Stack>

											<Typography
												sx={{
													color: '#98A2B3',
													fontSize: '14px',
													marginTop: '8px',
												}}
											>
												SVG, PNG, JPG or GIF (max. 800×400px)
											</Typography>
										</Stack>
									</label>
								</Box>
							</Stack>
						</Stack>
					</Box>
					<Divider sx={{ marginTop: '20px', color: '#475467' }} />
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
								Country
							</Typography>
							<Stack
								direction="row"
								sx={{ width: '75%', height: '2.75rem' }}
							>
								<CountryFlagSelector />
							</Stack>
						</Stack>
					</Box>
				</Box>
				<Box>
					<Divider sx={{ marginTop: '20px', color: '#475467' }} />
					<Box sx={{ display: 'flex', gap: '24px', marginTop: '2rem' }}>
						<Button
							variant="outlined"
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
						<Button variant="contained">Save</Button>
					</Box>
				</Box>
			</Box>
		</>
	);
}
