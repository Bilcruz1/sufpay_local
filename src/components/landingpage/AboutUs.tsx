import { Box, Divider, styled, Typography } from "@mui/material";
import React from "react";
import about_us_img from "../../assets/img/about_us_img.png";

import about_us_icon from "../../assets/icons/about_us_icon.svg";
import { aboutUs } from "../../utils/constants";
import { IHeaderProps } from "../../utils/interfaces";

const AboutUsContainer = styled(Box)({
  textAlign: "left",
  minHeight: "90vh",
  width: "100%",
  display: "flex",
  justifyItems: "center",
  alignItems: "center",
});

const AboutUs: React.FC<IHeaderProps> = ({ id }) => {
  return (
    <AboutUsContainer id={id}>
      <Box
        sx={{
          width: "80%",
          margin: "auto",
          padding: 2,
          textAlign: "center",
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row-reverse" },
          gap: "22px",
          py: "4rem",
        }}
      >
        {/* img */}
        <Box
          sx={{
            width: "100%",
            heigth: "inherit",
            flex: 1,
            backgroundColor: "#F8F8F8",
          }}
        >
          <img src={about_us_img} width={"100%"} alt="sufpay payment img" />
        </Box>

        {/* content */}
        <Box
          sx={{
            heigth: "inherit",
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: ".75rem",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <img
              src={about_us_icon}
              alt="icon img"
              style={{ width: "3em", height: "3em" }}
            />
            <Typography variant="h2" gutterBottom>
              About <span style={{ color: "#AAC645" }}>Us</span>
            </Typography>
          </Box>

          {/* body */}
          <Box
            sx={{
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {aboutUs.map((el, ind) => (
              <Box mt={"32px"} key={ind}>
                <Typography variant="h6">{el.title}</Typography>
                <Typography
                  sx={{ textAlign: "justify", mb: "32px" }}
                  variant="body1"
                >
                  {el.content}
                </Typography>
                <Divider />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </AboutUsContainer>
  );
};

export default AboutUs;
