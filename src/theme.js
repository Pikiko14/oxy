import { alpha, createTheme } from "@mui/material/styles";

export const brandColors = {
  oxyBlue: "#00539B",
  oxyRed: "#B5121B",
  morningBlue: "#A4DDF2",
  dayBlue: "#1D83DE",
  midnightBlue: "#002E4D",
  oceanAqua: "#009E99",
  sunriseOrange: "#FF9E1B",
  forestGreen: "#7A9C00",
  aluminumGray: "#98999B",
  slateGray: "#2B2D30",
};

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brandColors.oxyBlue,
      dark: brandColors.midnightBlue,
      light: brandColors.dayBlue,
    },
    secondary: {
      main: brandColors.oxyRed,
    },
    info: {
      main: brandColors.dayBlue,
    },
    success: {
      main: brandColors.oceanAqua,
    },
    warning: {
      main: brandColors.sunriseOrange,
    },
    error: {
      main: brandColors.oxyRed,
    },
    text: {
      primary: brandColors.midnightBlue,
      secondary: brandColors.slateGray,
    },
    background: {
      default: "#f3f5f7",
      paper: "#ffffff",
    },
    divider: alpha(brandColors.midnightBlue, 0.16),
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    h4: {
      letterSpacing: "-0.02em",
      fontWeight: 700,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        size: "large",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 12,
          minHeight: 46,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.88),
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
