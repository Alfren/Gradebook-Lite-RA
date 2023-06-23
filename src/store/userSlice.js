import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    username: undefined,
    permitted: false,
    id: undefined,
  },
  reducers: {
    setAssets: (state, { payload }) => {
      const { username, permitted, id } = payload;
      if (username) state.username = username;
      if (permitted !== undefined && typeof permitted === "boolean")
        state.permitted = permitted;
      if (id) state.id = id;
    },
    logout: (state) => {
      state.username = undefined;
      state.permitted = false;
      state.id = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAssets: setUserAssets, logout } = userSlice.actions;

export default userSlice.reducer;
