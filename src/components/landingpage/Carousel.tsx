import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  styled,
} from "@mui/material";
import { ourServices } from "../../utils/constants";
import { IServices } from "../../utils/interfaces";

const CustomSwiper = styled(Swiper)({
  ".swiper-pagination-bullet": {
    backgroundColor: "#d9d9d9",
    opacity: 1,
    marginTop: "2rem", 
  },
  ".swiper-pagination-bullet-active": {
    backgroundColor: "#000000",
  },
});

const groupItems = (items: IServices[], itemsPerGroup: number) => {
  const groupedItems = [];
  for (let i = 0; i < items.length; i += itemsPerGroup) {
    groupedItems.push(items.slice(i, i + itemsPerGroup));
  }
  return groupedItems;
};

const Carousel = () => {
  const groupedItems = groupItems(ourServices, 3);

  return (
    <Box
      sx={{
        width: { xs: "100%" },
        mt: "2rem",
        display: { xs: "block", sm: "none" },
        backgroundColor: "#f4f4f4",
      }}
    >
      <CustomSwiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        spaceBetween={20}
      >
        {groupedItems.map((group, index) => (
          <SwiperSlide key={index}>
            <Grid container spacing={2}>
              {group.map((el, ind) => (
                <Grid item xs={12} md={4} key={ind}>
                  <Card
                    sx={{
                      width: "100%",
                      backgroundColor: "#f4f4f4",
                      border: "none",
                      boxShadow: "none",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={el.img}
                      alt={el.title}
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
          </SwiperSlide>
        ))}
        <div className="custom-swiper-pagination" />
      </CustomSwiper>
    </Box>
  );
};

export default Carousel;
