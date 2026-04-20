import { configureStore } from '@reduxjs/toolkit';
import uploadsReducer from './uploadSlice';

export const createAppStore = () =>
  configureStore({
    reducer: {
      uploads: uploadsReducer,
    },
  });

export const store = createAppStore();

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
