import { Box, Button, styled, Typography } from "@mui/material";

// img
import cube_icon from "../../assets/icons/cube_icon.svg";
import band_img from "../../assets/img/band_img.png";
import { coreValuesContent } from "../../utils/constants";

const CoreValuesContainer = styled(Box)({
  width: "100%",
  minHeight: "30vh",
  backgroundImage: `url(${band_img})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const CoreValues = () => {
  return (
    <CoreValuesContainer>
      <Box
        sx={{
          width: "80%",
          margin: "auto",
          heigth: "inherith",
          display: "flex",
          py: 4,
          gap: "2rem",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* LHS */}
        <Box flex={{ xs: 1, md: 0.6 }}>
          <Box sx={{ color: "#fff", textAlign: "left" }}>
            <Box
              sx={{ display: "flex", gap: ".75rem", alignItems: "flex-end" }}
            >
              <img src={cube_icon} alt={"icon"} />
              <Typography variant="h3">Core Values</Typography>
            </Box>
            <Typography variant="body1" sx={{ fontSize: "20px", mt: 2 }}>
              We are committed to fostering a culture of accountability, taking
              ownership of our actions and decisions, and continuously striving
              for improvement
            </Typography>
            <Button
              variant="outlined"
              sx={{
                borderRadius: 1,
                borderColor: "#fff",
                color: "#fff",
                mt: 2,
                width: { xs: "100%", md: "auto" },
                display: { xs: "block", md: "inline-block" },
              }}
            >
              Create an account
            </Button>
          </Box>
        </Box>
        {/* RHS */}
        <Box
          flex={1}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: "28px",
          }}
        >
          {coreValuesContent.map((el, ind) => (
            <Box
              key={ind}
              sx={{
                border: "1px solid #fff",
                minWidth: "3rem",
                minHeigth: "3rem",
                width: { xs: "100%", md: "15rem" },
                heigth: "5rem",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: ".95rem",
                padding: "2rem",
                borderRadius: 1,
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                boxShadow: "0px 0px 3px #fff",
              }}
            >
              <img
                src={el.icon}
                alt={"icons"}
                width={"50rem"}
                height={"50rem"}
              />
              <Typography
                sx={{
                  textShadow: "0px 0px 4px #fff",
                }}
                variant="h6"
                component={"h6"}
              >
                {el.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </CoreValuesContainer>
  );
};

export default CoreValues;
