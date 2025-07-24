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
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      state.uid = '';
      state.userData = {
        username: '',
        email: '',
      };
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.uid = action.payload.uid || '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed.';
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.uid = '';
        state.userData = {
          username: '',
          email: '',
        };
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed.';
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.uid = action.payload.uid || '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed.';
      })

      // Load User
      .addCase(loadUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.uid = action.payload.uid || '';
      })
      .addCase(loadUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load user data.';
      });
  },
});

export const { clearError, clearUserData } = authSlice.actions;
export default authSlice.reducer;
