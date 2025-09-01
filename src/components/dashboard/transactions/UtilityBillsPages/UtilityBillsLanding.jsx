import React from 'react';
import {
	Grid,
	Box,
	Stack,
	useMediaQuery,
	useTheme,
	Typography,
} from '@mui/material';
import { TransactionsCardsContent } from '../../../../utils/constants';
import TransactionsCards from '../Cards/TransactionsCards';

const UtilityBillsLanding = () => {
	const theme = useTheme();

	const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<Box>
			<Typography
				sx={{ fontSize: '1.25rem', fontWeight: 'medium', color: '#636559' }}
			>
				Utility bills
			</Typography>
			<Typography
				sx={{
					fontSize: '0.88rem',
					fontWeight: 'medium',
					color: '#A2A49B',
					marginTop: '1.5rem',
					marginBottom: '0.75rem',
				}}
			>
				Select an option
			</Typography>
			<Grid
				container
				spacing={'1rem'}
				sx={{}}
			>
				{TransactionsCardsContent.map((el, ind) => (
					<Grid
						item
						xs={4}
						md={4}
						key={ind}
					>
						<TransactionsCards
							title={el.title}
							link={el.link}
							icon={el.icon}
							text={el.text}
						/>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default UtilityBillsLanding;
