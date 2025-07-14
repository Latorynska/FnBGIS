import { createSlice } from '@reduxjs/toolkit';

const brandSlice = createSlice({
  name: 'brand',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchBrandsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBrandsSuccess: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchBrandsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchBrandsStart,
  fetchBrandsSuccess,
  fetchBrandsFailure,
} = brandSlice.actions;

export default brandSlice.reducer;
