import { TableCell, TableRow } from "@/components/ui/table";
import { Client } from "@/types/client-types/clientTypes";
import { Badge } from "@/components/ui/badge";
import EditClient from "@/components/Forms/Client/ClientFormEdit/EditClient";
import { useTranslation } from "react-i18next";

type ClientsCardProps = {
  clients: Client[];
};

const ClientsCard = ({ clients }: ClientsCardProps) => {
  const { t } = useTranslation();

  return (
    <>
      {clients.map(client => (
        <TableRow key={client.id}>
          <TableCell className="font-semibold">{client.client_company_name}</TableCell>
          <TableCell className="font-semibold">{client.client_name}</TableCell>
          <TableCell className="font-semibold">{client.client_company_address}</TableCell>
          <TableCell className="font-semibold">{client.client_company_iban}</TableCell>
          <TableCell className="font-semibold">{client.invoiceLanguage?.name || "English"}</TableCell>
          <TableCell className="font-semibold">
            {client.due_date} {t("weeks")}
          </TableCell>
          <TableCell className="text-center">
            <Badge variant={client.status === "active" ? "default" : "secondary"}>{client.status}</Badge>
          </TableCell>
          <TableCell className="text-end font-semibold w-[200px]">
            <EditClient clientId={client.id!} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default ClientsCard;
