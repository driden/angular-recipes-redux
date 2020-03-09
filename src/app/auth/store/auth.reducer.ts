import { User } from '../user.model';
import * as AuthActions from '../store/auth.actions';

export interface State {
  user: User;
  authError: string;
  isLoading: boolean;
}

const initialState: State = { user: null, authError: null, isLoading: false };

export function authReducer(
  state: State = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const { userId, email, token, expirationDate } = action.payload;
      const user = new User(email, userId, token, expirationDate);
      return { ...state, user, authError: null, isLoading: false };
    case AuthActions.LOGOUT:
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        isLoading: false,
        authError: (action as AuthActions.AuthenticateFail).payload
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return { ...state, authError: null, isLoading: true };
    case AuthActions.CLEAR_ERROR:
      return { ...state, authError: null };

    default:
      return state;
  }
}
