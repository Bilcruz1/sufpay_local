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
  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <FooterContainer>
      <Container
        sx={{
          display: "flex",
          justifyItems: "center",
          alignItems: "center",
          flexDirection: "column",
          width: { xs: "90%", md: "40%" },
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
            <Link
              // href={`#${el.link}`}
              onClick={() => handleNavClick(`${el.link}`)}
              key={ind}
              sx={{ color: "#fff" }}
            >
              {el.title}
            </Link>
          ))}
        </Box>

        {/* address for small screen */}

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
              textAlign: "left",
              color: "#fff",
              flexDirection: "column",
            }}
          >
            <Box>
              <img src={location_icon} alt={"icon"} />
            </Box>
            <Box>
              <Typography variant={"h6"} color={"#fff"}>
                Address
              </Typography>
              <Typography
                variant="body1"
                component={"p"}
                mt={".5rem"}
                color={"#fff"}
              >
                86 Lome Crescent Wuse
                Zone 7, wupa. Abuja.
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
            {/* <Typography variant="h6" color={"#fff"}>
              +234-123-4567
            </Typography> */}
            <Typography variant="h6" color={"#fff"}>
              info@sufpay.com
            </Typography>
            <Box
              mt={".5rem"}
              sx={{
                display: "flex",
                gap: "1rem",
              }}
            >
              {socails.map((el, ind) => (
                  <Link
                    href={el.link}
                    target="_blank"
                    sx={{ cursor: "pointer" }}
                    key={ind}
                    rel="noopener noreferrer"
                  >
                    <Tooltip
                      title={el.title}
                      sx={{ background: "#fff", cursor: "pointer" }}
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
                  </Link>
                ))}
            </Box>
          </Box>
        </Box>

        <Typography
          variant="overline"
          color={"#fff"}
          display="block"
          gutterBottom
          sx={{
            textAlign: { xs: "left", md: "center" },
          }}
        >
          © Copyright ©2021 All rights reserved | Powered by SufPay
        </Typography>

        <Tooltip
          title="To the Top"
          onClick={() => handleNavClick(`${"home"}`)}
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
