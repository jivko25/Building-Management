//client\src\types\auth-types\authTypes.ts
export interface User {
  id?: number;
  username: string;
  full_name: string;
  role: string;
  status: string;
  email: string;
}

export interface AuthState {
  user?: User | null;
  isLoading?: boolean;
  error?: string | undefined;
  role?: string | null;
  status?: string | null;
  loading?: boolean;
}

export interface AuthContextProps extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (username: string, password: string, full_name: string, email: string, creator_id?: string) => Promise<boolean>;
  resetPassword: (token: any, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
}

export enum AuthActionType {
  LOGIN_REQUEST = "LOGIN_REQUEST",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_ERROR = "LOGIN_ERROR",
  REGISTER_REQUEST = "REGISTER_REQUEST",
  REGISTER_SUCCESS = "REGISTER_SUCCESS",
  REGISTER_ERROR = "REGISTER_ERROR",
  LOGOUT = "LOGOUT",
  SET_LOADING = "SET_LOADING",
  RESET_PASSWORD_REQUEST = "RESET_PASSWORD_REQUEST",
  RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS",
  RESET_PASSWORD_ERROR = "RESET_PASSWORD_ERROR",
  FORGOT_PASSWORD_REQUEST = "FORGOT_PASSWORD_REQUEST",
  FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS",
  FORGOT_PASSWORD_ERROR = "FORGOT_PASSWORD_ERROR",
}
export interface AuthAction {
  type: AuthActionType;
  payload?: any;
}
