import {
	AppBar,
	Avatar,
	Badge,
	Box,
	IconButton,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import notification_icon from '../../assets/icons/notification_icon.svg';

interface DashHeaderProps {
	toggleSidebar: () => void;
}

const DashHeader: React.FC<DashHeaderProps> = ({ toggleSidebar }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	// State for user name
	const [firstName, setFirstName] = useState<string>('User');
	const [lastName, setLastName] = useState<string>('');

	useEffect(() => {
		// Fetch user info from local storage
		const fetchedFirstName = localStorage.getItem('firstName') || 'User';
		const fetchedLastName = localStorage.getItem('lastName') || '';
		setFirstName(fetchedFirstName);
		setLastName(fetchedLastName);
	}, []);

	return (
		<AppBar
			position="fixed"
			elevation={0}
			sx={{
				borderBottom: '1px solid #66666628',
				backgroundColor: '#ffffff',
				top: 0,
				left: isMobile ? 0 : 250,
				paddingRight: isMobile ? 0 : 33,
				right: 0,
				zIndex: theme.zIndex.drawer + 1,
				width: '100%',
			}}
		>
			<Toolbar>
				<Box
					display="flex"
					flexGrow={1}
					alignItems="center"
				>
					<Typography
						variant="h5"
						color="textPrimary"
					>
						Welcome, {lastName}
					</Typography>
				</Box>

				{!isMobile && (
					<>
						<Box
							display="flex"
							gap="16px"
						>
							<IconButton
								aria-label="show notifications"
								color="inherit"
							>
								<Badge
									badgeContent={4}
									color="secondary"
								>
									<Box
										component={'img'}
										alt={'notification_icon'}
										src={notification_icon}
										width={'1.5rem'}
										height={'1.5rem'}
									/>
								</Badge>
							</IconButton>
							<Box
								display="flex"
								alignItems="center"
								gap="12px"
							>
								<Avatar
									alt={`${firstName} ${lastName}`}
									sx={{ width: '24px', height: '24px' }}
								/>
								<Typography sx={{ fontWeight: 600, fontSize: '12px' }}>
									{firstName} {lastName}
								</Typography>
							</Box>
						</Box>
					</>
				)}

				{/* Hamburger Menu for Mobile */}
				{isMobile && (
					<Box display="flex">
						<Box
							display="flex"
							alignItems="center"
							gap="12px"
						>
							<Avatar
								alt={`${firstName} ${lastName}`}
								sx={{ width: '1.5rem', height: '1.5rem' }}
							/>
						</Box>
						<IconButton
							edge="end"
							color="inherit"
							aria-label="menu"
							onClick={toggleSidebar}
						>
							<MenuIcon />
						</IconButton>
					</Box>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default DashHeader;
