import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TransactionsCards: React.FC<{
	icon: string;
	title: string;
	link: string;
	text: string;
}> = ({ icon, title, link, text }) => {
	const navigate = useNavigate();

	return (
		<Box
			sx={{
				height: ['12.25rem', '12.25rem'],
				display: 'flex',
				gap: '.8rem',
				border: '1px solid #66666628',
				borderRadius: '5px',
				color: 'black',
				flexDirection: 'column',
				padding: ['0.5rem', '1rem'],
				// paddingBottom: '2.8rem',
				cursor: 'pointer',
			}}
			onClick={() => navigate(link)}
		>
			<Box
				component={'img'}
				src={icon}
				alt={`${title}_icon`}
				sx={{ width: '1.88rem', height: '1.88rem' }}
			/>
			<Typography
				variant="body1"
				sx={{
					fontSize: {
						xs: '0.68rem',
						md: '1rem',
					},
					color: '#353535',
					fontWeight: 'medium',
				}}
			>
				{title}
			</Typography>
			<Typography
				sx={{
					fontSize: {
						xs: '0.68rem',
						md: '1rem',
					},
					color: '#A2A49B',
				}}
			>
				{text}
			</Typography>
		</Box>
	);
};

export default TransactionsCards;
