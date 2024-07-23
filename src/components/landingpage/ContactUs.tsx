import {
  Box,
  IconButton,
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
            pointerEvents: "none",
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
              <Box p={1} pl={0} mb={11}>
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
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
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
        </Box>
      </Box>
    </ContactUsContainer>
  );
};

export default ContactUs;
