import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import { Actions, ofType, Effect } from '@ngrx/effects';

import * as AuthActions from './auth.actions';
import { signUpUrl, signInUrl } from '../firebaseAuthConfig';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  registered?: boolean;
  expiresIn: string;
}

const USER_DATA = 'userData';

const handleAuthentication = (
  expiresIn: number,
  userId: string,
  email: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem(USER_DATA, JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    userId,
    email,
    token,
    expirationDate,
    redirect: true
  });
};

const handleError = (err: any) => {
  let errorMsg = 'An unknown error occurred';
  if (!err.error || !err.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMsg));
  }
  switch (err.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMsg = 'This email already exists!';
      break;
    case 'INVALID_PASSWORD':
      errorMsg = 'You used a wrong password';
      break;
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_EMAIL':
      errorMsg = 'This email is not registered!';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMsg));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponse>(signUpUrl, {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        })
        .pipe(
          tap(resData =>
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          ),
          map(loginResponse =>
            handleAuthentication(
              +loginResponse.expiresIn,
              loginResponse.localId,
              loginResponse.email,
              loginResponse.idToken
            )
          ),

          catchError(handleError)
        );
    })
  );

  @Effect() authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponse>(signInUrl, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        })
        .pipe(
          tap(resData =>
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          ),
          map(loginResponse =>
            handleAuthentication(
              +loginResponse.expiresIn,
              loginResponse.localId,
              loginResponse.email,
              loginResponse.idToken
            )
          ),
          catchError(handleError)
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authAction: AuthActions.AuthenticateSuccess) => {
      if (authAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem(USER_DATA);
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const storedUser = localStorage.getItem(USER_DATA);
      if (!storedUser) {
        return { type: 'NO_USER_IN_STORAGE' };
      }
      const { email, id, userToken, tokenExpiration } = JSON.parse(storedUser);
      const user = new User(email, id, userToken, new Date(tokenExpiration));
      if (user.token) {
        const expirationDuration =
          new Date(tokenExpiration).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        const userdata = {
          email,
          userId: id,
          token: userToken,
          expirationDate: new Date(tokenExpiration),
          redirect: false
        };
        return new AuthActions.AuthenticateSuccess(userdata);
      }
      return { type: 'NO_USER_TOKEN' };
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
