import React from 'react';
import { Grid, Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import {
	DashboardCardsContent,
	transactionsTile,
} from '../../../utils/constants';
import { DonutChart, DashboardCards, DashboardHistories } from '../..';

const DashboardLanding = () => {
	const theme = useTheme();
	// Check if screen is medium size (md) or below
	const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<Box>
			{/* top cards */}
			<Grid
				container
				spacing={'1rem'}
				sx={{}}
			>
				{DashboardCardsContent.map((el, ind) => (
					<Grid
						item
						xs={4}
						md={2}
						key={ind}
					>
						<DashboardCards
							title={el.title}
							link={el.link}
							icon={el.icon}
						/>
					</Grid>
				))}
			</Grid>

			{/* body */}
			<Grid
				container
				spacing={'1rem'}
				sx={{ marginTop: '.5rem' }}
			>
				{/* RHS */}
				<Grid
					item
					xs={12}
					md={8}
					sx={{}}
				>
					<Stack
						direction={'column'}
						spacing={'1rem'}
					>
						{transactionsTile.map((el, ind) => (
							<Box
								key={ind}
								flex={1}
								sx={{}}
							>
								<DashboardHistories
									title={el.title}
									linkUrl={el.linkUrl}
								/>
							</Box>
						))}
					</Stack>
				</Grid>

				{/* LHS (Donut Chart) - hidden on md and below */}
				{!isMdDown && (
					<Grid
						item
						xs={12}
						md={4}
						sx={{}}
					>
						<DonutChart />
					</Grid>
				)}
			</Grid>
		</Box>
	);
};

export default DashboardLanding;
