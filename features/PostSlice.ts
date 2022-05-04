import { createSlice } from "@reduxjs/toolkit";

export interface IPostItem {
  id: string;
  caption: string;
  genre_id: string;
  hashtag_id: null;
  title: string;
  sound: {
    key: string;
    bucket: string;
    uri: any;
  };
  thumbnail: {
    key: string;
    bucket: string;
    uri: any;
  };
  posting_user: {
    id: string;
    email: string;
    username: string;
    bio: string;
    avatar: {
      key: string;
      bucket: string;
      uri: any;
    };
    following: [string];
    followers: [string];
    balance_dcoin: number;
    hobbies: [string];
  };
  users_like: string[];
  users_listening: string[];
  created_at: string;
  updated_at: string;

  is_like_from_me: boolean;
  is_hear_from_me: boolean;
}

export interface IPost {
  list: IPostItem[];
}

const INITIAL_STATE: IPost = {
  list: [],
};

const PostSlice = createSlice({
  name: "Post",
  initialState: INITIAL_STATE,
  reducers: {
    SET_POST: (state, action) => {
      state.list = [...action.payload];
    },
    ADD_POST: (state, action) => {
      state.list.unshift(action.payload);
    },
    UPDATE_POST: (state, action) => {
      const { postId, dataToUpdate } = action.payload;
      let temp = state.list;
      temp = temp.map((item) => {
        if (item.id === postId) {
          return { ...item, ...dataToUpdate };
        }
        return { ...item };
      });
      state.list = temp;
    },
    DELETE_POST: (state, action) => {
      const { postId } = action.payload;
      const idx = state.list.findIndex((o) => o.id === postId);
      if (idx > -1) {
        state.list.splice(idx, 1);
      }
    },
  },
});

export const { SET_POST, ADD_POST, UPDATE_POST, DELETE_POST } =
  PostSlice.actions;

export default PostSlice.reducer;
