import React, { useEffect } from "react";
import { Box, Button, Paper } from "@mui/material";
import { useParams } from "react-router-dom";

import logo from "../assets/img/logo.svg";
import bg_img from "../assets/img/bg_img.svg";
import { Loading } from "../components";
import useTokenValidation from "../utils/hooks/useTokenValidation";

const ResendOtpPage: React.FC = () => {
  const [showLoadingPage, setShowLoadingPage] = React.useState<boolean>(false);
  const { token } = useParams();
  const { handleTokenValidation } = useTokenValidation();

  // useEffect(() => {
  //   handleTokenValidation(`${token}`, setShowLoadingPage);
  // }, [token, handleTokenValidation]);

  function handleOtpRequest() {
    // handle otp request logic here
  }

  if (showLoadingPage) {
    return <Loading showLogo={true} isLoading={showLoadingPage} />;
  }

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        backgroundSize: "cover",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          padding: "2rem",
          textAlign: "center",
          // background: `url(${bg_img}) no-repeat center center`,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt={"company logo"}
          sx={{
            marginBottom: "1rem",
          }}
        />
        <Button
          onClick={handleOtpRequest}
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "#AAC645", color: "#fff" }} // You can change the button style here
        >
          Resend OTP
        </Button>
      </Paper>
    </Box>
  );
};

export default ResendOtpPage
