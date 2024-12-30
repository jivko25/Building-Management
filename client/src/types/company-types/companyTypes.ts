//client\src\types\company-types\companyTypes.ts
export type Company = {
  id?: string;
  name: string;
  number: string;
  location: string;
  address: string;
  mol: string;
  email: string;
  phone: string;
  dds: "yes" | "no";
  status: "active" | "inactive";
};
