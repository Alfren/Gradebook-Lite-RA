import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import TitleBar from "./components/TitleBar";
import { Home, Error, Login } from "./pages/index";
import { blue } from "@mui/material/colors";

export default function App() {
  const [mode, setMode] = useState(true);
  const toggleTheme = () => {
    const temp = !mode;
    setMode(temp);
    window.localStorage.setItem("gradebook-mode", temp);
  };

  useEffect(() => {
    const storedMode = window.localStorage.getItem("gradebook-mode");
    if (storedMode !== null) setMode(JSON.parse(storedMode));
  }, []);

  const theme = createTheme({
    palette: {
      mode: mode ? "dark" : "light",
      background: { default: mode ? blue[900] : blue[400] },
      overrides: {
        MuiCssBaseline: {
          "@global": {
            "*": {
              transition: "background 1s ease-in-out !important",
            },
          },
        },
      },
    },
  });

  const { permitted } = useSelector((state) => state.user);

  function SnackbarCloseButton({ snackbarKey }) {
    const { closeSnackbar } = useSnackbar();
    return (
      <IconButton onClick={() => closeSnackbar(snackbarKey)}>
        <Close />
      </IconButton>
    );
  }

  const router = createBrowserRouter([
    {
      element: <TitleBar toggleTheme={toggleTheme} permitted={permitted} />,
      children: permitted
        ? [
            {
              path: "/",
              element: <Home />,
            },
            {
              path: "*",
              element: <Error />,
            },
          ]
        : [{ path: "/", element: <Login /> }],
      errorElement: <ErrorBoundary />,
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        preventDuplicate
        maxSnack={5}
        action={(key) => <SnackbarCloseButton snackbarKey={key} />}
      >
        <RouterProvider router={router} />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <Error />;
}
