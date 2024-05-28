import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Grid,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { Header, Nav, FeatureSectionOne, FeatureSectionTwo, Newsletter } from "../components";

// const Banner = styled(Box)({
//   backgroundColor: "#121212",
//   color: "#fff",
//   textAlign: "center",
//   padding: "4rem 0",
// });

const Feature = styled(Box)({
  textAlign: "center",
  padding: "2rem 0",
});

const Partners = styled(Box)({
  textAlign: "center",
  padding: "2rem 0",
});

// const Newsletter = styled(Box)({
//   backgroundColor: "#f5f5f5",
//   padding: "2rem 0",
//   textAlign: "center",
// });

const Footer = styled(Box)({
  backgroundColor: "#121212",
  color: "#fff",
  padding: "2rem 0",
  textAlign: "center",
});

const LandingPage = () => {
  return (
    <>
      <Header />
      <FeatureSectionOne />
      <FeatureSectionTwo />
      <Newsletter />
      <Footer />

      <Footer>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={3}>
              <Typography variant="h6">About the company</Typography>
              <Typography>
                Learn to love growth and change and you will be a success.
                Microsoft Patch.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h6">Products</Typography>
              <Typography>News</Typography>
              <Typography>Ongoing Promo</Typography>
              <Typography>Updates</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h6">Get Started</Typography>
              <Typography>Career</Typography>
              <Typography>Contact Us</Typography>
              <Typography>Government Securities</Typography>
              <Typography>Examples</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h6">About</Typography>
              <Typography>Mission, Vision & Values</Typography>
              <Typography>Corporate Governance</Typography>
              <Typography>Shareholders</Typography>
              <Typography>Investor Relations</Typography>
              <Typography>16519</Typography>
            </Grid>
          </Grid>
        </Container>
      </Footer>
    </>
  );
};

export default LandingPage;
