"use client"; // ✅ जरूरी है ताकि slice client environment में चले (Next.js App Router में)

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  keyword: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    clearSearchKeyword: (state) => {
      state.keyword = "";
    },
  },
});

export const { setSearchKeyword, clearSearchKeyword } = searchSlice.actions;
export default searchSlice.reducer;
