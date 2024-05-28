import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import img from "../../assets/img/section_two_bg.png";

const FeatureSectionTwo = () => {
  return (
    <Box
      sx={{
        height: "60vh",
        width: "100%",
      }}
    >
      <Stack
        sx={{
          width: "100%",
          height: "100%",
        }}
        direction={"row"}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
          flex={1.2}
        >
          <img src={img} alt={"section image"} width={"100%"} height={"100%"} />
        </Box>
        <Box
          flex={1.65}
          sx={{
            width: "100%",
            height: "100%",
            textAlign: "left",
          }}
        >
          <Box
            p={4}
            sx={{
              width: "80%",
              margin: "auto",
            }}
          >
            <Typography
              variant="h3"
              mt={"1rem"}
              gutterBottom
            >
              Creating Extraordinary Customer Experience
            </Typography>
            <Typography variant={"body1"}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              bibendum eget morbi dignissim eu pharetra consequat montes,
              sagittis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam bibendum eget morbi dignissim eu pharetra consequat montes,
              sagittis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam bibendum eget morbi dignissim eu pharetra consequat montes,
              sagittis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam bibendum eget morbi dignissim eu pharetra consequat montes,
              sagittis.
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default FeatureSectionTwo;
