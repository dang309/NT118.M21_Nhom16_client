import { createSlice } from "@reduxjs/toolkit";

export interface IPostItem {
  id: string;
  user_id: string;
  sound: string;
  thumbnail: string;
  caption: string;
  genre: string;
  hashtag: string;
}

export interface IPost {
  list: IPostItem[] | [];
  actions: {
    stepIndicatorAddPost: number;
  };
}

const INITIAL_STATE: IPost = {
  list: [],
  actions: {
    stepIndicatorAddPost: 0,
  },
};

const PostSlice = createSlice({
  name: "User",
  initialState: INITIAL_STATE,
  reducers: {
    SET_POST: (state, action) => {
      Object.assign(state, { list: [...state.list, action.payload] });
    },
    SET_STEP_INDICATOR: (state, action) => {
      Object.assign(state, { stepIndicatorAddPost: action.payload });
    },
  },
});

export const { SET_POST, SET_STEP_INDICATOR } = PostSlice.actions;

export default PostSlice.reducer;
