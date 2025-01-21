//client/src/hooks/useRegisterUser.ts
import { useAuth } from "@/context/AuthContext";
import { UserRegisterFormData } from "@/types/user-types/userTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerDefaultValues, registerFormSchema } from "@/models/user/userSchema";

const useRegisterUser = () => {
  const { user, register, isLoading, error } = useAuth();
  const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false);

  const navigate = useNavigate();
  const form = useForm<UserRegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: "onChange",
    defaultValues: registerDefaultValues
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

  const onSubmit: SubmitHandler<UserRegisterFormData> = async (userData: UserRegisterFormData) => {
    console.log("Form submitted with data:", userData);
    const isSuccess = await register(userData.username, userData.password, userData.full_name, userData.email, userData.creator_id);
    console.log("Registration attempt result:", isSuccess);

    const storagedUser = JSON.parse(sessionStorage.getItem("user") || "");

    if (isSuccess) {
      console.log("Registration successful");
      setIsRegisterSuccess(true);
      handleNavigation(user?.role || storagedUser.role || "user");
    }
  };

  useEffect(() => {
    console.log("Navigation effect triggered", { user, isRegisterSuccess });
    if (user && isRegisterSuccess) {
      handleNavigation(user.role);
    }
  }, [user, isRegisterSuccess]);

  return {
    form,
    onSubmit,
    isLoading,
    error
  };
};

export default useRegisterUser;
