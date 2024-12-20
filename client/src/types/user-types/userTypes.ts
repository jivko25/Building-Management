//client\src\types\user-types\userTypes.ts
export type UserLoginFormData = {
  username: string;
  password: string;
};

export type UserRegisterFormData = {
  username: string;
  password: string;
  full_name: string;
  creator_id?: string;
  email: string;
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
  email: string;
  status: "active" | "inactive";
  role: "user" | "manager";
};

export interface PasswordResetFormData {
  token: string;
  newPassword: string;
}

export interface PasswordForgotFormData {
  email: string;
}
