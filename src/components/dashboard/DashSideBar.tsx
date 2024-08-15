import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import { DashboadNav } from "../../utils/constants";
import {useNavigate} from 'react-router-dom'
import dash_logo from '../../assets/img/dash_Sufpay.svg'
import exit_icon from '../../assets/icons/exit_icon.svg'

const DashSideBar = () => {
  const [activeItem, setActiveItem] = useState(DashboadNav[0].link);
  const navigate = useNavigate()

   const handleListItemClick = (link: string) => {
     setActiveItem(link);
     navigate(link)
   }

  return (
    <Box
      // variant="permanent"
      sx={{
        backgroundColor: "#AAC645",
        padding: "0 .7rem",
        color: "#FFF",
        width: "100%",
        flexShrink: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#a0cf64",
        },
      }}
    >
      <List>
        <ListItem sx={{ marginBottom: "2rem" }}>
          <Box component={"img"} src={dash_logo} alt={"sufpay_logo"} />
        </ListItem>

        {DashboadNav.map((el, ind) => (
          <ListItem
            key={ind}
            onClick={() => handleListItemClick(el.link)}
            sx={{
              backgroundColor: activeItem === el.link ? "#8CAE14" : "inherit",
              color: "#fff",
              borderRadius: ".3rem",
              cursor: "pointer",
            }}
          >
            <ListItemIcon>
              <Box component={"img"} src={el.icon} alt={`${el.title}_icon`} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ color: "#fff" }}
              sx={{ color: "#fff" }}
              primary={el.title}
            />
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          width: "100%",
          marginBottom: "2rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: ".5rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Avatar alt="Hassan Garba" src="/static/images/avatar/1.jpg" />
          <Typography variant="caption" sx={{ color: "#fff" }}>
            Hassan Garba
          </Typography>
        </Box>

        <Box
          component={"img"}
          src={exit_icon}
          alt={"exit_icon"}
          sx={{ cursor: "pointer", width: "1rem", height: "1rem" }}
        />
      </Box>
    </Box>
  );
};

export default DashSideBar;
