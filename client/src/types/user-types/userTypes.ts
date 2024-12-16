//client\src\types\user-types\userTypes.ts
export type UserLoginFormData = {
  username: string;
  password: string;
};

export type User = {
  id?: string;
  name?: string;
  user?: string;
  username: string;
  password: string;
  token?: string;
  artisanName?: string;
  full_name: string;
  status: "active" | "inactive";
  role: "user" | "manager";
};
