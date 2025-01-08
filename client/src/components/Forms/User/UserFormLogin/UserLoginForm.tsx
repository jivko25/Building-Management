//client\src\components\Forms\User\UserFormLogin\UserLoginForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import FormErrors from "../../../common/FormElements/FormErrors";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import useLoginUser from "@/hooks/useLoginUser";
import login_image from "@/assets/login_image.jpg";
import { Lock, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const UserLoginForm = () => {
  const { translate } = useLanguage();
  const { form, onSubmit, error, isLoading } = useLoginUser();
  const [translations, setTranslations] = useState({
    welcome: "Welcome",
    enterDetails: "Enter your details below to login to your account",
    username: "Username",
    password: "Password",
    submit: "Submit",
    forgotPassword: "Forgot your password?",
    noAccount: "Don't have an account? Register"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        welcome: await translate("Welcome"),
        enterDetails: await translate("Enter your details below to login to your account"),
        username: await translate("Username"),
        password: await translate("Password"),
        submit: await translate("Submit"),
        forgotPassword: await translate("Forgot your password?"),
        noAccount: await translate("Don't have an account? Register")
      });
    };
    loadTranslations();
  }, [translate]);

  return (
    <FormProvider {...form}>
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="bg-slate-950 flex flex-col justify-center px-8 py-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="grid gap-6 border border-1 rounded-lg p-8">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">{translations.welcome}</h1>
                <p className="text-muted-foreground">{translations.enterDetails}</p>
              </div>
              <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormFieldInput name="username" label={translations.username} type="text" className="pl-10 text-white" Icon={User} />
                <FormFieldInput name="password" label={translations.password} type="password" className="pl-10 text-white" Icon={Lock} />
                <DialogFooter disabled={!form.formState.isDirty || isLoading} label={translations.submit} formName="login-form" className="mt-6" />
                <FormErrors error={error} />
              </form>
              <div className="text-center mt-4">
                <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                  {translations.forgotPassword}
                </a>
              </div>
              <div className="text-center mt-4">
                <a href="/register" className="text-sm text-blue-500 hover:underline">
                  {translations.noAccount}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative">
          <img src={login_image} alt="Login" className="absolute inset-0 w-full h-full object-cover dark:brightness-[0.3]" />
        </div>
      </div>
    </FormProvider>
  );
};

export default UserLoginForm;
