import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
    },

    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload.user };
    },
    setCurrentUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  authStart,
  loginSuccess,
  authFailure,
  logout,
  setCurrentUser,
  clearError,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
