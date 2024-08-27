import { Box } from '@mui/material'
import React from 'react'
import { Route, Routes} from 'react-router-dom'
import { DashboardLanding } from '../components';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLanding />} />
    
    </Routes>
  );
}

export default DashboardRoutes
