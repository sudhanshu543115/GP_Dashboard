import { createSlice } from "@reduxjs/toolkit";

/* =========================
   Helpers
========================= */

const loadAuthFromStorage = () => {
  try {
    const data = localStorage.getItem("auth");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveAuthToStorage = (authData) => {
  localStorage.setItem("auth", JSON.stringify(authData));
};

const clearAuthStorage = () => {
  localStorage.removeItem("auth");
};

/* =========================
   Initial State
========================= */

const storedAuth = loadAuthFromStorage();

const initialState = {
  user: storedAuth?.user || null,
  token: storedAuth?.token || null,
  isAuthenticated: !!storedAuth?.token,
  loading: false,
  error: null
};

/* =========================
   Slice
========================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      const { user, token } = action.payload;

      state.loading = false;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;

      saveAuthToStorage({ user, token });
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    setCredentials: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      saveAuthToStorage({ user, token });
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      clearAuthStorage();
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  setCredentials,
  logout
} = authSlice.actions;

export default authSlice.reducer;