import React from 'react';
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Avatar,
	Typography,
	Box,
} from '@mui/material';
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

	const handleListItemClick = (link: string) => {
		navigate(link);
		toggleSidebar();
	};

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

				{/* Map through the dashboard navigation links */}
				{DashboadNav.map((el, ind) => (
					<ListItem
						key={ind}
						onClick={() => handleListItemClick(el.link)}
						sx={{
							backgroundColor:
								location.pathname === el.link ? '#8CAE14' : 'inherit',
							color: '#fff',
							borderRadius: '.3rem',
							cursor: 'pointer',
						}}
					>
						<ListItemIcon>
							<Box
								component={'img'}
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
						alt="Hassan Garba"
						src="/static/images/avatar/1.jpg"
					/>
					<Typography
						variant="caption"
						sx={{ color: '#fff' }}
					>
						Hassan Garba
					</Typography>
				</Box>

				<Box
					component={'img'}
					src={exit_icon}
					alt={'exit_icon'}
					sx={{ cursor: 'pointer', width: '1rem', height: '1rem' }}
				/>
			</Box>
		</Box>
	);
};

export default DashSideBar;
