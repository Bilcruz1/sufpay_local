import { Box, Container, Grid, Typography, styled } from "@mui/material";
import React from "react";

const Feature = styled(Box)({
  textAlign: "center",
  padding: "2rem 0",
});

const HeaderFooter = () => {
  return (
    <Box
      sx={{ backgroundColor: "#111111", minHeight: "20vh", width: '100%', marginTop: "-3rem" }}
    >
      <Box sx={{ width: "60%" }}>
        <Feature>
          <Container>
            <Typography variant="h4" gutterBottom>
              How it works
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Register</Typography>
                <Typography>
                  Register yourself as a Paylast application user
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Add new card</Typography>
                <Typography>
                  Create a new card for you to use anytime and anywhere
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Success</Typography>
                <Typography>
                  You can use Paylast in peace and all its facilities
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Feature>
      </Box>
    </Box>
  );
};

export default HeaderFooter;
