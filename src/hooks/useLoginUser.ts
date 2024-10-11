import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";
import { auth } from "@/firebase";
import { IUser } from "@/types/authType";
import { useAuthStore } from "@/store/auth/authSlice";

interface LoginUserPayload {
  email: string;
  password: string;
}

export const useLoginUser = (): UseMutationResult<
  IUser,
  Error,
  LoginUserPayload
> => {
  const { setIsLogin, setUser } = useAuthStore();

  return useMutation<IUser, Error, LoginUserPayload>({
    mutationFn: async ({ email, password }: LoginUserPayload) => {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      Cookies.set("accessToken", token, { expires: 7 });

      return {
        uid: user.uid,
        email: user.email ?? "",
        displayName: user.displayName ?? "",
      };
    },
    onSuccess: (user) => {
      setUser(user);
      setIsLogin(true);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
