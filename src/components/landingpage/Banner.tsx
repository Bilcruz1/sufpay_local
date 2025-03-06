import * as React from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import banner_img from '../../assets/img/banner_img.png';
import { useNavigate } from 'react-router-dom';

const BannerContainer = styled(Box)`
	color: #fff;
	text-align: center;
	display: flex;
	flex-direction: column;
	margin: 'auto';
`;

const Banner = () => {
	const navigate = useNavigate();

	const styles = {
		headerColor: {
			color: '#AAC645',
		},
	};
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleNavClick = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			const rootFontSize = parseFloat(
				getComputedStyle(document.documentElement).fontSize
			); // Get root font size in pixels
			const yOffsetRems = -5; // Change this to your desired rem value
			const yOffset = yOffsetRems * rootFontSize; // Convert rem to pixels
			const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
		handleClose();
	};

	return (
		<BannerContainer
			sx={{ marginTop: '10%', color: '#fff', paddingBottom: '6rem' }}
		>
			<Box>
				<Typography
					variant="h1"
					component={'h1'}
					sx={{ color: '#fff' }}
				>
					Welcome to Suf<span style={styles.headerColor}>Pay</span>
				</Typography>
				<Typography
					variant="h6"
					mt={'2rem'}
					component={'h6'}
					sx={{ color: '#fff', marginTop: '2rem' }}
				>
					The forefront of financial technology innovation in Nigeria.
				</Typography>
			</Box>
			{/* uncommnet when ready */}
			<Box
				sx={{
					display: 'flex',
					gap: '1.25rem',
					justifyContent: 'center',
					alignItems: 'center',
					mt: '3.75rem',
				}}
			>
				{/* <Button
					variant="contained"
					size="large"
					// onClick={() => navigate("/signup")}
					onClick={() => handleNavClick('contact')}
				>
					Get started
				</Button>
				<Button
					variant="outlined"
					size="large"
					// onClick={() => navigate("/login")}
					onClick={() => handleNavClick('contact')}
				>
					Log in
				</Button> */}
			</Box>

			<Box mt={{ xs: '2rem', md: '6rem' }}>
				<Box
					component="img"
					src={banner_img}
					alt="sufpay_banner"
					sx={{
						display: 'block',
						width: { xs: '100%', sm: '80%' },
						margin: 'auto',
					}}
				/>
			</Box>
			<Typography
				variant="h6"
				mt={'2rem'}
				component={'h6'}
				sx={{ color: '#fff', marginTop: '2rem' }}
			>
				We are dedicated to revolutionizing the digital transaction landscape,
				making financial services more accessible, secure, and efficient for all
				Nigerians. Explore our comprehensive range of services, from transaction
				facilitation and regulatory adherence to digital communication devices
				and networking solutions. Discover how SufPay can empower your financial
				and digital future.
			</Typography>
		</BannerContainer>
	);
};

export default Banner;
