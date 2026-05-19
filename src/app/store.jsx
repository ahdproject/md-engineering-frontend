import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import billReducer from './BillSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bills: billReducer,
  },
});