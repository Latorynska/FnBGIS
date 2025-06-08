import { createSlice } from '@reduxjs/toolkit';

const usabilitySlice = createSlice({
  name: 'usability',
  initialState: {
    isSidebarVisible: true,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarVisible = !state.isSidebarVisible;
    },
    showSidebar: (state) => {
      state.isSidebarVisible = true;
    },
    hideSidebar: (state) => {
      state.isSidebarVisible = false;
    },
  },
});

export const { toggleSidebar, showSidebar, hideSidebar } = usabilitySlice.actions;
export default usabilitySlice.reducer;
