// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';  // pastikan path-nya benar

const store = configureStore({
  reducer: {
    auth: authReducer, // cukup pakai authReducer, tanpa .reducer
  },
});

export default store;