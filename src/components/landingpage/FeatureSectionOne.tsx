import styled from "@emotion/styled";
import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { featureSectionOneContent, partnersLogo } from "../../utils/constants";

const Feature = styled(Box)({
  textAlign: "center",
  padding: "2rem 0",
  height: "70vh",
  width: "90%",
  margin: "auto",
  marginTop: "2rem",
});

const Partners = styled(Box)({
  textAlign: "center",
  padding: "2rem 0",
  height: "30vh",
  width: "90%",
  margin: "auto",
});


const FeatureSectionOne = () => {
  return (
    <Box width={"100%"} height={"100vh"}>
      <Feature>
        <Container maxWidth={false} disableGutters>
          <Typography variant="h3" gutterBottom>
            Creating Extraordinary Customer Experience
          </Typography>
          <Typography variant="h6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            bibendum eget morbi dignissim eu pharetra consequat montes,
            sagittis.
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{
              width: "90%",
              margin: "auto",
              marginTop: "4rem",
            }}
          >
            {featureSectionOneContent.map((el, index) => (
              <Grid
                item
                xs={12}
                md={3}
                key={index}
                p={3}
                sx={{
                  textAlign: "left",
                  maxWidth: "100px",
                }}
              >
                <img
                  src={el.icon}
                  alt={`icon ${el.icon}`}
                  width={".3em"}
                  height={".3em"}
                />
                <Typography variant="h6">{el.header}</Typography>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam bibendum eget morbi dignissim eu pharetra consequat
                  montes, sagittis.
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Feature>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FBFCF7",
        }}
      >
        <Partners>
          <Container maxWidth={false} disableGutters>
            <Typography variant="h4" gutterBottom>
              Business Partners
            </Typography>
            <Grid
              container
              spacing={5}
              justifyContent="space-between"
              sx={{
                width: "100%",
                margin: "auto",
                marginTop: "2rem",
                justifyItems: "space-between",
              }}
            >
              {partnersLogo.map((el, index) => (
                <Grid item key={index}>
                  <img src={el} alt={el.toLowerCase()} width={185} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Partners>
      </Box>
    </Box>
  );
};

export default FeatureSectionOne;
