import React from "react";
import { Grid, Box, Stack } from "@mui/material";
import {
  DashboardCardsContent,
  transactionsTile,
} from "../../../utils/constants";
import { DonutChart, DashboardCards, DashboardHistories} from "../..";

const DashboardLanding = () => {
  return (
    <Box>
      {/* top cards */}
      <Grid container spacing={"1rem"} sx={{}}>
        {DashboardCardsContent.map((el, ind) => (
          <Grid item xs={4} md={2} key={ind}>
            <DashboardCards title={el.title} link={el.link} icon={el.icon} />
          </Grid>
        ))}
      </Grid>

      {/* body */}
      <Grid
        container
        spacing={"1rem"}
        sx={{ marginTop: ".5rem", minHeight: "70vh" }}
      >
        {/* RHS */}
        <Grid item xs={12} md={8} sx={{}}>
          <Stack direction={"column"} spacing={"1rem"}>
            {transactionsTile.map((el, ind) => (
              <Box flex={1} sx={{ heigth: "35vh" }}>
                <DashboardHistories
                  key={ind}
                  title={el.title}
                  linkUrl={el.linkUrl}
                />
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* LHS */}
        <Grid item xs={12} md={4} sx={{}}>
          <DonutChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardLanding;
