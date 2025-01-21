//client\src\types\accountant-types\accountantTypes.ts
export type Accountant = {
    id?: string;
    name: string;
    note?: string;
    number: string;
    email: string;
    company: string;
    accountantName: string;
    status?: "active" | "inactive";
    measure: string;
  };
  