import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchArts = createAsyncThunk('art/fetchArts', async () => {
  const response = await api.get('/art/myart');
  return response.data;
});

export const createArt = createAsyncThunk('art/createArt', async (artData) => {
  const response = await api.post('/art', artData);
  return response.data;
});

export const completeArt = createAsyncThunk('art/completeArt', async (id) => {
  const response = await api.patch(`/art/${id}/complete`);
  return response.data;
});

export const fetchArtTypes = createAsyncThunk('art/fetchArtTypes', async () => {
  const response = await api.get('/admin/art-types');
  return response.data;
});

export const createArtType = createAsyncThunk('art/createArtType', async (artTypeData) => {
    const response = await api.post('/admin/art-types', { name: artTypeData });
    return response.data;
  });
  

const artSlice = createSlice({
  name: 'art',
  initialState: { list: [], types: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createArt.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(completeArt.fulfilled, (state, action) => {
        const index = state.list.findIndex(art => art._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(fetchArtTypes.fulfilled, (state, action) => {
        state.types = action.payload;
      })
      .addCase(createArtType.fulfilled, (state, action) => {
        state.types.push(action.payload);
      });
  },
});

export default artSlice.reducer;