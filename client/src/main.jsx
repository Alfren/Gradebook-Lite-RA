import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./AppRouter.jsx";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { Provider } from "react-redux";
import { api } from "./store/rtk.js";
import { store } from "./store/store.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApiProvider api={api}>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </ApiProvider>
  </StrictMode>
);
