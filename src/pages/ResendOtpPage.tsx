import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import logo from "../assets/img/sufpay_logo_black.svg";
import bg_img from "../assets/img/bg_img.svg";
import { Loading } from "../components";
import useTokenValidation from "../utils/hooks/useTokenValidation";
import { IResponse } from "../utils/interfaces";
import { StatusCode } from "../utils/enums";
import useNotification from "../utils/hooks/useNotification";
import { resendOtp, validateToken } from "../Apis/onBoardingApi";

const ResendOtpPage: React.FC = () => {
  const [showLoadingPage, setShowLoadingPage] = React.useState<boolean>(true);
  const { token } = useParams();
  const { showErrorNotification } = useNotification()
  const [redirectToHome, setRedirectToHome] = useState(false)

  const navigate = useNavigate()
  const { token: string } = useParams()

  useEffect(() => {
    handleTokenValidation(`${token}`, setShowLoadingPage);
  }, [token, handleTokenValidation]);

  async function handleTokenValidation(
    token: string,
    setShowLoadingPage: (value: boolean) => void
  ): Promise<IResponse> {
    try {
      const response: IResponse = await validateToken({ token: `${token}` });
      console.log(response);

      const responseChks = (response.data?.succeeded === true &&
        response.data?.statusCode === StatusCode.notFound &&
        response.data.data === false
      ) || (
          response.data?.succeeded === true &&
          response.data?.statusCode === StatusCode.deleted &&
          response.data?.data === false
        ) || (
          response.data?.succeeded === true &&
          response.data?.statusCode === StatusCode.deleted &&
          response.data?.data === false
        ) || (
          response.data?.succeeded === true &&
          response.data?.statusCode === StatusCode.badRequest &&
          response.data?.data === false
        ) || (
          response.data?.succeeded === true &&
          response.data?.statusCode === StatusCode.ok &&
          response.data.data === true
        )

      if (responseChks) {
        setShowLoadingPage(false)
      } else {
        navigate(-1);
      }

      return response;
    } catch (err) {
      showErrorNotification();
      // console.log(err);
      return {
        error: null,
        data: {
          succeeded: false,
          message: "Failed",
          errors: [],
          statusCode: StatusCode.internalServerError,
          data: null,
        },
      };
    }
  }

  async function handleOtpRequest() {
    const response: IResponse = await resendOtp({ token: `${token}` });

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
          // background: `url(${bg_img}) no-repeat center center`,
        }}
      >

        {
          redirectToHome ?
            <>
              <Typography variant="h5" component={"h5"} mb={2}>OTP Expired click the button to resend.</Typography>
              <Button
                onClick={handleOtpRequest}
                variant="contained"
                color="primary"
                sx={{ backgroundColor: "#AAC645", color: "#fff" }} // You can change the button style here
              >
                Resend OTP
              </Button>

            </> :

            <>
              <Typography variant="h5" component={"h5"} mb={2}>OTP has been sent please check your mail.</Typography>

              <Button onClick={() => {
                navigate("/");
                setRedirectToHome(false);
              }}>Go to home page</Button>

            </>
        }
      </Paper>
    </Box>
  );
};

export default ResendOtpPage
function showErrorNotification() {
  throw new Error("Function not implemented.");
}

