import { createSlice } from "@reduxjs/toolkit";

export interface ICommentItem {
  id: string;
  post_id: string;
  content: string;
  user_comment_id: string;
  users_like: string[];
  created_at: string;
  updated_at: string;
}

export interface IComment {
  list: ICommentItem[] | [];
  //   actions: {
  //     stepIndicatorAddComment: number;
  //   };
}

const INITIAL_STATE: IComment = {
  list: [],
};

const CommentSlice = createSlice({
  name: "Comment",
  initialState: INITIAL_STATE,
  reducers: {
    SET_COMMENT: (state, action) => {
      state.list = action.payload;
    },
    ADD_COMMENT: (state, action) => {
      Object.assign(state, { list: [...state.list, ...action.payload] });
    },
    UPDATE_COMMENT: (state, action: any) => {
      state.list = state.list.map((item) => {
        if (item.id === action.payload.commentId) {
          return { ...item, ...action.payload.dataToUpdate };
        }
        return { ...item };
      });
    },
  },
});

export const { SET_COMMENT, ADD_COMMENT, UPDATE_COMMENT } =
  CommentSlice.actions;

export default CommentSlice.reducer;
