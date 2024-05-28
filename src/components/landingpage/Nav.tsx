import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import logo from "../../assets/img/logo.svg";

const Nav = () => {
  return (
      <AppBar position="static" sx={{
          // marginTop: '2rem',
          backgroundColor: 'transparent',
          boxShadow: 'none'
      }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        {/* logo  con */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flex: 1,
          }}
        >
          <img src={logo} alt={"sufpay logo"} />
        </Box>

        {/* nav con */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Button color="inherit">Get Card</Button>
          <Button color="inherit">About Us</Button>
          <Button color="inherit">Contact Us</Button>
        </Box>

        {/* user access con */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            flex: 1,
            gap: "1rem",
          }}
        >
          <Button color="inherit">Log In</Button>
          <Button
            color="inherit"
            variant="outlined"
            sx={{
              borderRadius: "38px",
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
