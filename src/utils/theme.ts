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
      fontSize: "3rem", // 48px
      lineHeight: "1.2",
      fontWeight: 500,
      "@media (max-width:960px)": {
        fontSize: "2.5rem", // 40px
      },
      "@media (max-width:600px)": {
        fontSize: "2rem", // 36px
      },
    },
    h2: {
      fontSize: "2.5rem", // 40px
      lineHeight: "1.3",
      fontWeight: 500,
      "@media (max-width:960px)": {
        fontSize: "2.25rem", // 36px
      },
      "@media (max-width:600px)": {
        fontSize: "1.75rem", // 32px
      },
    },
    h3: {
      fontSize: "1.75rem", // 28px
      lineHeight: "1.4",
      fontWeight: 500,
      "@media (max-width:960px)": {
        fontSize: "1.5rem", // 24px
      },
      "@media (max-width:600px)": {
        fontSize: "1.25rem", // 20px
      },
    },
    h4: {
      fontSize: "1.5rem", // 24px
      lineHeight: "1.5",
      fontWeight: 500,
      "@media (max-width:960px)": {
        fontSize: "1.375rem", // 22px
      },
      "@media (max-width:600px)": {
        fontSize: "1.25rem", // 20px
      },
    },
    h5: {
      fontSize: "1.25rem", // 20px
      lineHeight: "1.6",
      fontWeight: 400,
      "@media (max-width:960px)": {
        fontSize: "1.125rem", // 18px
      },
      "@media (max-width:600px)": {
        fontSize: "1rem", // 16px
      },
    },
    h6: {
      fontSize: "1.2rem", // 19.2px
      lineHeight: "1.7",
      fontWeight: 400,
      "@media (max-width:960px)": {
        fontSize: "1rem", // 16px
      },
      "@media (max-width:600px)": {
        fontSize: "0.875rem", // 14px
      },
    },
    body1: {
      fontSize: "1rem", // 16px
      lineHeight: "1.5",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem", // 14px
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
          fontSize: "1rem", // 16px
          px: "2.5rem", // 40px
          py: "1rem", // 16px
          borderRadius: 32, // 8px as default.
          fontWeight: 500,
          "@media (max-width:960px)": {
            fontSize: "0.875rem", // 14px
            px: "2rem", // 32px
            py: "0.875rem", // 14px
          },
          "@media (max-width:600px)": {
            fontSize: "0.75rem", // 12px
            px: "1.5rem", // 24px
            py: "0.75rem", // 12px
          },
        },
        text: {
          textTransform: "none",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: "1rem", // 16px
          textTransform: "capitalize",
          cursor: "pointer",
          textDecoration: "none",
          fontWeight: "semibold",
          position: "relative",
          fontFamily: "Poppins, Arial, sans-serif",
          "@media (max-width:960px)": {
            fontSize: "0.875rem", // 14px
          },
          "@media (max-width:600px)": {
            fontSize: "0.75rem", // 12px
          },
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

    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#666666",
        },
        h1: {
          color: "#333333", 
        },
        h2: {
          color: "#333333", 
        },
        h3: {
          color: "#333333", 
        },
        h4: {
          color: "#333333", 
        },
        h5: {
          color: "#333333", 
        },
        h6: {
          color: "#333333", 
        },
      },
    },
  },
});
