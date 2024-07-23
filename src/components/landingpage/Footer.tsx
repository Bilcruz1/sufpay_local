import {
  Box,
  Container,
  IconButton,
  Link,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { navList, socails } from "../../utils/constants";
import arrow_icon from "../../assets/icons/arrow_up.svg";
import location_icon from "../../assets/icons/location_icon.svg";

const FooterContainer = styled(Box)({
  backgroundColor: "#AAC645",
  width: "100%",
  color: "#fff",
  padding: "60px 0px",
  textAlign: "center",
});

const Footer = () => {
  return (
    <FooterContainer>
      <Container
        sx={{
          display: "flex",
          justifyItems: "center",
          alignItems: "center",
          flexDirection: "column",
          width: { xs: "80%", md: "60%" },
          gap: "40px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "space-between" },
            alignItems: { xs: "flex-start", md: "center" },
            flexDirection: "row",
            width: "100%",
            flexWrap: "wrap",
            gap: ".75rem",
          }}
        >
          {navList.map((el, ind) => (
            <Link href={`#${el.link}`} key={ind} sx={{ color: "#fff" }}>
              {el.title}
            </Link>
          ))}
        </Box>

        {/* address for small screen */}

        {/* <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        > */}
        <Box
          sx={{
            width: "100%",
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              // gap: ".7rem",
              textAlign: "left",
              color: "#fff",
              flexDirection: "column",
            }}
          >
            <Box>
              <img src={location_icon} alt={"icon"} />
            </Box>
            <Box>
              <Typography variant={"h6"}>Address</Typography>
              <Typography variant="body1" component={"p"}>
                1234 Innovation Street, Lagos, Nigeria
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-start",
              alignItems: "flex-start",
              width: "100%",
              marginTop: "40px",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" color={"#fff"}>
              +234-123-4567
            </Typography>
            <Typography variant="h6" color={"#fff"}>
              info@sufpay.com
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
              }}
            >
              {socails.map((el, ind) => (
                <Tooltip
                  key={ind}
                  title="Delete"
                  sx={{ background: "#333333" }}
                >
                  <IconButton>
                    <img
                      width={"25rem"}
                      height={"25rem"}
                      src={el.icon}
                      alt={`${el.title} socails icon`}
                    />
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Box>
        {/* </Box> */}

        <Typography variant="overline" display="block" gutterBottom>
          © Copyright ©2021 All rights reserved | Powered by SufPay
        </Typography>

        <Tooltip
          title="To the Top"
          sx={{
            backgroundColor: "#9BB830",
          }}
        >
          <IconButton>
            <img src={arrow_icon} alt={"icon"} />
          </IconButton>
        </Tooltip>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
