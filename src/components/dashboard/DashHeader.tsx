import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import notification_icon from "../../assets/icons/notification_icon.svg";

const DashHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid #66666628", marginBottom: "1rem" }}
    >
      <Toolbar>
        <Box display="flex" flexGrow={1}>
          <Typography variant="h4" color="textPrimary">
            Home
          </Typography>
        </Box>

        {!isMobile && (
          <>
            <IconButton aria-label="show notifications" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <Box
                  component={"img"}
                  alt={"notification_icon"}
                  src={notification_icon}
                  width={"1.5rem"}
                  height={"1.5rem"}
                />
              </Badge>
            </IconButton>
          </>
        )}

        {isMobile && (
          <IconButton edge="end" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default DashHeader;
