import React from "react";
import Nav from "./Nav";
import { Box } from "@mui/material";
import Banner from "./Banner";
import heroBg from '../../assets/img/heroBg.png'
import HeaderFooter from "./HeaderFooter";

function Header() {
  return (
    <Box
    height={"100vh"}
    minHeight={"100vh"}
      sx={{
        backgroundColor: "#121212",
        // border: "1px solid red",
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          paddingTop: '3rem'
      }}
    >
      <Box
        sx={{
          width: "90%",
          margin: "auto",
        }}
      >
        <Nav />
              <Banner />
              {/* finish the header footer */}
        {/* <HeaderFooter /> */}
      </Box>
    </Box>
  );
}

export default Header;
