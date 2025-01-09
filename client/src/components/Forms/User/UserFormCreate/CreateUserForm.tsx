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
import { useTranslation } from "react-i18next";

type CreateUserFormProps = {
  handleSubmit: (userData: UserSchema) => void;
  isPending: boolean;
};

const CreateUserForm = ({ handleSubmit, isPending }: CreateUserFormProps) => {
  const { t } = useTranslation();
  const { useCreateUserForm } = useUserFormHooks();
  const form = useCreateUserForm();

  return (
    <FormProvider {...form}>
      <form id="user-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Name, Surname")} name="full_name" className="pl-10" Icon={User} />
          <FormFieldInput type="text" label={t("Username")} name="username" className="pl-10" Icon={User} />
          <FormFieldInput type="password" label={t("Password")} name="password" className="pl-10" Icon={Lock} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2">
          <RoleSelector label={t("Role")} name="role" placeholder={t("user")} />
          <StatusSelector label={t("Status")} name="status" placeholder={t("active")} />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Submit")} formName="user-form" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default CreateUserForm;
