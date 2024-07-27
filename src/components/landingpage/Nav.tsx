import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Container,
  Link,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import { navList } from "../../utils/constants";
import logo from "../../assets/img/logo.svg";
import MenuIcon from "@mui/icons-material/Menu";

const Nav = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    handleClose();
  };

  return (
    <AppBar
      sx={{
        position: { xs: "fixed", md: "fixed" },
        width: { xs: "100%", md: "80%" },
        margin: "auto",
        top: { xs: 0, md: "2.5rem" },
        borderRadius: { xs: "none", md: "40px" },
        backgroundColor: "rgba(0, 0, 0,.4)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        border: { md: "1px solid #ffffff29" },
        px: { xs: "10px", md: "40px" },
        py: { xs: "6px", md: "12px" },
        right: 0,
        left: 0,
        zIndex: 1300, // Ensure the navbar is above other elements
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {/* logo */}
          <Box sx={{}}>
            <Box
              component={"img"}
              src={logo}
              alt={"sufpay logo"}
              width={"80%"}
            />
          </Box>

          {/* nav links md */}
          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
                textTransform: "uppercase",
              },
              gap: "40px",
            }}
          >
            {navList.map((el, ind) => (
              <Link
                key={ind}
                onClick={() => handleNavClick(`${el.link}`)}
                sx={{
                  color: "white",
                  display: "block",
                  textTransform: "uppercase",
                }}
              >
                {el.title}
              </Link>
            ))}
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: ".7rem" }}>
            {/* uncomment after integration */}
            {/* <Button variant="text" size="small">
                Login
              </Button>
              <Button variant="contained" size="small">
                sign up
              </Button> */}
          </Box>

          {/* sm menu */}
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ display: { xs: "inline-block", md: "none" } }}
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <MenuIcon sx={{ color: "#fff" }} />
            </IconButton>

            {/* where the menu should go */}
            <Menu
              id="demo-positioned-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              PaperProps={{
                sx: {
                  width: "inherit",
                  maxWidth: "inherit",
                  backgroundColor: "#2A2A2A",
                  borderRadius: "0",
                  textAlign: "center",
                  padding: "1rem 0",
                  marginTop: ".3rem",
                  boxShadow: "none",
                  left: 0,
                  right: 0,
                },
              }}
            >
              {navList.map((el, ind) => (
                <MenuItem
                  key={ind}
                  onClick={() => handleNavClick(`${el.link}`)}
                  sx={{
                    width: "100%",
                    justifyContent: "center",
                    textTransform: "uppercase",
                    color: "#fff",
                  }}
                >
                  {el.title}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Nav;
