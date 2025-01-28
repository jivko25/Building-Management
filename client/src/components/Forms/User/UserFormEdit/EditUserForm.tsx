//client\src\components\Forms\User\UserFormEdit\EditUserForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import RoleSelector from "@/components/common/FormElements/FormRoleSelector";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import { User as UserIcon } from "lucide-react";
import { useUserFormHooks } from "@/hooks/forms/useUserForm";
import { EditUserSchema } from "@/models/user/userSchema";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

type EditUserFormProps = {
  handleSubmit: (userData: EditUserSchema) => void;
  userId: string;
  isPending: boolean;
};

const EditUserForm = ({ handleSubmit, isPending, userId }: EditUserFormProps) => {
  const { t } = useTranslation();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json();
    }
  });

  console.log("👤 User data:", user);
  console.log("Loading state:", isLoading);

  const { useEditUserForm } = useUserFormHooks();

  const form = useEditUserForm({
    full_name: user?.full_name || "",
    username: user?.username || "",
    role: (user?.role === "admin" ? "manager" : user?.role) || "user",
    status: user?.status || "active",
    email: user?.email || ""
  });

  useEffect(() => {
    if (user) {
      form.reset({
        full_name: user.full_name,
        username: user.username,
        role: user.role === "admin" ? "manager" : user.role,
        status: user.status,
        email: user.email
      });
    }
  }, [user, form]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FormProvider {...form}>
      <form id="form-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Name, Surname")} name="full_name" className="pl-10" Icon={UserIcon} />
          <FormFieldInput type="text" label={t("Username")} name="username" className="pl-10" Icon={UserIcon} />
          <FormFieldInput type="text" label={t("Email")} name="email" className="pl-10" Icon={UserIcon} />
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
