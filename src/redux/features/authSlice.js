import { createSlice } from "@reduxjs/toolkit";
import { userLogin, userProfile } from "../actions/authActions";

const accessToken =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const initialState = {
  loading: false,
  isLoggedIn: false,
  userInfo: null, // for user object
  accessToken,
  error: null,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.isLoggedIn = false;
      state.accessToken = null;
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.accessToken = payload.token;
        state.isAdmin = payload.isAdmin;
        state.userInfo = payload;
      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(userProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userInfo = payload;
        state.isAdmin = payload.isAdmin;
      })
      .addCase(userProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});
export const { logout } = authSlice.actions;

export default authSlice.reducer;
