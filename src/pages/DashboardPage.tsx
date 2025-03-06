import { Box, Stack } from '@mui/material';
import { DashHeader, DashSideBar } from '../components';
import { useState } from 'react';

const DashboardPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Function to toggle sidebar visibility
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<Stack
			width={'100vw'}
			height={'100vh'}
			direction="row"
		>
			<Box flex={1.5}>
				{/* Pass the toggleSidebar prop to DashSideBar */}
				<DashSideBar toggleSidebar={toggleSidebar} />
			</Box>
			<Box
				flex={9}
				component="main"
				width={'100%'}
			>
				{/* Pass the toggleSidebar prop to DashHeader */}
				<DashHeader toggleSidebar={toggleSidebar} />{' '}
				{/* Fix: Passing the required prop */}
				<Box padding={2}>
					{/* DashboardRoutes or other content goes here */}
				</Box>
			</Box>
		</Stack>
	);
};

export default DashboardPage;
