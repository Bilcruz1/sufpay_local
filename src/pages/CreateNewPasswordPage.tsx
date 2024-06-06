import { Box, Typography } from "@mui/material";
import { CreateNewPasswordForm } from "../forms";
import logo_img from '../assets/img/logo.svg'

const CreateNewPasswordPage = () => {
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
