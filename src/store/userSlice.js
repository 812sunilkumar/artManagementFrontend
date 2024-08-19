import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async thunks
export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/users/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  } catch (error) {
    // Handle backend and network errors
    if (error.response) {
      return rejectWithValue(error.response.data.error || 'An unknown error occurred');
    } else {
      return rejectWithValue('Network error or request failed');
    }
  }
});

export const register = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      return rejectWithValue(error.response.data.error || 'An unknown error occurred');
    } else {
      return rejectWithValue('Network error or request failed');
    }
  }
});

export const fetchProfile = createAsyncThunk('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    if (error.response) {
      return rejectWithValue(error.response.data.error || 'An unknown error occurred');
    } else {
      return rejectWithValue('Network error or request failed');
    }
  }
});

// Slice
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
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Error message from the backend or network error
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Error message from the backend or network error
      })
      // Fetch profile cases
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Error message from the backend or network error
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
