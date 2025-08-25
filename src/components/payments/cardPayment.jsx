import React from 'react';
import {
	DialogTitle,
	DialogContent,
	Button,
	Typography,
	Box,
	TextField,
} from '@mui/material';

export default function CardPayment({
	handleCloseModal,
	handleCardDetailChange,
	cardDetails,
	setCurrentStage,
	handleSubmitPayment,
	amount,
}) {
	return (
		<div>
			<DialogTitle>
				<Typography
					variant="h6"
					fontWeight="medium"
				>
					Enter Card Details
				</Typography>
			</DialogTitle>

			<DialogContent>
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
							onClick={handleSubmitPayment}
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
							Pay ₦{amount}
						</Button>
					</Box>
				</Box>
			</DialogContent>
		</div>
	);
}
