//client\src\components\Forms\User\UserFormResetPassword\UserResetPasswordForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import reset_password_image from "@/assets/login_image.jpg";
import useResetPassword from "@/hooks/usePasswordManager";
import { Lock } from "lucide-react";
import FormErrors from "../../../common/FormElements/FormErrors";

const UserResetPasswordForm = () => {
  const { resetForm, onResetSubmit, error, isLoading } = useResetPassword();

  return (
    <FormProvider {...resetForm}>
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="bg-slate-950 flex flex-col justify-center px-8 py-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="grid gap-6 border border-1 rounded-lg p-8">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Reset Password</h1>
                <p className="text-muted-foreground">Enter your new password below</p>
              </div>
              <form
                id="reset-password-form"
                onSubmit={e => {
                  console.log("Form submission started");
                  resetForm.handleSubmit(onResetSubmit)(e);
                }}
                className="grid gap-4">
                <FormFieldInput name="newPassword" label="New Password" type="password" className="pl-10" Icon={Lock} />
                <DialogFooter disabled={!resetForm.formState.isDirty || isLoading} label="Submit" formName="reset-password-form" className="mt-6" />
                <FormErrors error={error} />
              </form>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative">
          <img src={reset_password_image} alt="Reset Password" className="absolute inset-0 w-full h-full object-cover dark:brightness-[0.3]" />
        </div>
      </div>
    </FormProvider>
  );
};

export default UserResetPasswordForm;