import Nav from "./Nav";
import { Box } from "@mui/material";
import Banner from "./Banner";
import heroBg from '../../assets/img/heroBg.png'
import React from "react";
import { IHeaderProps } from "../../utils/interfaces";


const Header: React.FC<IHeaderProps> = ({id}) => {
  return (
    <Box
      id={id}
      minHeight={"100vh"}
      sx={{
        backgroundColor: "#1D1D1F",
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        py: "3rem",

      }}
    >
      <Box
        sx={{
          width: {xs: "90%", md: "80%"},
          margin: "auto",
        }}
      >
        <Nav />
        <Banner />
      </Box>
    </Box>
  );
}

export default Header;
