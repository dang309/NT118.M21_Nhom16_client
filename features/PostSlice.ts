import { createSlice } from "@reduxjs/toolkit";

export interface IPostItem {
  id: string;
  caption: string;
  genre_id: string;
  hashtag_id: null;
  sound: {
    bucket: string;
    key: string;
  };
  title: string;
  thumbnail: {
    bucket: string;
    key: string;
  };
  user_id: string;
  users_like: string[];
  users_listening: string[];
  created_at: string;
  updated_at: string;
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
  name: "Post",
  initialState: INITIAL_STATE,
  reducers: {
    SET_POST: (state, action) => {
      state.list = action.payload;
    },
    ADD_POST: (state, action) => {
      Object.assign(state, { list: [...state.list, action.payload] });
    },
    UPDATE_POST: (state, action: any) => {
      state.list = state.list.map((item) => {
        if (item.id === action.payload.postId) {
          return { ...item, ...action.payload.dataToUpdate };
        }
        return { ...item };
      });
    },
    SET_STEP_INDICATOR: (state, action) => {
      Object.assign(state, { stepIndicatorAddPost: action.payload });
    },
  },
});

export const { SET_POST, ADD_POST, UPDATE_POST, SET_STEP_INDICATOR } =
  PostSlice.actions;

export default PostSlice.reducer;
