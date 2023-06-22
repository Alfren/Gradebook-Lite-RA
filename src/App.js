import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { SnackbarProvider, useSnackbar } from "notistack";
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react";
import { Provider } from "react-redux";
import { api } from "./store/rtk";
import { store } from "./store/store";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import TitleBar from "./components/TitleBar";
import { Home, Error, Login } from "./pages/index";

export default function App() {
  const [mode, setMode] = useState(true);
  const toggleTheme = () => setMode(!mode);
  const theme = createTheme({ palette: { mode: mode ? "dark" : "light" } });

  const [permitted, keepUser] = useState([null, false]);

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
      element: <TitleBar toggleTheme={toggleTheme} />,
      children: permitted[1]
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
        : [{ path: "/", element: <Login keepUser={keepUser} /> }],
      errorElement: <ErrorBoundary />,
    },
  ]);

  return (
    <SnackbarProvider
      preventDuplicate
      maxSnack={5}
      action={(snackbarKey) => (
        <SnackbarCloseButton snackbarKey={snackbarKey} />
      )}
    >
      <ApiProvider api={api}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
          </ThemeProvider>
        </Provider>
      </ApiProvider>
    </SnackbarProvider>
  );
}

function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <Error />;
}
