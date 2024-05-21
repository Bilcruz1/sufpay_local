import { Box, Stack, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import Rhs from "./Rhs";

interface IProps {
  component: ReactNode;
  header: string;
}

const SignUpLayout: React.FC<IProps> = ({ header, component }) => {
  return (
    <Box height={"100vh"} width={"100%"}>
      <Stack direction={"row"} height={"100vh"}>
        {/* lhs */}
        <Box
          flex={2}
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box width={"60%"}>
            <>
              <Typography
                variant={"h3"}
                component={"h1"}
                textAlign={"center"}
                mb={4}
              >
                {header}
              </Typography>
              <Box>{component}</Box>
            </>
          </Box>
        </Box>
        {/* rhs */}
        <Box component={"div"} flex={1} width={"100%"}>
          <Rhs />
        </Box>
      </Stack>
    </Box>
  );
};

export default SignUpLayout;
