import {
	Box,
	Button,
	CircularProgress,
	Divider,
	InputLabel,
	Link,
	Stack,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';
import googleImg from '../assets/img/google_img.svg';
import { InputFeild, PasswordInputFeild } from '../components';
import { formDataSchema } from './schema';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserProfile } from '../Apis/card-payment';
import { IResponse } from '../utils/interfaces';
import { storage_keys } from '../client';
import jwtDecode from 'jwt-decode';

import { Loading } from '../components';
import { loginUser, loginRequest } from '../Apis/onBoardingApi';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '../hooks/use-request';
import { ILogin } from '../Apis/requestInterface';
import AuthContext from '../context/auth-context';
import useNotification from '../utils/hooks/useNotification';

interface IFormData {
	credentials: string;
	password: string;
}

const LoginForm: React.FC = () => {
	const [formData, setFormData] = useState<IFormData>({
		credentials: '',
		password: '',
	});
	const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

	const [error, setErrors] = useState<IFormData>({
		credentials: '',
		password: '',
	});
	const {
		showSuccessNotification,
		showErrorNotification,
		showWarningNotification,
	} = useNotification();
	//api call for login
	const { isLoading, makeRequest } = useRequest<ILogin>(loginRequest);
	//api call for getUserProfile
	const userProfileRequest = useRequest(getUserProfile);
	const { login } = AuthContext.useContainer();

	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};
	const parseJwt = (token: string) => {
		try {
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split('')
					.map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
					.join('')
			);
			return JSON.parse(jsonPayload);
		} catch (error) {
			console.error('Invalid JWT:', error);
			return null;
		}
	};

	const fetchProfile = async (id: string) => {
		const [response, error] = await userProfileRequest.makeRequest({
			id,
		});

		if (error) {
			console.log(error);
			throw new Error(error);
		}

		localStorage.setItem('userProfile', JSON.stringify(response.data));
	};

	const submitForm = async () => {
		setBtnDisabled(true);
		setErrors({ credentials: '', password: '' });

		const validationResult = formDataSchema.safeParse(formData);

		if (!validationResult.success) {
			validationResult.error.errors.forEach(el => {
				setErrors(prev => ({ ...prev, [el.path[0]]: el.message }));
				toast.error(el.message);
			});
			setBtnDisabled(false);
			return;
		}

		try {
			const [response, error] = await makeRequest({
				emailAddress: formData.credentials,
				password: formData.password,
			});

			if (response.message === 'Login successful') {
				const userToken = response.data.userToken;

				// Decode the JWT
				const decodedToken = parseJwt(userToken);

				if (decodedToken) {
					// Save the token and user info in local storage
					localStorage.setItem('jwt-token', userToken);
					localStorage.setItem(
						'refresh-token',
						response.data.refreshToken.refreshAccessToken
					);
					localStorage.setItem('userId', decodedToken.userId);
					localStorage.setItem('email', decodedToken.emailAddress);
					localStorage.setItem(
						'phoneNumber',
						JSON.stringify(decodedToken.phoneNumber)
					); // Save array as JSON
					localStorage.setItem('firstName', decodedToken.firstName);
					localStorage.setItem('lastName', decodedToken.lastName);

					console.log('User info:', decodedToken);

					// Trigger login and navigate

					fetchProfile(decodedToken.userId);
					login();
					navigate('/dashboard');
				} else {
					console.error('Failed to decode token');
				}
			} else {
				// toast.error(response.message);

				showErrorNotification(response.message);
			}
		} catch (err) {
			toast.error(`Login error: ${error}`);
		}
	};

	return (
		<Box>
			<ToastContainer
				position="top-center"
				autoClose={5000}
			/>
			<Box
				sx={{
					display: 'flex',
					justifyContent: { xs: 'space-between', md: 'center' },
					flexDirection: 'column',
					minHeight: { xs: '70vh' },
				}}
				gap={2}
			>
				<Stack
					direction={'column'}
					gap={2}
				>
					<InputFeild
						name={'credentials'}
						label={'Phone number or email address'}
						value={formData.credentials}
						handleChange={handleChange}
						error={error.credentials}
					/>

					{/* password */}
					<PasswordInputFeild
						name={'password'}
						label={'Your password'}
						value={formData.password}
						handleChange={handleChange}
						error={error.password}
					/>

					<Box
						textAlign={'end'}
						mt={-1}
					>
						<Link onClick={() => navigate('/forget-password')}>
							Forget your password?
						</Link>
					</Box>
					{/* <Loading isLoading={isLoading} /> */}
				</Stack>

				{/* buttom half */}
				<Stack
					direction={'column'}
					gap={2}
				>
					<Button
						sx={{
							background: '#aac645',
							borderRadius: '1rem',
						}}
						disabled={isLoading}
						variant="contained"
						onClick={submitForm}
						size={'large'}
					>
						{/* {isLoading ? 'Loading...' : 'Sign in'} */}
						{isLoading ? (
							<CircularProgress
								size={24}
								sx={{ color: '#fff' }}
							/>
						) : (
							'Login'
						)}
					</Button>
					<InputLabel sx={{ textAlign: 'center' }}>
						Don't have an account?{' '}
						<Link onClick={() => navigate('/signup')}>Sign up</Link>
					</InputLabel>

					<Box
						mt={4}
						display={'flex'}
						width={'100%'}
						justifyContent={'sapce-between'}
						alignItems={'center'}
						gap={2}
					>
						<Box width={'100%'}>
							<Divider />
						</Box>
						<Typography component={'span'}>OR</Typography>
						<Box width={'100%'}>
							<Divider />
						</Box>
					</Box>
					<Button
						sx={{
							borderRadius: '1rem',
							marginTop: '2rem',
							display: 'flex',
							alignItems: 'center',
							gap: '.5rem',
						}}
						variant="outlined"
						onClick={submitForm}
						size="large"
						disabled={btnDisabled}
					>
						<img
							src={googleImg}
							alt="google"
						/>
						<Typography component={'span'}>Continue with Google</Typography>
					</Button>
				</Stack>
			</Box>
		</Box>
	);
};

export default LoginForm;
