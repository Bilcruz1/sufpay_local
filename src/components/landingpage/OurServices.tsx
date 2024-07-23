import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { ourServices } from "../../utils/constants";
import { IHeaderProps } from "../../utils/interfaces";
import Carousel from "./Carousel";

const OurServicesContainer = styled(Box)({
  width: "100%",
  minHeight: "70vh",
  backgroundColor: "#f4f4f4",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "2rem",
  py: 4,
});

const OurServices: React.FC<IHeaderProps> = ({id}) => {
  return (
    <OurServicesContainer id={id}>
      <Box sx={{ width: "80%", margin: "auto", py: "6rem" }}>

        <Typography sx={{textAlign: "center"}} variant="h2" gutterBottom>
          Our <span style={{ color: "#AAC645" }}>Services</span>
        </Typography>

        {/* service list for xs < */}
        <Carousel />

        {/* service list for sm > */}
        <Grid
          sx={{ mt: "2rem", display: { xs: "none", sm: "flex" } }}
          container
          spacing={4}
          justifyContent="space-between"
        >
          {ourServices.map((el, ind) => (
            <Grid
              item
              key={ind}
              xs={12}
              sm={6}
              md={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card sx={{ maxWidth: 345, width: "100%" }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image={el.img}
                  title="green iguana"
                />
                <CardContent sx={{ textAlign: "left" }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {el.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {el.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </OurServicesContainer>
  );
};

export default OurServices;
