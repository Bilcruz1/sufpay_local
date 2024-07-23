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

  //  const handleNavClick = (id: string) => {
  //    const element = document.getElementById(id);
  //    if (element) {
  //      const yOffset = -64;
  //       const y =
  //         element.getBoundingClientRect().top + window.pageYOffset + yOffset;
  //      window.scrollTo({ top: y, behavior: "smooth"})
  //     //  element.scrollIntoView({ behavior: "smooth" });
  //    }
  //    handleClose();
  //  };

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y =
        element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    handleClose();
  };
       
  return (
    <AppBar
      sx={{
        position: { sx: "relative", md: "fixed" },
        width: { xs: "100%", md: "80%" },
        margin: "auto",
        top: { sx: 0, md: "2.5rem" },
        borderRadius: { sx: "none", md: "40px" },
        backgroundColor: "rgba(0, 0, 0,.4)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        border: { md: "1px solid rgba(255, 255, 255, 0.3)" },
        px: { xs: "10px", md: "40px" },
        py: { xs: "6px", md: "12px" },
        right: 0,
        left: 0,
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
            <img src={logo} alt={"sufpay logo"} width={"80%"} />
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
                // href={`#${el.link}`}
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
            {/* uncemment after integration */}
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
              <MenuIcon color={"primary"} />
            </IconButton>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {navList.map((el, ind) => (
                <MenuItem key={ind} onClick={handleClose}>
                  <Link
                    onClick={() => handleNavClick(`${el.link}`)}
                    sx={{ color: "#797979" }}
                    href={`#${el.link}`}
                  >
                    {el.title}
                  </Link>
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
