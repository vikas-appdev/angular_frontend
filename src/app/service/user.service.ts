import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { User } from '../interface/user';
import { Key } from '../enum/key.enum';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = 'http://192.168.1.112:8080';

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login$ = (email: string, password: string) =>
    <Observable<CustomHttpResponse<Profile>>>this.http
      .post<CustomHttpResponse<Profile>>(`${this.server}/user/login`, {
        email,
        password,
      })
      .pipe(tap(console.log), catchError(this.handleError));

  verifyCode$ = (email: string, code: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(
          `${this.server}/user/verify/code/${email}/${code}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  profile$ = () =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(`${this.server}/user/profile`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  update$ = (user: User) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(`${this.server}/user/update`, user)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>this.http
    .get<CustomHttpResponse<Profile>>(`${this.server}/user/refresh/token`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(Key.REFRESH_TOKEN)}`,
      },
    })
    .pipe(
      tap((response) => {
        console.log('Response: ', response);
        localStorage.removeItem(Key.TOKEN);
        localStorage.removeItem(Key.REFRESH_TOKEN);
        localStorage.setItem(Key.TOKEN, response.data.access_token);
        localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
      }),
      catchError(this.handleError)
    );

  updatePassword$ = (form: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/user/update/password`,
          form
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  updateRoles$ = (roleName: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/user/update/role/${roleName}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  updateAccountSettings$ = (settings: {
    active: boolean;
    notLocked: boolean;
  }) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/user/update/settings`,
          settings
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  toggleMfa$ = () =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(`${this.server}/user/togglemfa`, {})
        .pipe(tap(console.log), catchError(this.handleError))
    );

  updateImage$ = (formData: FormData) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/user/update/image`,
          formData
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log('Error: ', error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${error.error.message}`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
        console.log(errorMessage);
      } else {
        errorMessage = `An error occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }

  isAuthenticated = (): boolean =>
    this.jwtHelper.decodeToken<string>(localStorage.getItem(Key.TOKEN)) &&
      !this.jwtHelper.isTokenExpired(localStorage.getItem(Key.TOKEN))
      ? true
      : false;

  logOut() {
    localStorage.removeItem(Key.TOKEN);
    localStorage.removeItem(Key.REFRESH_TOKEN);
  }
}
