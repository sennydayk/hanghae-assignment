import { registerUserAPI } from '@/api/auth';
import { IUser } from '@/types/authType';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface RegisterUserPayload {
  email: string;
  password: string;
  name: string;
}

export const registerUser = createAsyncThunk<
  IUser,
  RegisterUserPayload,
  { rejectValue: string }
>(
  'auth/registerUser',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      return await registerUserAPI({ email, password, name });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
