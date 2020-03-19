import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { signUpUrl, signInUrl } from './firebaseAuthConfig';
import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import { AuthenticateSuccess, Logout } from './store/auth.actions';
import { UserData } from '../auth/store/auth.actions';
import * as AuthActions from '../auth/store/auth.actions';

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  registered?: boolean;
  expiresIn: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimer: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  setLogoutTimer(expirationDuration: number): void {
    console.log('setLogoutTimer ' + expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer(): void {
    console.log('clearLogoutTimer');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  signup(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(signUpUrl, {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(signInUrl, {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin(): void {
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) {
      return;
    }

    const loadedUser = JSON.parse(storedUser);
    const user = new User(
      loadedUser.email,
      loadedUser.id,
      loadedUser.userToken,
      new Date(loadedUser.tokenExpiration)
    );

    if (user && user.token) {
      const userdata: UserData = {
        email: user.email,
        userId: user.id,
        token: user.token,
        expirationDate: new Date(loadedUser.tokenExpiration)
      };
      this.store.dispatch(new AuthenticateSuccess(userdata));
      const timeLeft =
        new Date(loadedUser.tokenExpiration).getTime() - new Date().getTime();
      this.autoLogout(timeLeft);
    } else {
      localStorage.removeItem('userData');
    }
  }

  logout(): void {
    this.store.dispatch(new Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    this.clearLogoutTimer();
  }

  autoLogout(expiresInMillis: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiresInMillis);
  }

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    expiresIn: number
  ): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    const userData: UserData = {
      email: user.email,
      expirationDate,
      token: user.token,
      userId: user.id
    };
    this.store.dispatch(new AuthenticateSuccess(userData));
    this.autoLogout(1000 * expiresIn);
    localStorage.setItem('userData', JSON.stringify(user));
  }
  private handleError(errorResponse: HttpErrorResponse): Observable<never> {
    let errorMsg = 'An unknown error occurred';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMsg);
    }
    switch (errorResponse.error.error.message) {
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
    return throwError(errorMsg);
  }
}
