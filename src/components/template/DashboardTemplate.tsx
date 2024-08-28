import React from 'react'
import { Box, Stack } from '@mui/material';
import DashHeader from '../dashboard/DashHeader';
import DashSideBar from '../dashboard/DashSideBar';

interface DashboardTemplateProps {
  view: React.ReactNode;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ view }) => {
  return (
    <Stack width={"100vw"} height={"100vh"} direction="row">
      <Box flex={1.5}>
        <DashSideBar />
      </Box>
      <Box
        flex={9}
        component="main"
        width={"100%"}
        // sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <DashHeader />
        <Box padding={2}>{view}</Box>
      </Box>
    </Stack>
  );
};

export default DashboardTemplate
