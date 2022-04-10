import { createSlice } from "@reduxjs/toolkit";

export interface IUser {
  currentUserInfo: {
    user: {
      id: string;
      email: string;
      username: string;
      bio: string;
      avatar: string;
      following: [string];
      followers: [string];
      balance_dcoin: number;
      hobbies: [string];
    };
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
    actions: {
      showProfileActionsDialog: boolean;
    };
  };
}

const INITIAL_STATE: IUser = {
  currentUserInfo: {
    user: {
      id: "",
      email: "",
      username: "",
      bio: "",
      avatar: "",
      following: [""],
      followers: [""],
      balance_dcoin: 0,
      hobbies: [""],
    },
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
    actions: {
      showProfileActionsDialog: false,
    },
  },
};

const UserSlice = createSlice({
  name: "User",
  initialState: INITIAL_STATE,
  reducers: {
    SET_USER: (state, action) => {
      Object.assign(state.currentUserInfo, { ...action.payload });
    },
    CLEAR_USER: (state) => {
      Object.assign(state.currentUserInfo, INITIAL_STATE);
    },
    TOGGLE_PROFILE_ACTIONS_DIALOG: (state) => {
      state.currentUserInfo.actions.showProfileActionsDialog =
        !state.currentUserInfo.actions.showProfileActionsDialog;
    },
  },
});

export const { SET_USER, TOGGLE_PROFILE_ACTIONS_DIALOG, CLEAR_USER } =
  UserSlice.actions;

export default UserSlice.reducer;
