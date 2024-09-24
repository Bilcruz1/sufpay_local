import { Box, Stack, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import Rhs from "./Rhs";
import logo from "../../assets/img/sufpay_logo_black.svg";

interface IProps {
  component: ReactNode;
  header: string;
}

const SignUpLayout: React.FC<IProps> = ({ header, component }) => {
  return (
    <Box
      height={{ md: "100vh" }}
      width={"100%"}
      sx={{
        minHeight: "100vh",
      }}
    >
      <Stack direction={"row"} height={"100vh"}>
        {/* lhs */}
        <Box
          flex={{ xs: 1, md: 0.6 }}
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={{ xs: "flex-start", md: "center" }}
          mt={{ xs: 4 }}
        >
          <Box width={{ xs: "90%", md: "60%" }} mb={4}>
            <>
              
              <Box sx={{textAlign: 'center', width: "100%"}}>
                <Box
                  component={"img"}
                  src={logo}
                  alt={"sufpay logo"}
                  sx={{alignSelf: "center"}}
                />
              </Box>

              <Typography
                variant={"h3"}
                component={"h1"}
                textAlign={"center"}
                mb={4}
                mt={4}
              >
                {header}
              </Typography>
              <Box>{component}</Box>
            </>
          </Box>
        </Box>
        {/* rhs */}
        <Box
          component={"div"}
          flex={0.4}
          width={"100%"}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <Rhs />
        </Box>
      </Stack>
    </Box>
  );
};

export default SignUpLayout;
