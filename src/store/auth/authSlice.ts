import { create } from "zustand";
import Cookies from "js-cookie";
import { IUser } from "@/types/authType";
import { auth } from "@/firebase";

interface AuthState {
  isLogin: boolean;
  user: IUser | null;
  setIsLogin: (isLogin: boolean) => void;
  setUser: (user: IUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLogin: false,
  user: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setUser: (user: IUser) =>
    set(() => ({
      user,
      isLogin: true,
    })),
  logout: () => {
    Cookies.remove("accessToken");
    set(() => ({
      isLogin: false,
      user: null,
    }));
  },
}));

const token = Cookies.get("accessToken");
if (token) {
  auth.currentUser
    ?.getIdToken(true)
    .then(() => {
      const user = auth.currentUser;
      if (user) {
        useAuthStore.setState({
          isLogin: true,
          user: {
            uid: user.uid,
            email: user.email ?? "",
            displayName: user.displayName ?? "",
          },
        });
      }
    })
    .catch(() => {
      useAuthStore.setState({ isLogin: false, user: null });
      Cookies.remove("accessToken");
    });
}
