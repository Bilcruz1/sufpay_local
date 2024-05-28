import { Box, Container, Grid, Typography, styled } from '@mui/material'
import React from 'react'

const FooterContainer = styled(Box)({
  backgroundColor: "#121212",
  color: "#fff",
  padding: "2rem 0",
  textAlign: "center",
});


const Footer = () => {
  return (
      <Box sx={{
          width: '100%',
          height: '40vh',
    }}>
      <FooterContainer>
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
      </FooterContainer>
    </Box>
  );
}

export default Footer