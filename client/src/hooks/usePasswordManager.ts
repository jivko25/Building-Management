//client/src/hooks/usePasswordManagement.ts
import { useAuth } from "@/context/AuthContext";
import { PasswordResetFormData, PasswordForgotFormData } from "@/types/user-types/userTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordSchema, forgotPasswordSchema, resetPasswordDefaultValues, forgotPasswordDefaultValues } from "@/models/user/userSchema";

const usePasswordManagement = () => {
  const { user, resetPassword, forgotPassword, isLoading, error } = useAuth();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { token } = useParams<{ token: string }>();

  const navigate = useNavigate();


  const resetForm = useForm<PasswordResetFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: resetPasswordDefaultValues
  });

  const forgotForm = useForm<PasswordForgotFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: forgotPasswordDefaultValues
  });

  const handleNavigation = () => {
    console.log("Handling navigation after password operation");
  };

  const onResetSubmit: SubmitHandler<PasswordResetFormData> = async (data: PasswordResetFormData) => {
    const isSuccess = await resetPassword(token as string, data.newPassword);

    if (isSuccess) {
      console.log("Password reset successful");
      setIsSuccess(true);
      navigate("/login");
    }
  };

  const onForgotSubmit: SubmitHandler<PasswordForgotFormData> = async (data: PasswordForgotFormData) => {
    console.log("Forgot form submitted with data:", data);
    const isSuccess = await forgotPassword(data.email);
    console.log("Password forgot attempt result:", isSuccess);

    if (isSuccess) {
      console.log("Password forgot successful");
      setIsSuccess(true);
    }
  };

  useEffect(() => {
    console.log("Navigation effect triggered", { user, isSuccess });
    if (isSuccess) {
      handleNavigation();
    }
  }, [isSuccess]);

  return {
    resetForm,
    forgotForm,
    onResetSubmit,
    onForgotSubmit,
    isLoading,
    error
  };
};

export default usePasswordManagement;