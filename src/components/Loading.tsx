// LoadingPage.js
import { Box } from "@mui/material";
import React from "react";
import { ThreeCircles } from "react-loader-spinner"; 
import logo from '../assets/img/sufpay_logo_black.svg';

interface LoadingProps {
  isLoading: boolean;
  height?: string;
  width?: string;
  position?: string;
}

const Loading: React.FC<LoadingProps> = ({
  isLoading,
  height = "100vh", 
  width = "100vh", 
  position = "relative"
}) => {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: height,
        width: width,
        backgroundColor: "transparent",
        flexDirection: "column",
        gap: "2rem",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        postion: position,
        // opacity: 0.5,
      }}
    >
      {/* <Box component="img" src={logo} alt={"company logo"} /> */}
      <ThreeCircles
        visible={true}
        height="100"
        width="100"
        color="#AAC645"
        ariaLabel="three-circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </Box>
  );
};

export default Loading;