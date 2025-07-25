import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlices';
import usabilityReducer from '../slices/usabilitySlices';
import brandReducer from '../slices/brandSlices';
import daerahReducer from '../slices/daerahSlices';
import menuReducer from '../slices/menuSlices';
import branchReducer from '../slices/branchSlices';
import penggunaReducer from '../slices/penggunaSlices';

const store = configureStore({
  reducer: {
    auth: authReducer,
    usability: usabilityReducer,
    brand: brandReducer,
    daerah: daerahReducer,
    menu: menuReducer,
    branch: branchReducer,
    pengguna: penggunaReducer
  },
});

export default store;

