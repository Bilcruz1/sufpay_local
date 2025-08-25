import { Box, Button, Link, Stack, InputLabel } from '@mui/material';
import React, { useState } from 'react';
import {
	InputFeild,
	Loading,
	PasswordChks,
	PasswordInputFeild,
	PhoneNumberField,
} from '../components';
// import CountryCodePhoneNumberField from "./CountryCodePhoneNumberField";
// import googleImg from "../assets/img/google_img.svg";
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
	// const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
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

	const { showSuccessNotification, showErrorNotification } = useNotification();

	// const [passwordChecks, setPasswordChecks] = useState<IPasswordChkProps>({
	//   charCountChk: false,
	//   lowerCaseChk: false,
	//   upperCaseChk: false,
	//   specialCaseChk: false,
	//   OneNumberChk: false,
	// });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleBlur = async (e: string) => {
		if (e === 'email' && formData.email.length >= 3) {
			setFormErrors(prev => ({ ...prev, email: '' }));
			const result: IResponse = await verifyEmailUniqueness({
				email: formData.email,
			});
			if (result.data?.data === false) {
				setFormErrors(prev => ({ ...prev, email: 'Email already exists' }));
			}
		}
		if (e === 'phoneNumber' && formData.phoneNumber.length >= 3) {
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
		}
	};

	// form submission
	const submitForm = async () => {
		setBtnDisabled(prev => true);
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
				setBtnDisabled(false);
			});
			showErrorNotification('Please fill all fields correctly');
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
				// alert the user to the fail
				showErrorNotification('Email or Phone number has already been used');
				setBtnDisabled(prev => false);
			} else if (response.data?.statusCode === StatusCode.badRequest) {
				showErrorNotification('Bad request please contact surport');
				setBtnDisabled(prev => false);
			} else if (response.data?.statusCode === StatusCode.internalServerError) {
				showErrorNotification();
				setBtnDisabled(prev => false);
			}

			navigate(`/verify-account/${response.data.data}`, {
				replace: true,
			});
			showSuccessNotification();
			setBtnDisabled(prev => false);
			return;
		} catch (err) {
			// console.log(err);
			showErrorNotification();
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
						// handleCountryCodeChange={handleCountryCodeChange}
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
					<PasswordChks password={formData.password} />
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
						}}
						variant="contained"
						onClick={submitForm}
						size={'large'}
						disabled={btnDisabled}
					>
						Create an account
					</Button>
					<InputLabel sx={{ textAlign: 'center' }}>
						Already have an ccount? Log in{' '}
						<Link onClick={() => navigate('/login')}>Login</Link>
					</InputLabel>
				</Stack>
			</Box>
		</>
	);
};

export default SignupForm;
