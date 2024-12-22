import { useState } from "react";
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import forgot_password_image from "@/assets/login_image.jpg";
import useForgotPassword from "@/hooks/usePasswordManager";
import { User } from "lucide-react";
import FormErrors from "../../../common/FormElements/FormErrors";

const UserForgotPasswordForm = () => {
  const { forgotForm, onForgotSubmit, error, isLoading } = useForgotPassword();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await forgotForm.handleSubmit(onForgotSubmit)(e);
    setIsSubmitted(true);
  };

  return (
    <FormProvider {...forgotForm}>
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="bg-slate-950 flex flex-col justify-center px-8 py-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="grid gap-6 border border-1 rounded-lg p-8">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Forgot Password</h1>
                <p className="text-muted-foreground">Enter your email below to reset your password</p>
              </div>
              <form
                id="forgot-password-form"
                onSubmit={handleSubmit}
                className="grid gap-4">
                <FormFieldInput name="email" label="Email" type="text" className="pl-10" Icon={User} />
                <DialogFooter disabled={!forgotForm.formState.isDirty || isLoading} label="Submit" formName="forgot-password-form" className="mt-6" />
                <FormErrors error={error} />
              </form>
              {isSubmitted && (
                <div className="text-center mt-4 text-green-500">
                  Email has been sent successfully!
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative">
          <img src={forgot_password_image} alt="Forgot Password" className="absolute inset-0 w-full h-full object-cover dark:brightness-[0.3]" />
        </div>
      </div>
    </FormProvider>
  );
};

export default UserForgotPasswordForm;