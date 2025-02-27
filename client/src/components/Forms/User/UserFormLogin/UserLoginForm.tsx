//client\src\components\Forms\User\UserFormLogin\UserLoginForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import FormErrors from "../../../common/FormElements/FormErrors";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import useLoginUser from "@/hooks/useLoginUser";
import { Lock, User } from "lucide-react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useTranslation } from "react-i18next";

const UserLoginForm = () => {
  const { form, onSubmit, error, isLoading } = useLoginUser();
  const { t } = useTranslation();

  return (
    <AuthLayout>
      <div className="grid gap-6 border border-1 rounded-lg p-8">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">{t("Welcome")}</h1>
          <p className="text-muted-foreground">
            {t("Enter your details below to login to your account")}
          </p>
        </div>
        
        <form
          id="login-form"
          onSubmit={e => {
            console.log("Form submission started");
            form.handleSubmit(onSubmit)(e);
          }}
          className="grid gap-4"
        >
          <FormProvider {...form}>
            <FormFieldInput 
              name="username" 
              label={t("Username")} 
              type="text" 
              className="pl-10 text-white" 
              Icon={User} 
            />
            <FormFieldInput 
              name="password" 
              label={t("Password")} 
              type="password" 
              className="pl-10 text-white" 
              Icon={Lock} 
            />
            <DialogFooter 
              disabled={!form.formState.isDirty || isLoading} 
              label={t("Submit")} 
              formName="login-form" 
              className="mt-6" 
            />
            <FormErrors error={error} />
          </FormProvider>
        </form>

        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
            {t("Forgot your password?")}
          </a>
        </div>
        <div className="text-center mt-4">
          <a href="/register" className="text-sm text-blue-500 hover:underline">
            {t("Don't have an account? Register")}
          </a>
        </div>
      </div>
    </AuthLayout>
  );
};

export default UserLoginForm;
