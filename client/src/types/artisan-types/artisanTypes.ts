//client\src\types\artisan-types\artisanTypes.ts
export type Artisan = {
  id?: string;
  name: string;
  note?: string;
  number: string;
  email: string;
  company: string;
  artisanName: string;
  status?: "active" | "inactive";
};
