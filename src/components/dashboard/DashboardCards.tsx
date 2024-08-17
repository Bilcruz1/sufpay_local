import { Box, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCards: React.FC<{
  icon: string;
  title: string;
  link: string;
}> = ({ icon, title, link }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minWidth: "11rem",
        minHeight: "6rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: ".9rem",
        border: "1px solid #66666628",
        borderRadius: "5px",
        color: "black",
        flexDirection: "column",
        padding: "1rem",
        cursor: "pointer",
      }}
      onClick={() => navigate(link)}
    >
      <Box
        component={"img"}
        src={icon}
        alt={`${title}_icon`}
        sx={{ width: "1rem", height: "1rem", color: "black" }}
      />
      <Typography variant="body1">{title}</Typography>
    </Box>
  );
};

export default DashboardCards;
