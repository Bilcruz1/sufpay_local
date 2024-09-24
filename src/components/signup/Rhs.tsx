import { Box, Typography } from "@mui/material";
import React from "react";
import img from "../../assets/img/signup_img.png";

const Rhs: React.FC = () => {
  return (
    <Box
      height={"100%"}
      width={"100%"}
      sx={{
        backgroundImage: `url(${img})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      display={"flex"}
      justifyContent={"center"}
      color={"#fff"}
    >
      <Box>
        <Typography
          component={"h1"}
          variant="h2"
          gutterBottom
          sx={{ color: "#fff", marginTop: "30%" }}
        >
          Welcome to Sufpay
        </Typography>
        <Typography
          component={"span"}
          variant={"h6"}
          sx={{
            width: "100%",
            display: "block",
            textAlign: "right",
            color: "white",
          }}
        >
          ...easy pay
        </Typography>
      </Box>
    </Box>
  );
};

export default Rhs;
