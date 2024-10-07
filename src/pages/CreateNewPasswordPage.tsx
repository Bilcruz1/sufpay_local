import { Box, Typography } from "@mui/material";
import { CreateNewPasswordForm } from "../forms";
import logo_img from '../assets/img/sufpay_logo_black.svg'
import { useEffect, useState } from "react";
import useTokenValidation from "../utils/hooks/useTokenValidation";
import { useParams } from "react-router-dom";
import { Loading } from "../components";

const CreateNewPasswordPage = () => {
  const [loading, setLoading] = useState(true)

  const { token } = useParams()
  const { handleTokenValidation } = useTokenValidation()

  useEffect(() => {
    handleTokenValidation(`${token}`, setLoading)
  }, []) 

  if (loading) return <Loading isLoading={loading} />
  
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
          maxWidth: "665px",
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
          Create new password
        </Typography>
        <Box>
          <CreateNewPasswordForm />
        </Box>
      </Box>
    </Box>
  );
};

export default CreateNewPasswordPage;
