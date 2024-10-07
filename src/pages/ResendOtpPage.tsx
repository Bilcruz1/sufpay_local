import React, { useEffect } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import logo from "../assets/img/logo.svg";
import bg_img from "../assets/img/bg_img.svg";
import { Loading } from "../components";
import useTokenValidation from "../utils/hooks/useTokenValidation";

const ResendOtpPage = () => {
  const [showLodaingPage, setShowLoadingPage] = React.useState<boolean>(true);
  const { token } = useParams();
  const { handleTokenValidation } = useTokenValidation();

  useEffect(() => {
    handleTokenValidation(`${token}`, setShowLoadingPage);
  }, []);

  function handleOtpRequest() {
    // handle otp request
  }

  if (showLodaingPage) return <Loading isLoading={showLodaingPage} position="absolute"/>;

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `url(${bg_img}) no-repeat center center`,
        backgroundSize: "cover",
      }}
    >
      <Box component="img" src={logo} alt={"company_logo"} />
      <Button
        onClick={handleOtpRequest}
        variant="contained"
        color={"primary"}
        sx={{ backgroundColor: "#fff" }}
      >
        Resend Otp
      </Button>
      ResendOtpPage
    </Box>
  );
};

export default ResendOtpPage;
