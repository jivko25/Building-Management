//client\src\components\Forms\User\UserFormLogin\UserLoginForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import useLoginUser from "@/hooks/useLoginUser";
import login_image from "@/assets/login_image.jpg";
import { Lock, User } from "lucide-react";
import FormErrors from "../../../common/FormElements/FormErrors";

const UserLoginForm = () => {
  const { form, onSubmit, error, isLoading } = useLoginUser();

  return (
    <FormProvider {...form}>
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="bg-slate-950 flex flex-col justify-center px-8 py-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="grid gap-6 border border-1 rounded-lg p-8">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Welcome</h1>
                <p className="text-muted-foreground">Enter your details below to login to your account</p>
              </div>
              <form
                id="login-form"
                onSubmit={e => {
                  console.log("Form submission started");
                  form.handleSubmit(onSubmit)(e);
                }}
                className="grid gap-4">
                <FormFieldInput name="username" label="Username" type="text" className="pl-10" Icon={User} />
                <FormFieldInput name="password" label="Password" type="password" className="pl-10" Icon={Lock} />
                <DialogFooter disabled={!form.formState.isDirty || isLoading} label="Submit" formName="login-form" className="mt-6" />
                <FormErrors error={error} />
              </form>
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
