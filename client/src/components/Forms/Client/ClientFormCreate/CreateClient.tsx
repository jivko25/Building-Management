import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ClientForm from "@/components/Forms/Client/ClientForm";
import { useState, useEffect } from "react";
import { useClientFormHooks } from "@/hooks/forms/useClientForm";
import { useCreateEntity } from "@/hooks/useQueryHook";
import { Client } from "@/types/client-types/clientTypes";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

const CreateClient = () => {
  const [open, setOpen] = useState(false);
  const { useCreateClientForm } = useClientFormHooks();
  const form = useCreateClientForm();
  const queryClient = useQueryClient();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    addClient: "Add Client",
    createClient: "Create Client",
    messages: {
      success: "Client created successfully!",
      error: "Error creating client"
    }
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        addClient: await translate("Add Client"),
        createClient: await translate("Create Client"),
        messages: {
          success: await translate("Client created successfully!"),
          error: await translate("Error creating client")
        }
      });
    };
    loadTranslations();
  }, [translate]);

  const { mutate: createClient } = useCreateEntity<Client>({
    URL: "/clients",
    queryKey: ["clients"],
    successMessage: translations.messages.success,
    errorMessage: translations.messages.error,
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
          {translations.addClient}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translations.createClient}</DialogTitle>
        </DialogHeader>
        <ClientForm form={form} onSubmit={createClient} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateClient;
