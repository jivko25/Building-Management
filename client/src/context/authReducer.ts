//client\src\context\authReducer.ts
import { AuthAction, AuthActionType, AuthState } from "@/types/auth-types/authTypes";

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionType.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: undefined
      };
    case AuthActionType.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload?.user || null,
        role: action.payload?.user.role || null,
        isLoading: false
      };
    case AuthActionType.LOGIN_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload?.error
      };
    case AuthActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading
      };
    case AuthActionType.LOGOUT:
      return {
        ...state,
        user: null,
        role: null
      };
    default:
      return state;
  }
};

export default authReducer;
