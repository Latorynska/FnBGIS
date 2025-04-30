import { createSlice } from '@reduxjs/toolkit';
import { registerUser, loginUser, logoutUser, loadUserData } from '../thunks/authApi';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    uid: '',
    userData: {
      username: '',
      email: '',
    },
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
        // console.log(action.payload);
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        // Handle the rejected case as needed
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.uid = null;
        state.userData = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // console.log(action.payload);
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;

      })
      .addCase(loadUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(loadUserData.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
