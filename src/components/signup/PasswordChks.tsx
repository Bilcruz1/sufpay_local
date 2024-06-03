import { Box, Grid, Typography } from '@mui/material';
import CircleIcon from "@mui/icons-material/Circle";
import React, { FC } from 'react'
import { passwordChecks } from '../../utils/constants';
import { IPasswordChkProps } from '../../utils/interfaces';



const PasswordChks: FC<IPasswordChkProps> = (props) => {
  return (
    <>
      <Box
        display={{ xs: "none", md: "block" }}
        textAlign={"left"}
        color={"#666666"}
      >
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {passwordChecks.map((el, ind) => (
            <Grid key={ind} item xs={4}>
              <CircleIcon
                sx={{ color: "#666666", width: "10px", height: "10px" }}
              />
              <Typography ml={2} component={"span"} sx={{ fontSize: "12px" }}>
                {el}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default PasswordChks