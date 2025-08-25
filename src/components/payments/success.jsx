import React from 'react';
import { DialogContent, Box, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Success({ handleCloseModal }) {
	return (
		<DialogContent sx={{ p: 0 }}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					p: 4,
					textAlign: 'center',
				}}
			>
				{/* Animated checkmark */}
				<CheckCircleIcon
					sx={{
						color: 'primary.main', // Same as the Done button
						fontSize: 80,
						mb: 3,
						animation: 'pulse 1.5s ease-in-out infinite',
						'@keyframes pulse': {
							'0%': { transform: 'scale(1)' },
							'50%': { transform: 'scale(1.05)' },
							'100%': { transform: 'scale(1)' },
						},
					}}
				/>

				{/* Success message */}
				<Typography
					variant="h5"
					gutterBottom
					sx={{
						fontWeight: 600,
						mb: 2,
					}}
				>
					Transaction Successful!
				</Typography>

				<Typography
					variant="body1"
					sx={{
						color: 'text.secondary',
						mb: 4,
					}}
				>
					Your transaction was completed successfully.
				</Typography>

				{/* Done button */}
				<Button
					onClick={handleCloseModal}
					variant="contained"
					fullWidth
					sx={{
						py: 1.5,
						backgroundColor: 'primary.main',
						color: '#ffffff',
						fontWeight: 600,
						'&:hover': {
							backgroundColor: 'primary.dark',
						},
					}}
				>
					Done
				</Button>
			</Box>
		</DialogContent>
	);
}
