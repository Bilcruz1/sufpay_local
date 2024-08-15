import { Box } from '@mui/material'
import React from 'react'
import { Route, Routes} from 'react-router-dom'
import { DashboardLanding } from '../components';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path={"/"} element={<DashboardLanding />} />
      {/* <Route path={"transactions"} element={<DashboardLanding />} />
      <Route path={"notifications"} element={<DashboardLanding />} />
      <Route path={"help"} element={<DashboardLanding />} />
      <Route path={"settings"} element={<DashboardLanding />} />
      <Route path={"settings"} element={<DashboardLanding />} /> */}
      {/* <Route path={"/dashboard/*"} element={<NotFoundPage />} /> */}
      {/* <Redirect from={"*"} to=".dashboard"} /> */}
    </Routes>
  );
}

export default DashboardRoutes
