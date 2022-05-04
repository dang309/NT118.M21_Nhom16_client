import { createSlice } from "@reduxjs/toolkit";

export interface INotiItem {
  id: string;
  userId: string;
  opponentId: string;
  action: string;
  sourcePostId: string;
  isUnread: boolean;
  createdAt: string;
}

export interface INotification {
  list: INotiItem[];
}

const INITIAL_STATE: INotification = {
  list: [],
};

const NotificationSlice = createSlice({
  name: "Notification",
  initialState: INITIAL_STATE,
  reducers: {
    SET_NOTIFICATIONS: (state, action) => {
      state.list = [...action.payload];
    },
    ADD_NOTIFICATION: (state, action) => {
      state.list.push(action.payload);
    },
    UPDATE_NOTIFICATION: (state, action) => {
      const { notiId, dataToUpdate } = action.payload;
      state.list = state.list.map((item) => {
        if (item.id === notiId) {
          return { ...item, ...dataToUpdate };
        }

        return { ...item };
      });
    },
  },
});

export const { SET_NOTIFICATIONS, ADD_NOTIFICATION, UPDATE_NOTIFICATION } =
  NotificationSlice.actions;

export default NotificationSlice.reducer;
