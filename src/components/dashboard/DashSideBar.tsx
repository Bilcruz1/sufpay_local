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
import HomeIcon from "@mui/icons-material/Home";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";




const DashSideBar = () => {
   const [activeItem, setActiveItem] = useState("Home");

   const handleListItemClick = (item: string) => {
     setActiveItem(item);
   }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#a0cf64",
        },
      }}
    >
      <List>
        <ListItem>
          <Typography variant="h4" color="primary" fontWeight="bold">
            Sufpay
          </Typography>
        </ListItem>
        <ListItem
          button
          onClick={() => handleListItemClick("Home")}
          sx={{
            backgroundColor: activeItem === "Home" ? "#8bc34a" : "inherit",
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          button
          onClick={() => handleListItemClick("Transactions")}
          sx={{
            backgroundColor:
              activeItem === "Transactions" ? "#8bc34a" : "inherit",
          }}
        >
          <ListItemIcon>
            <CreditCardIcon />
          </ListItemIcon>
          <ListItemText primary="Transactions" />
        </ListItem>
        <ListItem
          button
          onClick={() => handleListItemClick("Notification")}
          sx={{
            backgroundColor:
              activeItem === "Notification" ? "#8bc34a" : "inherit",
          }}
        >
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary="Notification" />
        </ListItem>
        <ListItem
          button
          onClick={() => handleListItemClick("Help")}
          sx={{
            backgroundColor: activeItem === "Help" ? "#8bc34a" : "inherit",
          }}
        >
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </ListItem>
        <ListItem
          button
          onClick={() => handleListItemClick("Settings")}
          sx={{
            backgroundColor: activeItem === "Settings" ? "#8bc34a" : "inherit",
          }}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
      <Box sx={{ position: "absolute", bottom: 20, left: 10 }}>
        <Avatar alt="Hassan Garba" src="/static/images/avatar/1.jpg" />
        <Typography variant="caption">Hassan Garba</Typography>
      </Box>
    </Drawer>
  );
};

export default DashSideBar;
