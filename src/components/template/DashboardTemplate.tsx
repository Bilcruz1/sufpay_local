import React, { useState } from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import DashHeader from '../dashboard/DashHeader';
import DashSideBar from '../dashboard/DashSideBar';

interface DashboardTemplateProps {
	view: React.ReactNode;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ view }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Function to toggle the sidebar visibility
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<Box
			width="100%"
			height="100vh"
			display="flex"
			flexDirection="row"
		>
			{/* Sidebar: Fixed on the left for desktop */}
			{!isMobile && (
				<Box
					flexShrink={0}
					width="250px"
					height="100vh"
					position="fixed"
					top={0}
					left={0}
					zIndex={1}
				>
					<DashSideBar toggleSidebar={toggleSidebar} />
				</Box>
			)}

			{/* Drawer for mobile sidebar on the right */}
			<Drawer
				anchor="right"
				open={isSidebarOpen}
				onClose={toggleSidebar}
				PaperProps={{ sx: {} }}
				sx={{
					display: {
						xs: 'block',
						md: 'none',
						lg: 'none',
					},
				}}
			>
				<DashSideBar toggleSidebar={toggleSidebar} />
			</Drawer>

			{/* Main Content */}
			<Box
				marginLeft={!isMobile ? '250px' : 0}
				flexGrow={1}
				display="flex"
				flexDirection="column"
				height="100vh"
			>
				{/* Header */}
				<Box
					component="header"
					position="fixed"
					top={0}
					left={!isMobile ? '250px' : 0}
					width={isMobile ? '100%' : 'calc(100% - 250px)'}
					zIndex={2}
					sx={{
						p: 3,
						backgroundColor: '#fff',
						boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
					}}
				>
					<DashHeader toggleSidebar={toggleSidebar} />
				</Box>

				{/* Scrollable View Area */}
				<Box
					component="main"
					marginTop="80px"
					height="calc(100vh - 80px)"
					overflow="auto"
					sx={{ p: 2 }}
				>
					{view}
				</Box>
			</Box>
		</Box>
	);
};

export default DashboardTemplate;
