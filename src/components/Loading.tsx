import { Box } from '@mui/material';
import React from 'react';
import { Triangle } from 'react-loader-spinner';
import logo from '../assets/img/sufpay_logo_black.svg';

interface LoadingProps {
	isLoading: boolean;
	height?: string;
	width?: string;
	position?: string;
	showLogo?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
	isLoading,
	height = '100vh',
	width = '100vw',
	position = 'relative',
	showLogo = false,
}) => {
	if (!isLoading) return null;

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: height,
				width: width,
				backgroundColor: 'rgba(255, 255, 255, 0.8)', // Add subtle background for branding
				flexDirection: 'column',
				gap: '2rem',
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				position: position, // Corrected the typo here
			}}
		>
			{/* Add a subtle animation to the logo */}
			{showLogo && (
				<Box
					component="img"
					src={logo}
					alt={'SufPay Logo'}
					sx={{
						animation: 'fadeIn 1.5s ease-in-out',
						width: '150px', // Adjust logo size based on branding
					}}
				/>
			)}
			<Triangle
				visible={true}
				height="80"
				width="80"
				color="#AAC645" // Ensure this matches your brand's color
				ariaLabel="SufPay is loading, please wait"
			/>
			{/* Optional branded message */}
			<Box sx={{ fontSize: '1rem', color: '#333' }}>
				Loading, please wait...
			</Box>
		</Box>
	);
};

export default Loading;
