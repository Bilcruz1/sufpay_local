import React from 'react';
// import { useState } from 'react';
import {
	DialogContent,
	DialogTitle,
	Box,
	Typography,
	IconButton,
	Button,
} from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';

export default function BankTransfer({
	setCurrentStage,
	handleCopyToClipboard,
	transferDetails,
	handleConfirmTransferPayment,
}) {
	const [isExpired, setIsExpired] = useState(false);
	const [timeLeft, setTimeLeft] = useState(null);
	return (
		<div>
			<DialogTitle>
				<Typography
					variant="h6"
					fontWeight="medium"
				>
					Transfer Details
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
							Transfer to the account details below:
						</Typography>

						<Box sx={{ mb: 2 }}>
							<Typography
								variant="body1"
								fontWeight="bold"
							>
								Amount: ₦{transferDetails.amount}
							</Typography>
						</Box>

						<Box sx={{ mb: 2 }}>
							<Typography variant="body1">
								Bank: {transferDetails.bankName}
							</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Typography variant="body1">
									Account Number: {transferDetails.accountNumber}
								</Typography>
								<IconButton
									size="small"
									onClick={() =>
										handleCopyToClipboard(transferDetails.accountNumber)
									}
								>
									<ContentCopyIcon fontSize="small" />
								</IconButton>
							</Box>
							<Typography variant="body1">
								Account Name: {transferDetails.accountName}
							</Typography>
							<Typography variant="body1">
								Reference: {transferDetails.reference}
							</Typography>
						</Box>

						{timeLeft !== null && (
							<Box
								sx={{
									mt: 2,
									p: 1,
									backgroundColor: isExpired ? '#ffebee' : '#e8f5e9',
									borderRadius: 1,
								}}
							>
								<Typography
									variant="body1"
									fontWeight="bold"
									color={isExpired ? 'error' : 'success'}
								>
									{isExpired ? (
										'EXPIRED! Please initiate a new transfer'
									) : (
										<>
											Expires in: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
										</>
									)}
								</Typography>
								{isExpired && (
									<Typography
										variant="body2"
										sx={{ mt: 1 }}
									>
										These account details are no longer valid
									</Typography>
								)}
							</Box>
						)}
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
							onClick={handleConfirmTransferPayment}
							variant="contained"
							disabled={isExpired}
							sx={{
								px: 3,
								py: 1,
								backgroundColor: isExpired ? '#cccccc' : '#AAC645',
								color: '#ffffff',
								'&:hover': {
									backgroundColor: isExpired ? '#cccccc' : '#92A837',
								},
							}}
						>
							{isExpired ? 'Transfer Expired' : 'I have made the transfer'}
						</Button>
					</Box>
				</Box>
			</DialogContent>
		</div>
	);
}
