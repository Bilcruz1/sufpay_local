// src/store/tokenSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid"; 
interface TokenState {
  token: string | null;
}

const initialState: TokenState = {
  token: null, 
}

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    createToken: (state) => {
      state.token = uuidv4(); 
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const { createToken, setToken, clearToken } = tokenSlice.actions;

export default tokenSlice.reducer;
