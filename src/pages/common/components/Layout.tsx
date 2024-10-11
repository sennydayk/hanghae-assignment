import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { pageRoutes } from "@/apiRoutes";
import { useAuthStore } from "@/store/auth/authSlice";
import { NavigationBar } from "./NavigationBar";
import Cookies from "js-cookie";
import { auth } from "@/firebase";

export const authStatusType = {
  NEED_LOGIN: "NEED_LOGIN",
  NEED_NOT_LOGIN: "NEED_NOT_LOGIN",
  COMMON: "COMMON",
};

interface LayoutProps {
  children: ReactNode;
  containerClassName?: string;
  authStatus?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  containerClassName = "",
  authStatus = authStatusType.COMMON,
}) => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const { setIsLogin, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // 페이지 로드 시 쿠키 확인하여 로그인 상태 설정
  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (token) {
      setIsLogin(true);
      setLoading(false);

      // Firebase에서 추가 검증
      auth.currentUser
        ?.getIdToken(true)
        .then(() => {
          const user = auth.currentUser;
          if (user) {
            setUser({
              uid: user.uid,
              email: user.email ?? "",
              displayName: user.displayName ?? "",
            });
          }
        })
        .catch(() => {
          // 토큰이 유효하지 않으면 로그아웃 처리
          Cookies.remove("accessToken");
          logout();
        });
    } else {
      setLoading(false); // 토큰이 없으면 로딩 종료
    }
  }, [setIsLogin, setUser, logout]);

  if (loading) {
    // 로딩 상태일 때는 아무것도 렌더링하지 않음
    return null;
  }

  // 로그인 상태에 따라 페이지 이동
  if (authStatus === authStatusType.NEED_LOGIN && !isLogin) {
    return <Navigate to={pageRoutes.login} />;
  }

  if (authStatus === authStatusType.NEED_NOT_LOGIN && isLogin) {
    return <Navigate to={pageRoutes.main} />;
  }

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col min-h-screen mt-24">
        <main className="flex-grow">
          <div className={`container mx-auto px-4 ${containerClassName}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
