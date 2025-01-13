import React, { useEffect, useState } from 'react';
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Avatar,
	Typography,
	Box,
} from '@mui/material';
import AuthContext from '../../context/auth-context';
import { DashboadNav } from '../../utils/constants';
import { useNavigate, useLocation } from 'react-router-dom';
import dash_logo from '../../assets/img/dash_Sufpay.svg';
import exit_icon from '../../assets/icons/exit_icon.svg';

interface DashSideBarProps {
	toggleSidebar: () => void;
}

const DashSideBar: React.FC<DashSideBarProps> = ({ toggleSidebar }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = AuthContext.useContainer();
	const [selectedPath, setSelectedPath] = useState(location.pathname);

	// State to store user information
	const [userName, setUserName] = useState<string>('User');

	const getPrimaryPath = (path: string) => {
		if (path.startsWith('/transaction')) return '/transaction';
		return path;
	};

	const handleListItemClick = (link: string) => {
		setSelectedPath(getPrimaryPath(link));
		navigate(link);
		toggleSidebar();
	};

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	useEffect(() => {
		setSelectedPath(getPrimaryPath(location.pathname));

		// Fetch user info from local storage
		const firstName = localStorage.getItem('firstName') || 'User';
		const lastName = localStorage.getItem('lastName') || '';
		setUserName(`${firstName} ${lastName}`.trim());
	}, [location.pathname]);

	return (
		<Box
			sx={{
				backgroundColor: '#AAC645',
				padding: '0 .7rem',
				color: '#FFF',
				width: '100%',
				flexShrink: 0,
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
		>
			<List>
				<ListItem sx={{ marginBottom: '2rem' }}>
					<Box
						component={'img'}
						src={dash_logo}
						alt={'sufpay_logo'}
					/>
				</ListItem>

				{DashboadNav.map((el, ind) => (
					<ListItem
						key={ind}
						onClick={() => handleListItemClick(el.link)}
						sx={{
							backgroundColor:
								selectedPath === getPrimaryPath(el.link)
									? '#8CAE14'
									: 'inherit',
							color: '#fff',
							borderRadius: '.3rem',
							cursor: 'pointer',
						}}
					>
						<ListItemIcon sx={{ minWidth: 0, marginRight: 2 }}>
							<Box
								component="img"
								src={el.icon}
								alt={`${el.title}_icon`}
							/>
						</ListItemIcon>
						<ListItemText
							primaryTypographyProps={{ color: '#fff' }}
							sx={{ color: '#fff' }}
							primary={el.title}
						/>
					</ListItem>
				))}
			</List>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					width: '100%',
					marginBottom: '2rem',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						gap: '.5rem',
						alignItems: 'center',
						flexWrap: 'wrap',
					}}
				>
					<Avatar
						alt={userName}
						src="/static/images/avatar/1.jpg"
					/>
					<Typography
						variant="caption"
						sx={{ color: '#fff' }}
					>
						{userName}
					</Typography>
				</Box>

				<Box
					component={'img'}
					src={exit_icon}
					alt={'exit_icon'}
					sx={{ cursor: 'pointer', width: '1rem', height: '1rem' }}
					onClick={handleLogout}
				/>
			</Box>
		</Box>
	);
};

export default DashSideBar;
