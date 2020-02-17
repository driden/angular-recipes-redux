import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { signUpUrl, signInUrl } from './firebaseAuthConfig';
import { User } from './user.model';

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
  userSubject = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

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
      this.userSubject.next(user);
      const timeLeft =
        new Date(loadedUser.tokenExpiration).getTime() - new Date().getTime();
      this.autoLogout(timeLeft);
    } else {
      localStorage.removeItem('userData');
    }
  }

  logout(): void {
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
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
    this.userSubject.next(user);
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
      // case 'INVALID_PASSWORD':
      //   break;
    }
    return throwError(errorMsg);
  }
}
