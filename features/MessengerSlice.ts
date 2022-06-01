import { createSlice } from "@reduxjs/toolkit";

export interface IMessage {
  messageId: string;
  contactId: string;
  content: string;
  from: string;
  to: string;
  isUnreadAtFrom: boolean;
  isUnreadAtTo: boolean;
}

export interface IConversation {
  id: string;
}

export interface IUnreadMessages {
  contactId: string;
  quantity: number;
}

export interface IMessenger {
  conversations: IConversation[];
  messages: IMessage[];
  unreadMessages: IUnreadMessages[];
}

const INITIAL_STATE: IMessenger = {
  conversations: [],
  messages: [],
  unreadMessages: [],
};

const MessengerSlice = createSlice({
  name: "Messenger",
  initialState: INITIAL_STATE,
  reducers: {
    SET_MESSAGES: (state, action) => {
      state.messages = [...action.payload];
    },
    SET_UNREAD_MESSAGES: (state, action) => {
      if (
        state.unreadMessages.some(
          (o) => o.contactId === action.payload.contactId
        )
      )
        return;
      state.unreadMessages.push(action.payload);
    },
    ADD_CONVERSATION: (state, action) => {
      Object.assign(state, {
        conversation: [...state.conversations, action.payload],
      });
    },
    ADD_MESSAGE: (state, action) => {
      if (state.messages.some((o) => o.messageId === action.payload.messageId))
        return;
      state.messages.push(action.payload);
    },
    READ_MESSAGES: (state: IMessenger, action) => {
      const { contactId } = action.payload;
      let temp = state.messages;
      state.messages = temp.map((item) => {
        if (item.contactId === contactId) {
          return { ...item, isUnreadAtTo: false };
        }
        return { ...item };
      });
      let temp2 = state.unreadMessages;
      state.unreadMessages = temp2.map((item) => {
        if (item.contactId === contactId) {
          return { ...item, quantity: 0 };
        }
        return { ...item };
      });
    },
    CLEAR_MESSAGES: (state) => {
      state.messages = [];
    },
  },
});

export const {
  SET_MESSAGES,
  SET_UNREAD_MESSAGES,
  ADD_CONVERSATION,
  ADD_MESSAGE,
  READ_MESSAGES,
  CLEAR_MESSAGES,
} = MessengerSlice.actions;

export default MessengerSlice.reducer;
