import React from "react";
import styled from "@emotion/styled";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import { whatWeDo } from "../../utils/constants";

const WhatWeDoContainer = styled(Box)({
  textAlign: "center",
  minHeight: "70vh",
  width: "100%",
  margin: "auto",
});

const WhatWeDo = () => {
  return (
    <WhatWeDoContainer>
      <Box width={{ xs: "90%", md: "80%" }} margin="auto" sx={{ py: "6rem" }}>
        <Typography variant="h2" gutterBottom textAlign="center">
          What We Do
        </Typography>
        {/* Grid block */}
        <Box sx={{ width: "100%" }}>
          <Grid
            container
            spacing={2}
            sx={{
              width: "100%",
              margin: "auto",
              alignItems: "stretch",
            }}
          >
            {whatWeDo.slice(0, 3).map((service, index) => (
              <Grid
                item
                xs={12}
                sm={index === 2 ? 12 : 6}
                md={4}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: index === 2 ? "center" : "flex-start",
                  alignItems: "stretch",
                  textAlign: index === 2 ? "center" : "left",
                }}
              >
                <Card
                  sx={{
                    border: "none",
                    boxShadow: "none",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: { xs: "left", sm: "center" },
                      flexGrow: 1,
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      <img src={service.icon} alt="service icons" />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{
              width: { xs: "100%", md: "67%" },
              margin: "auto",
              alignItems: "stretch",
            }}
          >
            {whatWeDo.slice(3).map((service, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key={index}
                sx={{ display: "flex", alignItems: "stretch" }}
              >
                <Card
                  sx={{
                    border: "none",
                    boxShadow: "none",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: { xs: "left", sm: "center" },
                      flexGrow: 1,
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      <img src={service.icon} alt="service icons" />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </WhatWeDoContainer>
  );
};

export default WhatWeDo;
