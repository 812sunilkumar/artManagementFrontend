import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import artReducer from './artSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    art: artReducer,
    admin: adminReducer,
  },
});