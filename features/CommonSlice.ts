import { createSlice } from "@reduxjs/toolkit";

export interface ICommon {
  loading: boolean;
}

const INITIAL_STATE: ICommon = {
  loading: false,
};

const CommonSlice = createSlice({
  name: "Common",
  initialState: INITIAL_STATE,
  reducers: {
    START_LOADING: (state) => {
      state.loading = true;
    },
    STOP_LOADING: (state) => {
      state.loading = false;
    },
  },
});

export const { START_LOADING, STOP_LOADING } = CommonSlice.actions;

export default CommonSlice.reducer;
