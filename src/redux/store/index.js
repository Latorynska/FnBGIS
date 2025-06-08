import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlices';
import usabilityReducer from '../slices/usabilitySlices';

const store = configureStore({
  reducer: {
    auth: authReducer,
    usability: usabilityReducer,
  },
});

export default store;
