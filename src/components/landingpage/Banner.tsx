import { Box, Button, Typography, styled } from '@mui/material'
import React from 'react'
import banner_img from "../../assets/img/banner_img.png";


const BannerContainer = styled(Box)`
  /* background-color: #121212; */
  color: #fff;
  text-align: center;
  /* padding: 4rem 0; */
  display: flex;
  flex-direction: column;
  /* width:'80%'; */
  margin: 'auto';
  pb: '114px';
  /* border: '1px solid red'; */


  /* @media (min-width: 768px) {
    flex-direction: row;
  } */
`;


const Banner = () => {

  const styles = {
    width: '100%',
  }

  return (
    <BannerContainer sx={{ marginTop: "10%" }}>
      <Box>
        <Typography variant="h1" component={"h1"}>
          Welcome to SufPay, the forefront of financial technology innovation in
          Nigeria.
        </Typography>
        <Typography variant="h6" mt={'32px'} component={"h6"}>
          We are dedicated to revolutionizing the digital transaction landscape,
          making financial services more accessible, secure, and efficient for
          all Nigerians. Explore our comprehensive range of services, from
          transaction facilitation and regulatory adherence to digital
          communication devices and networking solutions. Discover how SufPay
          can empower your financial and digital future.
        </Typography>
      </Box>
      {/* uncommnet when ready */}
      {/* <Box
        sx={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          alignItems: "center",
          mt: '60px',
        }}
      >
        <Button variant="contained" size="large">
          Get started
        </Button>
        <Button variant="outlined" size="large">
          Log in
        </Button>
      </Box> */}

      <Box mt={{xs: '40px', md: '148px'}} >
        <img src={banner_img} alt={"sufpay banner"} style={styles } />
      </Box>
    </BannerContainer>
  );
}

export default Banner
