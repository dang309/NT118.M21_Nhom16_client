import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import UserSlice from "../features/UserSlice";
import PostSlice from "../features/PostSlice";
import CommentSlice from "../features/CommentSlice";
import MessengerSlice from "../features/MessengerSlice";
import NotificationSlice from "../features/NotificationSlice";
import CommonSlice from "../features/CommonSlice";

export const store = configureStore({
  reducer: {
    user: UserSlice,
    post: PostSlice,
    comment: CommentSlice,
    messenger: MessengerSlice,
    notification: NotificationSlice,
    common: CommonSlice,
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
