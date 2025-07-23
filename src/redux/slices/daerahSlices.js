import { createSlice } from '@reduxjs/toolkit';
import { createDaerah, deleteDaerah, fetchDaerahs, updateDaerah } from '../thunks/daerahThunks';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const daerahSlice = createSlice({
  name: 'daerah',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const pendingHandler = (state) => {
      state.loading = true;
      state.error = null;
    };

    const rejectedHandler = (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error?.message;
    };

    builder
      // Fetch
      .addCase(fetchDaerahs.pending, pendingHandler)
      .addCase(fetchDaerahs.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchDaerahs.rejected, rejectedHandler)

      // Create
      .addCase(createDaerah.pending, pendingHandler)
      .addCase(createDaerah.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createDaerah.rejected, rejectedHandler)

      // Update
      .addCase(updateDaerah.pending, pendingHandler)
      .addCase(updateDaerah.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex(item => item.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }
        state.loading = false;
      })
      .addCase(updateDaerah.rejected, rejectedHandler)
      
      // Delete
      .addCase(deleteDaerah.pending, pendingHandler)
      .addCase(deleteDaerah.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteDaerah.rejected, rejectedHandler);
  },
});

export default daerahSlice.reducer;
