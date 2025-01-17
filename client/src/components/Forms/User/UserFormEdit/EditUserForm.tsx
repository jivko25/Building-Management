//client\src\components\Forms\User\UserFormEdit\EditUserForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import RoleSelector from "@/components/common/FormElements/FormRoleSelector";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import { Lock, User as UserIcon } from "lucide-react";
import { useUserFormHooks } from "@/hooks/forms/useUserForm";
import { UserSchema } from "@/models/user/userSchema";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

type EditUserFormProps = {
  handleSubmit: (userData: UserSchema) => void;
  userId: string;
  isPending: boolean;
};

const EditUserForm = ({ handleSubmit, isPending, userId }: EditUserFormProps) => {
  const { t } = useTranslation();
  const { data: user } = useFetchDataQuery<{
    id: string;
    full_name: string;
    username: string;
    role: "user" | "manager" | "admin";
    status: "active" | "inactive";
    manager_id: number | null;
  }>({
    URL: `/users/${userId}`,
    queryKey: ["user", userId],
    options: {
      staleTime: Infinity
    }
  });

  console.log("👤 User data:", user);

  const { useEditUserForm } = useUserFormHooks();

  const form = useEditUserForm({
    full_name: user?.full_name || "",
    username: user?.username || "",
    password: "",
    role: (user?.role === "admin" ? "manager" : user?.role) || "user",
    status: user?.status || "active"
  });

  return (
    <FormProvider {...form}>
      <form id="form-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Name, Surname")} name="full_name" className="pl-10" Icon={UserIcon} />
          <FormFieldInput type="text" label={t("Username")} name="username" className="pl-10" Icon={UserIcon} />
          <FormFieldInput type="password" label={t("Password")} name="password" className="pl-10" Icon={Lock} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2">
          <RoleSelector label={t("Role")} name="role" placeholder={t("Role")} defaultVal={user?.role === "admin" ? "manager" : user?.role} />
          <StatusSelector label={t("Status")} name="status" defaultVal={user?.status} />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Submit")} formName="form-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditUserForm;
