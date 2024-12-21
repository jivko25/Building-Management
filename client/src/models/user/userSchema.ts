//client\src\models\user\userSchema.ts
import { User, UserLoginFormData } from "@/types/user-types/userTypes";
import { z } from "zod";

export const userStatus = ["active", "inactive"] as const;
export const userRoles = ["user"] as const;

export const userSchema = z.object({
  full_name: z.string().min(7, {
    message: "Name must be at least 7 characters"
  }),
  username: z.string().min(5, {
    message: "Username must be at least 5 characters"
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters"
  }),
  role: z.enum(["user", "manager"], {
    message: "Please select role"
  }),
  status: z.enum(["active", "inactive"], {
    message: "Please select status"
  })
});

export const loginFormSchema = z.object({
  username: z.string().min(5, {
    message: "Wrong username or password"
  }),
  password: z.string().min(5, {
    message: "Wrong username or password"
  })
});

export const registerFormSchema = z.object({
  full_name: z.string().min(7, {
    message: "Name must be at least 7 characters"
  }),
  username: z.string().min(5, {
    message: "Username must be at least 5 characters"
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters"
  }),
  email: z.string().email({
    message: "Invalid email address"
  }),
});

export const loginDefaultValues: UserLoginFormData = {
  username: "",
  password: ""
};

export const userDefaultValues: User = {
  full_name: "",
  username: "",
  password: "",
  role: "user",
  status: "active",
  email: "",
  readonly: false
};

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters long")
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
});

export const resetPasswordDefaultValues = {
  token: "",
  newPassword: ""
};

export const forgotPasswordDefaultValues = {
  email: ""
};

export type UserSchema = z.infer<typeof userSchema>;
