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

export interface IMessenger {
  conversations: IConversation[];
  messages: IMessage[];
}

const INITIAL_STATE: IMessenger = {
  conversations: [],
  messages: [],
};

const MessengerSlice = createSlice({
  name: "Messenger",
  initialState: INITIAL_STATE,
  reducers: {
    SET_MESSAGES: (state, action) => {
      state.messages = [...action.payload];
    },
    ADD_CONVERSATION: (state, action) => {
      Object.assign(state, {
        conversation: [...state.conversations, action.payload],
      });
    },
    ADD_MESSAGE: (state, action) => {
      state.messages.push(action.payload);
    },
    CLEAR_MESSAGES: (state) => {
      state.messages = [];
    },
  },
});

export const { SET_MESSAGES, ADD_CONVERSATION, ADD_MESSAGE, CLEAR_MESSAGES } =
  MessengerSlice.actions;

export default MessengerSlice.reducer;
