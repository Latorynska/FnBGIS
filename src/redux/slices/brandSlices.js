import { createSlice } from '@reduxjs/toolkit';
import { fetchBrands, saveBrand, updateBrand } from '../thunks/brandThunks';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handler re-use
    const pendingHandler = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejectedHandler = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // Fetch brands
      .addCase(fetchBrands.pending, pendingHandler)
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchBrands.rejected, rejectedHandler)

      // Save new brand
      .addCase(saveBrand.pending, pendingHandler)
      .addCase(saveBrand.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(saveBrand.rejected, rejectedHandler)

      // Update brand
      .addCase(updateBrand.pending, pendingHandler)
      .addCase(updateBrand.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex(item => item.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }
        state.loading = false;
      })
      .addCase(updateBrand.rejected, rejectedHandler);
  },
});

export default brandSlice.reducer;
