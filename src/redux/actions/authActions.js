import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/auth/login`,
        { email, password },
        config
      );
      localStorage.setItem("accessToken", response.data.data.access_token);
      const userData = {
        userId: response.data.data.userId,
        email: response.data.data.email,
        isAdmin: response.data.data.isAdmin,
        displayName: response.data.data.displayName,
        token: response.data.data.access_token,
      };
      toast.success("Logged in successfully!");
      return userData;
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const userProfile = createAsyncThunk(
  "auth/me",
  async (arg, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${state.auth.accessToken}`,
        },
      };
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/auth/`,
        config
      );
      console.log(response.data.data);
      const userData = {
        userId: response.data.data.userId,
        email: response.data.data.email,
        isAdmin: response.data.data.isAdmin,
        displayName: response.data.data.displayName,
      };
      return userData;
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);
