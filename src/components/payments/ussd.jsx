import React, { useEffect, useState } from 'react';
import {
	DialogTitle,
	Button,
	Typography,
	Box,
	IconButton,
	DialogContent,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function USSD({
	handleCloseModal,
	setCurrentStage,
	handleCopyToClipboard,
	ussdCode,
	timeLeft,
	setIsExpired,
}) {
	const [timer, setTimer] = useState(timeLeft || 300);

	useEffect(() => {
		if (!timer || timer <= 0) {
			setIsExpired(true);
			return;
		}

		const interval = setInterval(() => {
			setTimer(prev => prev - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [timer, setIsExpired]);

	const formatTime = seconds => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs
			.toString()
			.padStart(2, '0')}`;
	};

	return (
		<div>
			<DialogTitle>
				<Typography
					variant="h6"
					fontWeight="medium"
				>
					USSD Payment Instructions
				</Typography>
			</DialogTitle>

			<DialogContent>
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
							Dial the following USSD code on your phone:
						</Typography>

						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 1,
								my: 2,
								p: 2,
								backgroundColor: '#ffffff',
								borderRadius: 1,
								border: '1px solid #e0e0e0',
							}}
						>
							<Typography
								variant="h6"
								sx={{ textAlign: 'center' }}
							>
								<strong>{ussdCode}</strong>
							</Typography>
							<IconButton onClick={() => handleCopyToClipboard(ussdCode)}>
								<ContentCopyIcon />
							</IconButton>
						</Box>

						<Box
							sx={{
								mt: 2,
								p: 1,
								backgroundColor: '#e8f5e9',
								borderRadius: 1,
								textAlign: 'center',
							}}
						>
							<Typography
								variant="body1"
								fontWeight="bold"
								color="success.main"
							>
								Expires in: {formatTime(timer)}
							</Typography>
							<Typography
								variant="body2"
								sx={{ mt: 1 }}
							>
								Complete the transaction on your phone within this time
							</Typography>
						</Box>

						<Typography
							variant="body2"
							sx={{ mt: 2 }}
						>
							Follow the prompts on your phone to complete the payment.
						</Typography>
					</Box>

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
							I've completed the payment
						</Button>
					</Box>
				</Box>
			</DialogContent>
		</div>
	);
}
