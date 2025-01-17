import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ClientForm from "@/components/Forms/Client/ClientForm";
import { useState } from "react";
import { useClientFormHooks } from "@/hooks/forms/useClientForm";
import { useCreateEntity } from "@/hooks/useQueryHook";
import { Client } from "@/types/client-types/clientTypes";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const CreateClient = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { useCreateClientForm } = useClientFormHooks();
  const form = useCreateClientForm();
  const queryClient = useQueryClient();

  const { mutate: createClient } = useCreateEntity<Client>({
    URL: "/clients",
    queryKey: ["clients"],
    successMessage: "Client created successfully!",
    errorMessage: "Error creating client",
    onSuccess: () => {
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    }
  });

  console.log("Creating client form:", form.formState);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("Add Client")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Create Client")}</DialogTitle>
        </DialogHeader>
        <ClientForm form={form} onSubmit={createClient} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateClient;
