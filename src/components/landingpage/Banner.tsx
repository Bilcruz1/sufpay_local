import { Box, Button, Typography, styled } from '@mui/material'
import banner_img from "../../assets/img/banner_img.png";
import {useNavigate} from 'react-router-dom'


const BannerContainer = styled(Box)`
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  margin: "auto";
  padding-bottom: "3rem";
`;


const Banner = () => {
  const navigate = useNavigate();

const styles = {
  image: {
    width: "80%", 
    "@media (maxWidth:600px)": {
      width: "200%", 
    },
    "@media (maxWidth:900px)": {
      width: "80%", 
    },
  },
};

  return (
    <BannerContainer sx={{ marginTop: "10%", color: "#fff" }}>
      <Box>
        <Typography variant="h1" component={"h1"} sx={{ color: "#fff" }}>
          Welcome to SufPay, the forefront of financial technology innovation in
          Nigeria.
        </Typography>
        <Typography
          variant="h6"
          mt={"2rem"}
          component={"h6"}
          sx={{ color: "#fff" }}
        >
          We are dedicated to revolutionizing the digital transaction landscape,
          making financial services more accessible, secure, and efficient for
          all Nigerians. Explore our comprehensive range of services, from
          transaction facilitation and regulatory adherence to digital
          communication devices and networking solutions. Discover how SufPay
          can empower your financial and digital future.
        </Typography>
      </Box>
      {/* uncommnet when ready */}
      <Box
        sx={{
          display: "flex",
          gap: "1.25rem",
          justifyContent: "center",
          alignItems: "center",
          mt: "3.75rem",
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/signup")}
        >
          Get started
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate("/login")}
        >
          Log in
        </Button>
      </Box>

      <Box mt={{ xs: "2rem", md: "9rem" }}>
        <img src={banner_img} alt={"sufpay banner"} style={styles.image} />
      </Box>
    </BannerContainer>
  );
}

export default Banner
