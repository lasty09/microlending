import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f97316", // orange-500
    },
    secondary: {
      main: "#fb923c", // orange-400
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
