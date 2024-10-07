import { Box, Typography } from '@mui/material';
import React from 'react'
import logo_img from '../assets/img/sufpay_logo_black.svg'
import ResetPasswordOtpForm from '../forms/ResetPasswordOtpForm';
import { Loading } from '../components';
import useTokenValidation from '../utils/hooks/useTokenValidation';
import { useParams } from 'react-router-dom';

const ResetPaswordOtpPage = () => {

  const [btnDisabled, setBtnDisabled] = React.useState<boolean>(false);
  const { handleTokenValidation } = useTokenValidation();
  const [showLodaingPage, setShowLoadingPage] = React.useState<boolean>(true);
  const { token } = useParams();

  React.useEffect(() => {
  handleTokenValidation(`${token}`, setShowLoadingPage);
  });

   if (showLodaingPage)
     return <Loading isLoading={btnDisabled} position={"absolute"} />

  
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
          textAlign: "center",
        }}
      >
        <Box component={"img"} src={logo_img} alt={"logo"} />

        <Typography
          variant={"h3"}
          component={"h1"}
          textAlign={"center"}
          mb={4}
          mt={4}
        >
          Reset password
        </Typography>
        <Typography variant={"body1"}>
          Please enter the code sent to your mail
        </Typography>
        <Box mt={4}>
          {!btnDisabled ? (
            <ResetPasswordOtpForm
              btnDisabled={btnDisabled}
              setBtnDisabled={setBtnDisabled}
            />
          ) : (
            <Loading isLoading={btnDisabled} height="100%" width="100%" />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ResetPaswordOtpPage
