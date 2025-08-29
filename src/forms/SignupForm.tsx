import { Box, Button, Link, Stack, InputLabel } from '@mui/material';
import React, { useState, useEffect } from 'react';
import {
	InputFeild,
	Loading,
	PasswordChks,
	PasswordInputFeild,
	PhoneNumberField,
} from '../components';
import { IResponse } from '../utils/interfaces';
import {
	register,
	verifyEmailUniqueness,
	verifyPhoneNumberUniqueness,
	signupRequest,
} from '../Apis/onBoardingApi';
import { signupFormDataSchema } from './schema';
import { useNavigate } from 'react-router-dom';
import { StatusCode, UserType } from '../utils/enums';
import useNotification from '../utils/hooks/useNotification';

interface IForm {
	firstName: string;
	lastName: string;
	countryCode: string;
	phoneNumber: string;
	password: string;
	email: string;
	userType: UserType;
}

interface IProps {
	btnDisabled: boolean;
	setBtnDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupForm: React.FC<IProps> = ({ btnDisabled, setBtnDisabled }) => {
	const [formData, setFormData] = useState<IForm>({
		firstName: '',
		lastName: '',
		countryCode: '+234',
		phoneNumber: '',
		password: '',
		email: '',
		userType: UserType.User,
	});
	const navigate = useNavigate();

	const [formErrors, setFormErrors] = useState({
		firstName: '',
		lastName: '',
		countryCode: '',
		phoneNumber: '',
		password: '',
		email: '',
	});

	// Add state to track password validation
	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { showSuccessNotification, showErrorNotification } = useNotification();

	// Check if form is valid for submission
	const isFormValid = () => {
		// Check if phone number is numeric and has at least 11 digits
		const isPhoneValid =
			/^\d+$/.test(formData.phoneNumber) && formData.phoneNumber.length >= 11;

		return (
			formData.firstName.trim() !== '' &&
			formData.lastName.trim() !== '' &&
			formData.email.trim() !== '' &&
			formData.phoneNumber.trim() !== '' &&
			isPhoneValid && // Add phone number validation
			formData.password.trim() !== '' &&
			isPasswordValid &&
			Object.values(formErrors).every(error => error === '')
		);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		// For phone number field, only allow numeric input and validate
		if (name === 'phoneNumber') {
			// Allow only numbers
			const numericValue = value.replace(/\D/g, '');
			setFormData(prev => ({ ...prev, [name]: numericValue }));

			// Validate phone number in real-time
			if (numericValue && !/^\d+$/.test(numericValue)) {
				setFormErrors(prev => ({
					...prev,
					phoneNumber: 'Phone number must contain only numbers',
				}));
			} else if (numericValue && numericValue.length < 11) {
				setFormErrors(prev => ({
					...prev,
					phoneNumber: 'Phone number must be at least 11 digits',
				}));
			} else {
				setFormErrors(prev => ({ ...prev, phoneNumber: '' }));
			}
		} else {
			setFormData(prev => ({ ...prev, [name]: value }));

			// Clear error when user starts typing
			if (formErrors[name as keyof typeof formErrors]) {
				setFormErrors(prev => ({ ...prev, [name]: '' }));
			}
		}
	};

	const handleBlur = async (e: string) => {
		if (e === 'email' && formData.email.length >= 3) {
			try {
				const result: IResponse = await verifyEmailUniqueness({
					email: formData.email,
				});
				if (result.data?.data === false) {
					setFormErrors(prev => ({ ...prev, email: 'Email already exists' }));
				} else {
					setFormErrors(prev => ({ ...prev, email: '' }));
				}
			} catch (error) {
				console.error('Email validation error:', error);
			}
		}
		if (e === 'phoneNumber' && formData.phoneNumber.length >= 3) {
			// First validate phone number format
			if (!/^\d+$/.test(formData.phoneNumber)) {
				setFormErrors(prev => ({
					...prev,
					phoneNumber: 'Phone number must contain only numbers',
				}));
				return;
			}

			if (formData.phoneNumber.length < 11) {
				setFormErrors(prev => ({
					...prev,
					phoneNumber: 'Phone number must be at least 11 digits',
				}));
				return;
			}

			// Only check uniqueness if the phone number is valid
			try {
				setFormErrors(prev => ({ ...prev, phoneNumber: '' }));
				const result: IResponse = await verifyPhoneNumberUniqueness({
					phoneNumber: formData.phoneNumber,
				});
				if (result.data?.data === false) {
					setFormErrors(prev => ({
						...prev,
						phoneNumber: 'Phone number already exists',
					}));
				}
			} catch (error) {
				console.error('Phone validation error:', error);
			}
		}
	};

	// form submission
	const submitForm = async () => {
		// Only proceed if form is valid
		if (!isFormValid()) {
			// Check specifically for phone number validation to show appropriate error
			if (!/^\d+$/.test(formData.phoneNumber)) {
				setFormErrors(prev => ({
					...prev,
					phoneNumber: 'Phone number must contain only numbers',
				}));
			} else if (formData.phoneNumber.length < 11) {
				setFormErrors(prev => ({
					...prev,
					phoneNumber: 'Phone number must be at least 11 digits',
				}));
			}

			showErrorNotification('Please fix all form errors before submitting');
			return;
		}

		setIsSubmitting(true);
		setBtnDisabled(true);

		setFormErrors(prev => ({
			firstName: '',
			lastName: '',
			countryCode: '',
			phoneNumber: '',
			password: '',
			email: '',
		}));

		const validationResult = signupFormDataSchema.safeParse(formData);

		if (!validationResult.success) {
			validationResult.error.errors.forEach(error => {
				setFormErrors(prev => ({ ...prev, [error.path[0]]: error.message }));
			});
			showErrorNotification('Please fill all fields correctly');
			setIsSubmitting(false);
			setBtnDisabled(false);
			return;
		}

		try {
			const response: IResponse = await register({
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				countryCode: formData.countryCode,
				phoneNumber: formData.countryCode + formData.phoneNumber,
				password: formData.password,
				userType: formData.userType,
			});

			console.log(response);

			if (response.data?.statusCode === StatusCode.duplicateRequest) {
				showErrorNotification('Email or Phone number has already been used');
				setIsSubmitting(false);
				setBtnDisabled(false);
			} else if (response.data?.statusCode === StatusCode.badRequest) {
				showErrorNotification('Bad request please contact support');
				setIsSubmitting(false);
				setBtnDisabled(false);
			} else if (response.data?.statusCode === StatusCode.internalServerError) {
				showErrorNotification();
				setIsSubmitting(false);
				setBtnDisabled(false);
			} else {
				navigate(`/verify-account/${response.data.data}`, {
					replace: true,
				});
				showSuccessNotification();
				setIsSubmitting(false);
				setBtnDisabled(false);
			}
		} catch (err) {
			console.error('Registration error:', err);
			showErrorNotification();
			setIsSubmitting(false);
			setBtnDisabled(false);
		}
	};

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
				}}
				gap={2}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
					}}
					gap={2}
				>
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						spacing={2}
					>
						<InputFeild
							name={'firstName'}
							value={formData.firstName || ''}
							handleChange={handleChange}
							label={'First name'}
							error={formErrors.firstName}
						/>
						<InputFeild
							name={'lastName'}
							value={formData.lastName}
							handleChange={handleChange}
							label={'Last name'}
							error={formErrors.lastName}
						/>
					</Stack>
					<InputFeild
						name={'email'}
						value={formData.email}
						handleChange={handleChange}
						label={'Email'}
						error={formErrors.email}
						handdleBlur={() => handleBlur('email')}
					/>
					<PhoneNumberField
						countryCode={formData.countryCode}
						phoneNumber={formData.phoneNumber}
						handleChange={handleChange}
						name={'phoneNumber'}
						label={'Phone number'}
						handdleBlur={() => handleBlur('phoneNumber')}
						error={formErrors.phoneNumber}
					/>
					<PasswordInputFeild
						name={'password'}
						value={formData.password}
						handleChange={handleChange}
						label={'Password'}
						error={formErrors.password}
					/>
					<PasswordChks
						password={formData.password}
						onValidationChange={setIsPasswordValid}
					/>
				</Box>

				<Stack
					direction={'column'}
					gap={2}
					mt={4}
				>
					<InputLabel component={'span'}>
						By creating an account, you agree to the <Link>Terms of use</Link>{' '}
						and <Link>Privacy Policy.</Link>
					</InputLabel>

					<Button
						sx={{
							background: '#aac645',
							borderRadius: '1rem',
							'&:disabled': {
								background: '#cccccc',
								color: '#666666',
							},
						}}
						variant="contained"
						onClick={submitForm}
						size={'large'}
						disabled={btnDisabled || !isFormValid()}
					>
						{isSubmitting ? 'Creating account...' : 'Create an account'}
					</Button>
					<InputLabel sx={{ textAlign: 'center' }}>
						Already have an account? Log in{' '}
						<Link onClick={() => navigate('/login')}>Login</Link>
					</InputLabel>
				</Stack>
			</Box>
		</>
	);
};

export default SignupForm;
