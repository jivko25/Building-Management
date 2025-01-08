//client\src\components\Forms\User\UserFormCreate\CreateUserForm.tsx
import { UserSchema } from "@/models/user/userSchema";
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import RoleSelector from "@/components/common/FormElements/FormRoleSelector";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import { Lock, User } from "lucide-react";
import { useUserFormHooks } from "@/hooks/forms/useUserForm";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

type CreateUserFormProps = {
  handleSubmit: (userData: UserSchema) => void;
  isPending: boolean;
};

const CreateUserForm = ({ handleSubmit, isPending }: CreateUserFormProps) => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    fullName: "Name, Surname",
    username: "Username",
    password: "Password",
    role: "Role",
    status: "Status",
    submit: "Submit"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        fullName: await translate("Name, Surname"),
        username: await translate("Username"),
        password: await translate("Password"),
        role: await translate("Role"),
        status: await translate("Status"),
        submit: await translate("Submit")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useCreateUserForm } = useUserFormHooks();
  const form = useCreateUserForm();

  return (
    <FormProvider {...form}>
      <form id="user-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={translations.fullName} name="full_name" className="pl-10" Icon={User} />
          <FormFieldInput type="text" label={translations.username} name="username" className="pl-10" Icon={User} />
          <FormFieldInput type="password" label={translations.password} name="password" className="pl-10" Icon={Lock} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2">
          <RoleSelector label={translations.role} name="role" placeholder="user" />
          <StatusSelector label={translations.status} name="status" placeholder="active" />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={translations.submit} formName="user-form" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default CreateUserForm;
