import { Box, Stack } from '@mui/material'
import { DashHeader, DashSideBar } from '../components';
// import DashboardRoutes from '../routes/DashboardRoutes';


const DashboardPage = () => {
  return (
    <Stack width={"100vw"} height={"100vh"} direction="row">
      <Box flex={1.5} >
        <DashSideBar />
      </Box>
      <Box
        flex={9}
        component="main"
        width={"100%"}
        // sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <DashHeader />

        <Box padding={2}>
          {/* <DashboardRoutes /> */}
        </Box>
      </Box>
    </Stack>
  );
}

export default DashboardPage;
