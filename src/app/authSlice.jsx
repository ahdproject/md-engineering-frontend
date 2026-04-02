import { createSlice } from '@reduxjs/toolkit';

const user  = JSON.parse(localStorage.getItem('md_user') || 'null');
const token = localStorage.getItem('md_token') || null;

const authSlice = createSlice({
  name: 'auth',
  initialState: { user, token, isAuthenticated: !!token },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user            = payload.user;
      state.token           = payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('md_token', payload.token);
      localStorage.setItem('md_user',  JSON.stringify(payload.user));
    },
    clearCredentials: (state) => {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      localStorage.removeItem('md_token');
      localStorage.removeItem('md_user');
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;