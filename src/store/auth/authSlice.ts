import { IUser } from '@/types/authType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { registerUser } from './authActions';

interface AuthState {
  isLogin: boolean;
  user: IUser | null;
  registerStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  registerError: string | null;
}

const initialState: AuthState = {
  isLogin: false,
  user: null,
  registerStatus: 'idle',
  registerError: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isLogin = true;
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = 'loading';
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.registerStatus = 'succeeded';
          state.user = action.payload;
          state.isLogin = true;
        }
      )
      .addCase(
        registerUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.registerStatus = 'failed';
          state.registerError = action.payload || 'Registration failed';
        }
      );
  },
});

export const { setIsLogin, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
