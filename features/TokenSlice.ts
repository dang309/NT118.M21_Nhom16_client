import { createSlice } from "@reduxjs/toolkit";

export interface IToken {
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
}

const INITIAL_STATE: IToken = {
  tokens: {
    access: {
      token: "",
      expires: "",
    },
    refresh: {
      token: "",
      expires: "",
    },
  },
};

const TokenSlice = createSlice({
  name: "Token",
  initialState: INITIAL_STATE,
  reducers: {
    SET_TOKEN: (state, action) => {
      state.tokens = action.payload;
    },
    UPDATE_TOKEN: (state, action) => {
      Object.assign(state.tokens, {
        ...state.tokens,
        ...action.payload,
      });
    },
  },
});

export const { SET_TOKEN, UPDATE_TOKEN } = TokenSlice.actions;

export default TokenSlice.reducer;
