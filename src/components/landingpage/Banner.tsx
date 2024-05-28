import { Avatar, AvatarGroup, Box, Button, Container, Typography, styled } from '@mui/material'
import React from 'react'
import bannerimg from '../../assets/img/bannerImg.png'


const BannerContainer = styled(Box)`
  /* background-color: #121212; */
  color: #fff;
  text-align: center;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
    width:'90%';
    margin: 'auto';


  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Banner = () => {
  return (
    <BannerContainer>
      <Container maxWidth="md" sx={{ flex: 1, textAlign: "left" }}>
        <Typography
          variant="h1"
          sx={{ fontSize: "80px", lineHeight: 1.5 }}
          mb={"1rem"}
          gutterBottom
        >
          MAKE PAYMENTS EASY AND SIMPLIFY YOUR FINANCES
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: "block", fontSize: "19px" }}
          mb={"2.5rem"}
          gutterBottom
        >
          A new way to make payments easy, reliable and secure. You can manage
          all your transactions from your mobile phone.
        </Typography>

        {/* cta */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: "32px" }}
          >
            Get Started
          </Button>

          {/* <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}> */}
            <AvatarGroup sx={{fontSize: '24px'}} total={104} >
              <Avatar  alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              <Avatar  alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              <Avatar  alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
              <Avatar  alt="Trevor Henderson" src="/static/images/avatar/5.jpg"/>
            </AvatarGroup>
        </Box>
      </Container>
      <Box sx={{ flex: 1 }}>
        <img src={bannerimg} alt={"banner"} />
      </Box>
    </BannerContainer>
  );
}

export default Banner