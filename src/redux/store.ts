import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from './slices/notificationSlice'
import tokenReducer from "./slices/tokenSlice"; 

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    token: tokenReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
