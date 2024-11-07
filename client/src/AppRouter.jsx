import { useEffect, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
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

export default function AppRouter() {
  const { permitted } = useSelector((state) => state.user);
  const [mode, setMode] = useState(false);
  const toggleTheme = () => {
    const temp = !mode;
    setMode(temp);
    window.localStorage.setItem("Z3JhZGVib29rLW1vZGU=", temp);
  };

  useEffect(() => {
    const storedMode = window.localStorage.getItem("Z3JhZGVib29rLW1vZGU=");
    if (storedMode === null) {
      setMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } else {
      setMode(JSON.parse(storedMode));
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: mode ? "dark" : "light",
      background: { default: mode ? blue[900] : blue[400] },
    },
  });

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
      errorElement: <ErrorBoundary />,
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
