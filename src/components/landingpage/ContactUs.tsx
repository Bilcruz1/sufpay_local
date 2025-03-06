import {
  Box,
  IconButton,
  Link,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { ContactUsForm } from "../../forms";
import { socails } from "../../utils/constants";
import React from "react"
// imgs
import contact_us_img from "../../assets/img/contact_us_img.png";
import location_icon from "../../assets/icons/location_icon.svg";
import { IHeaderProps } from "../../utils/interfaces";

const ContactUsContainer = styled(Box)({
  display: "flex",
  minHeight: "80vh",
  width: "100%",
});

const ContactUs: React.FC<IHeaderProps> = ({id}) => {
  return (
    <ContactUsContainer id={id}>
      {/* form */}
      <Box width={"100%"} height={"inherit"}>
        <ContactUsForm />
      </Box>

      {/* background bg */}
      <Box
        width={"100%"}
        height={"inherit"}
        sx={{
          backgroundImage: `url(${contact_us_img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: { xs: "none", md: "block" },
        }}
      >
        {/* content container*/}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom, #ccc, #333 50%, #111 80%, #000 100%)",
            opacity: 0.5,
          }}
        >
          <Box
            p={7}
            sx={{
              width: "100%",
              height: "inherit",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: ".7rem",
                textAlign: "left",
                color: "#fff",
              }}
            >
              <Box p={1} pl={0} mb={"2rem"}>
                <Box
                  component="img"
                  src={location_icon}
                  alt="icon"
                  sx={{
                    width: "2em",
                    height: "2em",
                    display: "block",
                  }}
                />
              </Box>
              <Box>
                <Typography variant={"h6"} color={"#fff"}>
                  Address
                </Typography>
                <Typography variant="body1" component={"p"} color={"#fff"}>
                48 Anthony Enahoro Street Utako, Abuja.
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              {/* <Typography variant="h6" color={"#fff"}>
                +234-123-4567
              </Typography> */}
              <Typography variant="h6" color={"#fff"}>
              info@sufpay.ng
              </Typography>
              <Box
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
                      sx={{ background: "#333", cursor: "pointer" }}
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
        </Box>
      </Box>
    </ContactUsContainer>
  );
};

export default ContactUs;
