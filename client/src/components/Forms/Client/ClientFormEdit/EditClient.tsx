import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useClientFormHooks } from "@/hooks/forms/useClientForm";
import { useEditEntity, useGetEntityData } from "@/hooks/useQueryHook";
import { Client } from "@/types/client-types/clientTypes";
import ClientForm from "../ClientForm";

interface EditClientProps {
  clientId: number;
}

const EditClient = ({ clientId }: EditClientProps) => {
  const [open, setOpen] = useState(false);
  const { useEditClientForm } = useClientFormHooks();
  const form = useEditClientForm({});

  const { data: client } = useGetEntityData<Client>({
    URL: `/clients/${clientId}`,
    queryKey: ["clients", clientId.toString()]
  });

  const { mutate: editClient } = useEditEntity<Client>({
    URL: `/clients/${clientId}`,
    queryKey: ["clients"],
    successMessage: "Client updated successfully!",
    errorMessage: "Error updating client",
    onSuccess: () => {
      setOpen(false);
      form.reset();
    }
  });

  console.log("Editing client form:", form.formState);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <ClientForm form={form} onSubmit={editClient} defaultValues={client} />
      </DialogContent>
    </Dialog>
  );
};

export default EditClient;
