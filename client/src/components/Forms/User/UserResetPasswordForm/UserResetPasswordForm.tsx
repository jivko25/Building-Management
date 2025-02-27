//client\src\components\Forms\User\UserFormResetPassword\UserResetPasswordForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import useResetPassword from "@/hooks/usePasswordManager";
import { Lock } from "lucide-react";
import FormErrors from "../../../common/FormElements/FormErrors";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useTranslation } from "react-i18next";

const UserResetPasswordForm = () => {
  const { resetForm, onResetSubmit, error, isLoading } = useResetPassword();
  const { t } = useTranslation();

  return (
    <AuthLayout>
      <div className="grid gap-6 border border-1 rounded-lg p-8">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">{t("Reset Password")}</h1>
          <p className="text-muted-foreground">
            {t("Enter your new password below")}
          </p>
        </div>
        
        <form
          id="reset-password-form"
          onSubmit={e => {
            console.log("Form submission started");
            resetForm.handleSubmit(onResetSubmit)(e);
          }}
          className="grid gap-4"
        >
          <FormProvider {...resetForm}>
            <FormFieldInput 
              name="newPassword" 
              label={t("New Password")} 
              type="password" 
              className="pl-10 text-white" 
              Icon={Lock} 
            />
            <DialogFooter 
              disabled={!resetForm.formState.isDirty || isLoading} 
              label={t("Submit")} 
              formName="reset-password-form" 
              className="mt-6" 
            />
            <FormErrors error={error} />
          </FormProvider>
        </form>
      </div>
    </AuthLayout>
  );
};

export default UserResetPasswordForm;