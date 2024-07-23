import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#AAC645",
    },
    secondary: {
      main: "#fff",
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    fontSize: 14,
    h1: {
      fontSize: "48px",
      lineHeight: "1.2",
      fontWeight: 700,
    },
    h2: {
      fontSize: "40px",
      lineHeight: "1.3",
      fontWeight: 700,
    },
    h3: {
      fontSize: "28px",
      lineHeight: "1.4",
      fontWeight: 700,
    },
    h4: {
      fontSize: "24px",
      lineHeight: "1.5",
      fontWeight: 700,
    },
    h5: {
      fontSize: "20px",
      lineHeight: "1.6",
      fontWeight: 700,
    },
    h6: {
      fontSize: "19.2px",
      lineHeight: "1.7",
      fontWeight: 700,
    },
    body1: {
      fontSize: "16px",
      lineHeight: "1.5",
      fontWeight: 400,
    },
    body2: {
      fontSize: "14px",
      lineHeight: "1.5",
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          px: 1,
          py: 0.25,
          borderRadius: 1, // 4px as default.
        },
        label: {
          padding: "initial",
        },
        icon: {
          mr: 0.5,
          ml: "-2px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
          fontSize: "16px",
          px: "40px",
          py: "16px",
          borderRadius: 32, // 8px as default.
        },
        text: {
          textTransform: "none",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: 16,
          textTransform: "capitalize",
          cursor: "pointer",
          textDecoration: "none",
          fontWeight: "semibold",
          position: "relative",
          fontFamily: "Poppins, Arial, sans-serif",
          "&:focus::after": {
            content: '""',
            position: "absolute",
            left: 0,
            bottom: -2,
            width: "2ch",
            borderBottom: "2px solid currentColor",
          },
        },
      },
    },
  },
});
