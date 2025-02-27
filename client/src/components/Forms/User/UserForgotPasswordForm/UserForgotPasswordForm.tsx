import { useState } from "react";
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import useForgotPassword from "@/hooks/usePasswordManager";
import { User } from "lucide-react";
import FormErrors from "../../../common/FormElements/FormErrors";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useTranslation } from "react-i18next";

const UserForgotPasswordForm = () => {
  const { forgotForm, onForgotSubmit, error, isLoading } = useForgotPassword();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await forgotForm.handleSubmit(onForgotSubmit)(e);
    setIsSubmitted(true);
  };

  return (
    <AuthLayout>
      <div className="grid gap-6 border border-1 rounded-lg p-8">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">{t("Forgot Password")}</h1>
          <p className="text-muted-foreground">
            {t("Enter your email below to reset your password")}
          </p>
        </div>
        
        <form
          id="forgot-password-form"
          onSubmit={handleSubmit}
          className="grid gap-4"
        >
          <FormProvider {...forgotForm}>
            <FormFieldInput 
              name="email" 
              label={t("Email")} 
              type="text" 
              className="pl-10 text-white" 
              Icon={User} 
            />
            <DialogFooter 
              disabled={!forgotForm.formState.isDirty || isLoading} 
              label={t("Submit")} 
              formName="forgot-password-form" 
              className="mt-6" 
            />
            <FormErrors error={error} />
          </FormProvider>
        </form>

        {isSubmitted && (
          <div className="text-center mt-4 text-green-500">
            {t("Email has been sent successfully!")}
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default UserForgotPasswordForm;