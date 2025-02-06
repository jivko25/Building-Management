//client\src\components\Forms\User\UserFormRegister\UserRegisterForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import register_image from "@/assets/login_image.jpg";
import useRegisterUser from "@/hooks/useRegisterUser";
import { Lock, User } from "lucide-react";
import FormErrors from "../../../common/FormElements/FormErrors";
import { Label } from "@/components/ui/label";
import { Checkbox } from "primereact/checkbox";
import { useState } from 'react';
import TermsAndConditionsModal from './TermsAndConditionsModal';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const UserRegisterForm = () => {
  const { form, onSubmit, error, isLoading } = useRegisterUser();
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <FormProvider {...form}>
      <TermsAndConditionsModal 
        visible={termsModalVisible} 
        onHide={() => setTermsModalVisible(false)} 
      />
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="bg-slate-950 flex flex-col justify-center px-8 py-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="grid gap-6 border border-1 rounded-lg p-8">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Register</h1>
                <p className="text-muted-foreground">Enter your details below to create a new account</p>
              </div>
              <form
                id="register-form"
                onSubmit={e => {
                  console.log("Form submission started");
                  form.handleSubmit(onSubmit)(e);
                }}
                className="grid gap-4">
                <FormFieldInput name="username" label="Username" type="text" className="pl-10 text-white" Icon={User} />
                <FormFieldInput name="password" label="Password" type="password" className="pl-10 text-white" Icon={Lock} />
                <FormFieldInput name="full_name" label="Full Name" type="text" className="pl-10 text-white" Icon={User} />
                <FormFieldInput name="email" label="Email" type="text" className="pl-10 text-white" Icon={User} />
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms"
                    checked={form.watch("terms") || false}
                    onChange={e => form.setValue("terms", e.checked as boolean)}
                    name="terms"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-300">
                    {t("I accept the")} {" "}
                    <Button 
                      variant="link" 
                      className="p-0 text-blue-500 hover:underline"
                      onClick={() => setTermsModalVisible(true)}
                    >
                      {t("terms and conditions")}
                    </Button>
                  </Label>
                </div>
                <DialogFooter 
                  disabled={!form.formState.isDirty || isLoading || !form.watch("terms")} 
                  label="Submit" 
                  formName="register-form" 
                  className="mt-6" 
                />
                <FormErrors error={error} />
              </form>
              <div className="text-center mt-4">
                <a href="/login" className="text-sm text-blue-500 hover:underline">
                  Already have an account? Login
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative">
          <img src={register_image} alt="Register" className="absolute inset-0 w-full h-full object-cover dark:brightness-[0.3]" />
        </div>
      </div>
    </FormProvider>
  );
};

export default UserRegisterForm;
