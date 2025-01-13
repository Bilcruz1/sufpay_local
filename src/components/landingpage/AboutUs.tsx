import { Box, Divider, styled, Typography } from '@mui/material';
import React from 'react';
import about_us_img from '../../assets/img/about_us_img.png';

import about_us_icon from '../../assets/icons/about_us_icon.svg';
import { aboutUs } from '../../utils/constants';
import { IHeaderProps } from '../../utils/interfaces';

const AboutUsContainer = styled(Box)({
	textAlign: 'left',
	minHeight: '90vh',
	width: '100%',
	display: 'flex',
	justifyItems: 'center',
	alignItems: 'center',
	flexWrap: 'wrap',
	padding: '3rem 0',
});

const AboutUs: React.FC<IHeaderProps> = ({ id }) => {
	return (
		<AboutUsContainer id={id}>
			<Box
				sx={{
					width: { xs: '90%', md: '80%' },
					margin: 'auto',
					padding: 2,
					textAlign: 'center',
					display: 'flex',
					flexDirection: { xs: 'column-reverse', md: 'row-reverse' },
					gap: '1.375rem',
					py: '4rem',
				}}
			>
				{/* img */}
				<Box
					sx={{
						width: '100%',
						heigth: 'inherit',
						flex: 1,
						backgroundColor: '#F8F8F8',
						paddingLeft: '2rem',
						paddingTop: { xs: '1rem', md: '3rem' },
						borderRadius: '1rem',

						display: 'flex',
						alignItems: 'center',
					}}
				>
					<Box
						component="img"
						src={about_us_img}
						alt="icon img"
						sx={{
							width: '100%',
							display: 'block',
						}}
					/>
				</Box>

				{/* content */}
				<Box
					sx={{
						heigth: 'inherit',
						flex: 1,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							gap: '.5rem',
							justifyContent: 'flex-start',
							alignItems: 'center',
						}}
					>
						<Box
							component="img"
							src={about_us_icon}
							alt="icon img"
							sx={{
								width: '2em',
								height: '2em',
								display: 'block',
							}}
						/>
						<Typography
							variant="h5"
							component={'h2'}
							sx={{ margin: 0, lineHeight: '2em' }}
							gutterBottom
						>
							About Us
						</Typography>
					</Box>

					{/* body */}
					<Box
						sx={{
							textAlign: 'left',
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
						}}
					>
						{aboutUs.map((el, ind) => (
							<Box
								mt={'2rem'}
								key={ind}
							>
								<Typography variant="h3">{el.title}</Typography>
								<Typography
									sx={{ textAlign: 'justify', mb: '2rem', marginTop: '1rem' }}
									variant="body1"
								>
									{el.content}
								</Typography>
								{ind !== 2 && <Divider />}
							</Box>
						))}
					</Box>
				</Box>
			</Box>
		</AboutUsContainer>
	);
};

export default AboutUs;
