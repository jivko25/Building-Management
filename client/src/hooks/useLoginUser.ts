//client/src/hooks/useLoginUser.ts
import { useAuth } from "@/context/AuthContext";
import { UserLoginFormData } from "@/types/user-types/userTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginDefaultValues, loginFormSchema } from "@/models/user/userSchema";

const useLoginUser = () => {
  const { user, login, isLoading, error } = useAuth();
  const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(false);

  const navigate = useNavigate();
  const form = useForm<UserLoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: loginDefaultValues
  });

  const handleNavigation = (role: string) => {
    console.log("Handling navigation for role:", role);

    setTimeout(() => {
      switch (role) {
        case "admin":
          navigate("/projects");
          break;
        case "manager":
          navigate("/projects");
          break;
        case "user":
          navigate("/my-projects");
          break;
        default:
          navigate("/");
      }
    }, 100);
  };

  const onSubmit: SubmitHandler<UserLoginFormData> = async (userData: UserLoginFormData) => {
    console.log("Form submitted with data:", userData);
    const isSuccess = await login(userData.username, userData.password);
    console.log("Login attempt result:", isSuccess);

    const storagedUser = JSON.parse(sessionStorage.getItem("user") || '');

    if (isSuccess) {
      console.log("Login successful");
      setIsLoginSuccess(true);
      if (user?.role || storagedUser.role) {
        handleNavigation(user?.role || storagedUser.role);
      }
    }
  };

  useEffect(() => {
    console.log("Navigation effect triggered", { user, isLoginSuccess });
    if (user && isLoginSuccess) {
      handleNavigation(user.role);
    }
  }, [user, isLoginSuccess]);

  return {
    form,
    onSubmit,
    isLoading,
    error
  };
};

export default useLoginUser;
