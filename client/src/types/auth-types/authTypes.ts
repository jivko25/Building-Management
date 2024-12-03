export interface User {
    id?: number;
    username: string;
    name_and_family: string;
    role: string;
    status: string;
}

export interface AuthState {
    user?: User | null,
    isLoading?: boolean;
    error?: string | undefined;
    role?: string | null;
    status?: string | null;
    loading?: boolean;
}

export interface AuthContextProps extends AuthState {
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

export enum AuthActionType {
    LOGIN_REQUEST = 'LOGIN_REQUEST',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_ERROR = 'LOGIN_ERROR',
    LOGOUT = 'LOGOUT',
    SET_LOADING = 'SET_LOADING'
}
export interface AuthAction {
    type: AuthActionType;
    payload?: any;
}