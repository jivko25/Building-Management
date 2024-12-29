import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useClientFormHooks } from "@/hooks/forms/useClientForm";
import { useEditEntity, useGetEntityData } from "@/hooks/useQueryHook";
import { Client } from "@/types/client-types/clientTypes";
import ClientForm from "../ClientForm";
import { useQueryClient } from "@tanstack/react-query";

interface EditClientProps {
  clientId: number;
}

const EditClient = ({ clientId }: EditClientProps) => {
  const [open, setOpen] = useState(false);
  const { useEditClientForm } = useClientFormHooks();
  const queryClient = useQueryClient();

  const { data: client } = useGetEntityData<Client>({
    URL: `/clients/${clientId}`,
    queryKey: ["clients", clientId.toString()]
  });

  const form = useEditClientForm({});

  useEffect(() => {
    if (client) {
      form.reset({
        client_company_name: client.client_company_name,
        client_name: client.client_name,
        client_company_address: client.client_company_address,
        client_company_iban: client.client_company_iban,
        client_emails: client.client_emails,
        status: client.status
      });
      console.log("🔄 Form reset with client data:", client);
    }
  }, [client, form]);

  const { mutate: editClient } = useEditEntity<Client>({
    URL: `/clients/${clientId}`,
    queryKey: ["clients"],
    successMessage: "Client updated successfully!",
    errorMessage: "Error updating client",
    onSuccess: () => {
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    }
  });

  console.log("📝 Edit client data:", client);

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
