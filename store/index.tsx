import { configureStore } from '@reduxjs/toolkit';
import listsReducer from './slices/listsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    lists: listsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;