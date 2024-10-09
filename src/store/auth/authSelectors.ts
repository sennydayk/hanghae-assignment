import { RootState } from '@/store';

export const selectIsLogin = (state: RootState): boolean => state.auth.isLogin;
export const selectUser = (state: RootState) => state.auth.user;
export const selectRegisterStatus = (state: RootState): string =>
  state.auth.registerStatus;
export const selectRegisterError = (state: RootState): string | null =>
  state.auth.registerError;
