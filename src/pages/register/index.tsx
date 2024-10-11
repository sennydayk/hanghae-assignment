import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { pageRoutes } from "@/apiRoutes";
import { EMAIL_PATTERN } from "@/constants";
import { Layout, authStatusType } from "@/pages/common/components/Layout";
import useToastStore from "@/store/toast/toastSlice";
import { registerUser } from "@/store/auth/authActions";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    let formErrors: FormErrors = {};
    if (!name) formErrors.name = "이름을 입력하세요";
    if (!email) {
      formErrors.email = "이메일을 입력하세요";
    } else if (!EMAIL_PATTERN.test(email)) {
      formErrors.email = "이메일 양식이 올바르지 않습니다";
    }
    if (!password) formErrors.password = "비밀번호를 입력하세요";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: (userData: { email: string; password: string; name: string }) =>
      registerUser(userData),
    onSuccess: () => {
      showToast("회원가입이 완료되었습니다.", "success");
      navigate(pageRoutes.login);
    },
    onError: (error: any) => {
      console.error("회원가입 중 오류가 발생했습니다.", error);
      showToast("회원가입에 실패했습니다.", "error");
    },
  });

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate({ email, password, name });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    switch (id) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  return (
    <Layout authStatus={authStatusType.NEED_NOT_LOGIN}>
      <div className="w-full h-screen max-w-md mx-auto space-y-8 flex flex-col justify-center">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="name"
                type="text"
                className="pl-10"
                value={name}
                onChange={handleInputChange}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                value={email}
                onChange={handleInputChange}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                type="password"
                className="pl-10"
                value={password}
                onChange={handleInputChange}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "가입 중..." : "회원가입"}
          </Button>

          {mutation.isError && (
            <p className="text-sm text-red-500">
              {mutation.error?.message || "회원가입에 실패했습니다."}
            </p>
          )}
        </form>
      </div>
    </Layout>
  );
};
