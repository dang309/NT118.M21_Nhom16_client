import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import UserSlice from "../features/UserSlice";
import PostSlice from "../features/PostSlice";

export const store = configureStore({
  reducer: {
    user: UserSlice,
    post: PostSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
