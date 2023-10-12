import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

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

  profile$ = () => <Observable<CustomHttpResponse<Profile>>>this.http
      .get<CustomHttpResponse<Profile>>(`${this.server}/user/profile`, {
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJHcmFkbGljIFNvbHV0aW9ucyBQcml2YXRlIExpbWl0ZWQiLCJhdWQiOiJDVVNUT01FUl9NQU5BR0VNRU5UX1NFUlZJQ0UiLCJpYXQiOjE2OTcwNDc3NzcsInN1YiI6IjEiLCJhdXRob3JpdGllcyI6WyJSRUFEOlVTRVIiLCJSRUFEOkNVU1RPTUVSIl0sImV4cCI6MTY5NzA1MTM3N30.Db6zZp8m9UrJhCrWjhYhEx_2-QxN6atk_Yt3r0uilqjr0c-yWFPj0NlN8MnRxF9cYtizj4tEps9A2D2QbZM7fg'
        ),
      })
      .pipe(tap(console.log), catchError(this.handleError));

  update$ = (user: User) => <Observable<CustomHttpResponse<Profile>>>this.http
      .patch<CustomHttpResponse<Profile>>(`${this.server}/user/update`, user, {
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJHcmFkbGljIFNvbHV0aW9ucyBQcml2YXRlIExpbWl0ZWQiLCJhdWQiOiJDVVNUT01FUl9NQU5BR0VNRU5UX1NFUlZJQ0UiLCJpYXQiOjE2OTcwNDc3NzcsInN1YiI6IjEiLCJhdXRob3JpdGllcyI6WyJSRUFEOlVTRVIiLCJSRUFEOkNVU1RPTUVSIl0sImV4cCI6MTY5NzA1MTM3N30.Db6zZp8m9UrJhCrWjhYhEx_2-QxN6atk_Yt3r0uilqjr0c-yWFPj0NlN8MnRxF9cYtizj4tEps9A2D2QbZM7fg'
        ),
      })
      .pipe(tap(console.log), catchError(this.handleError));

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
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
}
