import React from "react";
import styled from "@emotion/styled";
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment'; // Example icon
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'; // Example icon
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // Example icon
import BusinessIcon from '@mui/icons-material/Business'; // Example icon
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
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
      <Box width={"80%"} margin={"auto"} sx={{ py: "52px" }}>

        <Typography variant="h2" gutterBottom textAlign="center">
          What We <span style={{ color: "#AAC645" }}>Do</span>
        </Typography>
        {/* </Box> */}

        {/* grid block */}
        <Box sx={{ width: "100%" }}>
          <Grid
            container
            sx={{
              width: "100%",
              margin: "auto",
              padding: "none",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            {whatWeDo.slice(0, 3).map((service, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                sx={{ width: "100%" }}
              >
                <Card
                  sx={{
                    boder: "none",
                    boxShadow: "none",
                    width: "100%",
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
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
            sx={{
              width: { xs: "100%", md: "67%" },
              margin: "auto",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            {whatWeDo.slice(3).map((service, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key={index}
                sx={{ width: "100%" }}
              >
                <Card
                  sx={{
                    boder: "none",
                    boxShadow: "none",
                    width: "100%",
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
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
