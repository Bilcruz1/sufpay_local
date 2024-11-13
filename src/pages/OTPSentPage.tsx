import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import logo from "../assets/img/sufpay_logo_black.svg";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Loading } from "../components";

const ResendOtpPage: React.FC = () => {
  const [showLoadingPage, setShowLoadingPage] = useState<boolean>(true);
  const [redirectToHome] = useState(false); 
  const navigate = useNavigate();

  const { token } = useParams<{ token: string | undefined }>();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryToken = queryParams.get("token");

  const storedToken = useSelector((state: RootState) => state.token.token);

  useEffect(() => {
    if (queryToken === storedToken) {
      setShowLoadingPage(false);
    }
  }, [queryToken, storedToken]);

  if (showLoadingPage) {
    return <Loading isLoading={showLoadingPage} showLogo={true} />;
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
        position: "relative",
      }}
    >
      <Box
        component="img"
        src={logo}
        alt={"company logo"}
        sx={{
          marginBottom: "1rem",
          position: "absolute",
          top: "1rem",
          left: "1rem",
        }}
      />
      <Paper
        elevation={1}
        sx={{
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" component={"h5"} mb={2}>
          OTP has been sent. Please check your mail.
        </Typography>
        <Button
          onClick={() => {
            navigate("/"); 
          }}
        >
          Go to home page
        </Button>
      </Paper>
    </Box>
  );
};

export default ResendOtpPage;
