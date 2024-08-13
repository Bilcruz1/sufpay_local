import { Box } from '@mui/material'
import React from 'react'
import { Route, Routes} from 'react-router-dom'
import { DashboardLanding } from '../components';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path={"/dashboard"} element={<DashboardLanding />} />
      {/* <Route path={"/dashboard/transactions"} element={<DashboardLanding />} />
      <Route path={"/dashboard/notification"} element={<DashboardLanding />} />
      <Route path={"/dashboard/help"} element={<DashboardLanding />} />
      <Route path={"/dashboard/settings"} element={<DashboardLanding />} />
      <Route path={"/dashboard/settings"} element={<DashboardLanding />} /> */}
      {/* <Route path={"/dashboard/*"} element={<NotFoundPage />} /> */}
      {/* <Redirect from={"*"} to=".dashboard"} /> */}
    </Routes>
  );
}

export default DashboardRoutes