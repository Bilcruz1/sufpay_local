import { Box, Typography } from "@mui/material";
import bg_img from "../assets/img/bg_img.svg";

const SplashScreen = () => {
  return (
    <Box
      height={"100vh"}
      maxHeight={"100vh"}
      width={"100vw"}
      sx={{
        background: `url(${bg_img}) no-repeat center center`,
        backgroundSize: "cover",
      }}
      color={"#fff"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box>
        <Typography component={"h1"} variant="h2" gutterBottom>
          Welcome to Sufpay
        </Typography>
        <Typography
          component={"span"}
          variant={"h6"}
          sx={{
            width: "100%",
            display: "block",
            textAlign: "right",
          }}
        >
          ...easy pay
        </Typography>
      </Box>
    </Box>
  );
};

export default SplashScreen;
