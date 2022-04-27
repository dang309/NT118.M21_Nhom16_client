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
  list: {
    newsfeed: IPostItem[];
    personal: IPostItem[];
    bookmark: IPostItem[];
  };
  actions: {
    stepIndicatorAddPost: number;
  };
}

const INITIAL_STATE: IPost = {
  list: {
    newsfeed: [],
    personal: [],
    bookmark: [],
  },
  actions: {
    stepIndicatorAddPost: 0,
  },
};

const PostSlice = createSlice({
  name: "Post",
  initialState: INITIAL_STATE,
  reducers: {
    SET_POST: (
      state,
      action: {
        payload: {
          des: "newsfeed" | "personal" | "bookmark";
          data: any;
        };
      }
    ) => {
      state.list[action.payload.des] = action.payload.data;
    },
    ADD_POST: (
      state,
      action: {
        payload: {
          des: "newsfeed" | "personal" | "bookmark";
          data: any;
        };
      }
    ) => {
      Object.assign(state, {
        list: {
          [action.payload.des]: [
            ...state.list[action.payload.des],
            ...action.payload.data,
          ],
        },
      });
    },
    UPDATE_POST: (
      state,
      action: {
        payload: {
          des: "newsfeed" | "personal" | "bookmark";
          postId: string;
          dataToUpdate: any;
        };
      }
    ) => {
      state.list[action.payload.des] = state.list[action.payload.des].map(
        (item) => {
          if (item.id === action.payload.postId) {
            return { ...item, ...action.payload.dataToUpdate };
          }
          return { ...item };
        }
      );
    },
    DELETE_POST: (state, action) => {
      let idx;
      idx = state.list.newsfeed.findIndex(
        (o) => o.id === action.payload.postId
      );
      if (idx > -1) {
        state.list.newsfeed.splice(idx, 1);
      }

      idx = state.list.personal.findIndex(
        (o) => o.id === action.payload.postId
      );
      if (idx > -1) {
        state.list.personal.splice(idx, 1);
      }

      idx = state.list.bookmark.findIndex(
        (o) => o.id === action.payload.postId
      );
      if (idx > -1) {
        state.list.bookmark.splice(idx, 1);
      }
    },
    SET_STEP_INDICATOR: (state, action) => {
      Object.assign(state, { stepIndicatorAddPost: action.payload });
    },
  },
});

export const {
  SET_POST,
  ADD_POST,
  UPDATE_POST,
  DELETE_POST,
  SET_STEP_INDICATOR,
} = PostSlice.actions;

export default PostSlice.reducer;
