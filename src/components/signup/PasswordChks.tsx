import { Box, Grid, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React, { FC, useEffect } from 'react';

const passwordChecks = [
	{
		label: 'At least 8 characters',
		validate: (password: string) => password.length >= 8,
		key: 'charCountChk',
	},
	{
		label: 'One uppercase letter',
		validate: (password: string) => /[A-Z]/.test(password),
		key: 'upperCaseChk',
	},
	{
		label: 'One lowercase letter',
		validate: (password: string) => /[a-z]/.test(password),
		key: 'lowerCaseChk',
	},
	{
		label: 'One number',
		validate: (password: string) => /[0-9]/.test(password),
		key: 'oneNumberChk',
	},
	{
		label: 'One special character',
		validate: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
		key: 'specialCaseChk',
	},
];

interface PasswordString {
	password: string;
	onValidationChange?: (isValid: boolean) => void;
}

const PasswordChks: FC<PasswordString> = React.memo(
	({ password, onValidationChange }) => {
		// Calculate validation status for all checks
		const allChecksValid = passwordChecks.every(check =>
			check.validate(password)
		);

		// Notify parent component when validation status changes
		useEffect(() => {
			if (onValidationChange) {
				onValidationChange(allChecksValid);
			}
		}, [allChecksValid, onValidationChange]);

		return (
			<Box
				display={{ xs: 'none', md: 'block' }}
				textAlign={'left'}
				color={'#666666'}
			>
				<Grid
					container
					rowSpacing={1}
					columnSpacing={{ xs: 1, sm: 2, md: 2, lg: 3 }}
				>
					{passwordChecks.map((check, ind) => (
						<Grid
							key={ind}
							item
							xs={4}
							sx={{ flexWrap: 'wrap' }}
						>
							{check.validate(password) ? (
								<CheckCircleIcon
									sx={{ color: '#4caf50', width: '12px', height: '12px' }}
								/>
							) : (
								<CircleIcon
									sx={{ color: '#666666', width: '10px', height: '10px' }}
								/>
							)}
							<Typography
								ml={2}
								component={'span'}
								sx={{ fontSize: '12px' }}
							>
								{check.label}
							</Typography>
						</Grid>
					))}
				</Grid>
			</Box>
		);
	}
);

export default PasswordChks;
