import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchUnapprovedUsers = createAsyncThunk('admin/fetchUnapprovedUsers', async () => {
  const response = await api.get('/admin/unapproved-users');
  return response.data;
});

export const approveUser = createAsyncThunk('admin/approveUser', async (id) => {
  const response = await api.patch(`/admin/approve-user/${id}`);
  return response.data;
});

export const createArtType = createAsyncThunk('admin/createArtType', async (name) => {
  const response = await api.post('/admin/art-types', { name });
  return response.data;
});

export const fetchDashboardMetrics = createAsyncThunk('admin/fetchDashboardMetrics', async ({ startDate, endDate }) => {
  const response = await api.get('/admin/dashboard', { params: { startDate, endDate } });
  console.log('response-fetchDashboardMetrics', response)
  return response.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: { 
    unapprovedUsers: [], 
    artTypes: [], 
    metrics: null, 
    status: 'idle', 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnapprovedUsers.fulfilled, (state, action) => {
        state.unapprovedUsers = action.payload;
      })
      .addCase(approveUser.fulfilled, (state, action) => {
        state.unapprovedUsers = state.unapprovedUsers.filter(user => user._id !== action.payload._id);
      })
      .addCase(createArtType.fulfilled, (state, action) => {
        state.artTypes.push(action.payload);
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload;
      });
  },
});

export default adminSlice.reducer;
