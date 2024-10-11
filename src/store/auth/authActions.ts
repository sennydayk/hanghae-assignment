import { registerUserAPI } from "@/api/auth";
import { IUser } from "@/types/authType";

interface RegisterUserPayload {
  email: string;
  password: string;
  name: string;
}

export const registerUser = async (
  payload: RegisterUserPayload
): Promise<IUser> => {
  const response = await registerUserAPI(payload);
  const user: IUser = {
    uid: response.uid,
    email: response.email,
    displayName: response.displayName,
  };
  return user;
};
