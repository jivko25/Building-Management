//client\src\components\Forms\User\UserFormRegister\UserRegisterForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import { Lock, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "primereact/checkbox";
import { useState } from 'react';
import TermsAndConditionsModal from './TermsAndConditionsModal';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import useRegisterUser from "@/hooks/useRegisterUser";
import AuthLayout from "@/components/layouts/AuthLayout";
import FormErrors from "@/components/common/FormElements/FormErrors";

const UserRegisterForm = () => {
  const { form, onSubmit, error } = useRegisterUser();
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <AuthLayout>
      <TermsAndConditionsModal
        visible={termsModalVisible}
        onHide={() => setTermsModalVisible(false)}
      />
      <div className="grid gap-6 border border-1 rounded-lg p-8">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">{t("Register")}</h1>
          <p className="text-muted-foreground">
            {t("Enter your details below to create a new account")}
          </p>
        </div>

        <form
          id="register-form"
          onSubmit={form.handleSubmit(onSubmit)}
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
            {form.formState.errors.username && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.username.message}
              </span>
            )}
            <FormFieldInput
              name="password"
              label={t("Password")}
              type="password"
              className="pl-10 text-white"
              Icon={Lock}
            />
            {form.formState.errors.password && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.password.message}
              </span>
            )}
            <FormFieldInput
              name="full_name"
              label={t("Full Name")}
              type="text"
              className="pl-10 text-white"
              Icon={User}
            />
            {form.formState.errors.full_name && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.full_name.message}
              </span>
            )}
            <FormFieldInput
              name="email"
              label={t("Email")}
              type="text"
              className="pl-10 text-white"
              Icon={User}
            />
            {form.formState.errors.email && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.email.message}
              </span>
            )}

            <div className="flex flex-col gap-2">
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
              {form.formState.errors.terms && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.terms.message}
                </span>
              )}
            </div>

            <DialogFooter
              label={t("Submit")}
              formName="register-form"
              className="mt-6"
            />
            <FormErrors error={error} />
          </FormProvider>
        </form>

        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-blue-500 hover:underline">
            {t("Already have an account? Login")}
          </a>
        </div>
      </div>
    </AuthLayout>
  );
};

export default UserRegisterForm;
