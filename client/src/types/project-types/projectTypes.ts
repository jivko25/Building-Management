//client\src\types\project-types\projectTypes.ts
export type Project = {
  id?: string;
  name: string;
  company_name: string;
  start_date?: string;
  end_date?: string;
  email: string;
  note?: string;
  address: string;
  location: string;
  status: "active" | "inactive";
  client_id: number;
};
