import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Typography,
	CircularProgress,
} from '@mui/material';

interface PasskeyModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (passkey: string) => void;
	error?: string;
	loading?: boolean;
}

const PasskeyModal: React.FC<PasskeyModalProps> = ({
	open,
	onClose,
	onSubmit,
	error,
	loading = false,
}) => {
	const [passkey, setPasskey] = useState('');

	const handleSubmit = () => {
		if (passkey.length !== 6) {
			return;
		}
		onSubmit(passkey);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, '').substring(0, 6);
		setPasskey(value);
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="xs"
			fullWidth
		>
			<DialogTitle>Enter Passkey</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 1 }}>
					<Typography
						variant="body2"
						sx={{ mb: 2 }}
					>
						Please enter your 6-digit passkey to complete the transaction.
					</Typography>
					<TextField
						fullWidth
						label="Passkey"
						type="password"
						value={passkey}
						onChange={handleChange}
						error={!!error}
						helperText={error}
						inputProps={{
							maxLength: 6,
							inputMode: 'numeric',
							pattern: '[0-9]*',
						}}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onClose}
					disabled={loading}
				>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant="contained"
					disabled={passkey.length !== 6 || loading}
				>
					{loading ? <CircularProgress size={24} /> : 'Confirm Payment'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PasskeyModal;
