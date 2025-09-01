import React from 'react';
import { DialogContent, Box, Typography, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export default function Failed({ setPaymentStatus }) {
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
				<ErrorIcon
					sx={{
						color: 'error.main',
						fontSize: 80,
						mb: 3,
						animation: 'shake 0.5s ease-in-out',
						'@keyframes shake': {
							'0%, 100%': { transform: 'translateX(0)' },
							'20%, 60%': { transform: 'translateX(-5px)' },
							'40%, 80%': { transform: 'translateX(5px)' },
						},
					}}
				/>

				{/* Error message */}
				<Typography
					variant="h5"
					gutterBottom
					sx={{
						fontWeight: 600,
						mb: 2,
					}}
				>
					Payment Failed
				</Typography>

				<Typography
					variant="body1"
					sx={{
						color: 'text.secondary',
						mb: 4,
					}}
				>
					There was an issue processing your payment. Please try again.
				</Typography>

				<Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
					<Button
						onClick={() => setPaymentStatus('idle')}
						variant="outlined"
						fullWidth
						sx={{
							py: 1.5,
							fontWeight: 600,
							color: '#4d4d4d',
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={() => setPaymentStatus('idle')}
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
						Try Again
					</Button>
				</Box>
			</Box>
		</DialogContent>
	);
}
