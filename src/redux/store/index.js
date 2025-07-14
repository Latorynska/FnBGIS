import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlices';
import usabilityReducer from '../slices/usabilitySlices';
import brandReducer from '../slices/brandSlices';

const store = configureStore({
  reducer: {
    auth: authReducer,
    usability: usabilityReducer,
    brand: brandReducer
  },
});

export default store;

