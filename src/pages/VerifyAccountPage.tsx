import { Box, Typography } from '@mui/material'
import React from 'react'
import logo_img from '../assets/img/logo.svg'
import { VerifyAccountForm } from '../forms';

const VerifyAccountPage = () => {
  return (
    <Box
      width={{ xs: "90%", md: "100%" }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: { xs: "auto", md: "0" },
        minHeight: "100vh",
        height: "100vh",
      }}
      mb={4}
    >
      <Box
        sx={{
          maxWidth: "600px",
        }}
      >
        <img src={logo_img} alt={"logo"} />

        <Typography
          variant={"h3"}
          component={"h1"}
          textAlign={"center"}
          mb={4}
          mt={4}
        >
          Verify your phone number
        </Typography>
        <Typography variant={"body1"}>
          We’ve sent an SMS with an activation code to your phone +234 9012
          34563
        </Typography>
        <Box mt={4}>
          <VerifyAccountForm />
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyAccountPage