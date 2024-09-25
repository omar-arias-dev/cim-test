import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isLogged: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLogged = true;
    },
    logout: (state, action) => {
      state.user = null;
      state.token = null;
      state.isLogged = false;
    },
  }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;