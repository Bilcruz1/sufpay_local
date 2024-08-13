import { Box } from '@mui/material'
import { DashHeader, DashSideBar } from '../components';
import DashboardRoutes from '../routes/DashboardRoutes';


const DashboardPage = () => {
  return (
    <Box width={"100vh"} height={"100vh"}>
      <DashSideBar />
      <Box>
        dash body
        <DashHeader />
        <DashboardRoutes />
      </Box>
    </Box>
  );
}

export default DashboardPage;