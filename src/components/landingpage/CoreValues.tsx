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
  padding: "6rem 0"
});

const CoreValues = () => {
  return (
    <CoreValuesContainer>
      <Box
        sx={{
          width: { xs: "90%", md: "80%" },
          margin: "auto",
          heigth: "inherith",
          display: "flex",
          gap: "2rem",
          flexDirection: { xs: "column", md: "row" },
          flexWrap: "wrap",
        }}
      >
        {/* LHS */}
        <Box flex={{ xs: 1, md: 0.6 }}>
          <Box sx={{ color: "#fff", textAlign: "left" }}>
            <Box sx={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
              <Box
                component="img"
                src={cube_icon}
                alt="icon img"
                sx={{
                  width: "2em",
                  height: "2em",
                  display: "block",
                  flexWrap: "wrap",
                }}
              />
              <Typography variant="h4" component={"h2"} sx={{ color: "#fff" }}>
                Core Values
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.25rem", mt: 2, color: "#fff" }}
            >
              We are committed to fostering a culture of accountability, taking
              ownership of our actions and decisions, and continuously striving
              for improvement
            </Typography>
            {/* <Button
              variant="outlined"
              sx={{
                borderRadius: ".7rem",
                mt: 2,
                width: { xs: "100%", md: "auto" },
                display: { xs: "block", md: "inline-block" },
                py: "1rem",
                px: "2.125rem",
              }}
            >
              Create an account
            </Button> */}
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
            gap: "1.75rem",
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
                // boxShadow: "0px 0px 3px #fff",
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
                  color: "#fff"
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
