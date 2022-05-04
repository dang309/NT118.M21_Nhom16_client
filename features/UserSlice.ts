import { createSlice } from "@reduxjs/toolkit";

export interface ISingleUser {
  id: string;
  username: string;
  bio: string;
  bookmarked_posts: string[];
  email: string;
  followers: string[];
  following: string[];
  hobbies: string[];
  is_email_verified: boolean;
  is_online: boolean;
  avatar: {
    key: string;
    bucket: string;
    uri: string;
  };
  balance_dcoin: number;
  created_at: string;
  updated_at: string;
}

export interface IUser {
  loggedInUser: ISingleUser;
}

const INITIAL_STATE: IUser = {
  loggedInUser: {
    id: "",
    username: "",
    bio: "",
    bookmarked_posts: [],
    email: "",
    followers: [],
    following: [],
    hobbies: [],
    is_email_verified: false,
    is_online: false,
    avatar: {
      key: "",
      bucket: "",
      uri: "",
    },
    balance_dcoin: 0,
    created_at: "",
    updated_at: "",
  },
};

const UserSlice = createSlice({
  name: "User",
  initialState: INITIAL_STATE,
  reducers: {
    SET_USER: (state, action) => {
      state.loggedInUser = action.payload;
    },
    UPDATE_USER: (state, action) => {
      Object.assign(state.loggedInUser, {
        ...state.loggedInUser,
        ...action.payload,
      });
    },
  },
});

export const { SET_USER, UPDATE_USER } = UserSlice.actions;

export default UserSlice.reducer;
