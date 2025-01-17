//client\src\context\AuthContext.tsx
import { createContext, useContext, useEffect, useReducer } from "react";
import { AuthState, AuthActionType, AuthContextProps } from "@/types/auth-types/authTypes";
import { User } from "@/types/user-types/userTypes";
import { useLocation, useNavigate } from "react-router-dom";
import authReducer from "./authReducer";

const initialState: AuthState = {
  user: null,
  error: undefined,
  role: null,
  isLoading: false,
  loading: true
};

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (username: string, password: string): Promise<boolean> => {
    dispatch({
      type: AuthActionType.LOGIN_REQUEST
    });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        }),
        credentials: "include"
      });

      const userData: { user: User } = await response.json();

      if (!response.ok) {
        throw new Error("Wrong username or password");
      }

      dispatch({
        type: AuthActionType.LOGIN_SUCCESS,
        payload: {
          user: userData.user
        }
      });

      sessionStorage.setItem("user", JSON.stringify(userData.user));

      return true;
    } catch (error: unknown) {
      if (error instanceof Error)
        dispatch({
          type: AuthActionType.LOGIN_ERROR,
          payload: {
            error: error.message
          }
        });
      return false;
    }
  };

  const register = async (username: string, password: string, full_name: string, email: string, creator_id?: string): Promise<boolean> => {
    dispatch({
      type: AuthActionType.REGISTER_REQUEST
    });

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          full_name,
          creator_id,
          email
        }),
        credentials: "include"
      });

      const userData: { user: User } = await response.json();

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      dispatch({
        type: AuthActionType.REGISTER_SUCCESS,
        payload: {
          user: userData.user
        }
      });

      sessionStorage.setItem("user", JSON.stringify(userData.user));

      return true;
    } catch (error: unknown) {
      if (error instanceof Error)
        dispatch({
          type: AuthActionType.REGISTER_ERROR,
          payload: {
            error: error.message
          }
        });
      return false;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    dispatch({
      type: AuthActionType.RESET_PASSWORD_REQUEST
    });

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          newPassword
        }),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Password reset failed");
      }

      dispatch({
        type: AuthActionType.RESET_PASSWORD_SUCCESS
      });

      return true;
    } catch (error: unknown) {
      if (error instanceof Error)
        dispatch({
          type: AuthActionType.RESET_PASSWORD_ERROR,
          payload: {
            error: error.message
          }
        });
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    dispatch({
      type: AuthActionType.FORGOT_PASSWORD_REQUEST
    });

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        }),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Forgot password request failed");
      }

      dispatch({
        type: AuthActionType.FORGOT_PASSWORD_SUCCESS
      });

      return true;
    } catch (error: unknown) {
      if (error instanceof Error)
        dispatch({
          type: AuthActionType.FORGOT_PASSWORD_ERROR,
          payload: {
            error: error.message
          }
        });
      return false;
    }
  };

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });

    sessionStorage.removeItem("user");

    dispatch({
      type: AuthActionType.LOGOUT
    });

    navigate("/login");
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (location.pathname !== "/login") {
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        dispatch({
          type: AuthActionType.LOGIN_SUCCESS,
          payload: {
            user: parsedUser,
            role: parsedUser.role
          }
        });
      }
    }
    dispatch({
      type: AuthActionType.SET_LOADING,
      payload: {
        loading: false
      }
    });
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, resetPassword, forgotPassword }}>
      <div className={state?.user?.readonly ? "readonly" : ""}>{children}</div>
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider component");
  }
  return context;
};
