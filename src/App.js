import { useState } from "react";
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

export default function App() {
  const [mode, setMode] = useState(true);
  const toggleTheme = () => setMode(!mode);
  const theme = createTheme({ palette: { mode: mode ? "dark" : "light" } });

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
