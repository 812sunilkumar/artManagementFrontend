import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const login = createAsyncThunk('user/login', async (credentials) => {
  const response = await api.post('/users/login', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data.user;
});

export const register = createAsyncThunk('user/register', async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
});

export const fetchProfile = createAsyncThunk('user/fetchProfile', async () => {
  const response = await api.get('/users/profile');
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {
    logout: (state) => {
      state.data = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;