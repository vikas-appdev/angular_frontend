import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Page, Profile } from '../interface/appstates';
import { User } from '../interface/user';
import { Stats } from '../interface/stats';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly server: string = 'http://192.168.1.112:8080';

  constructor(private http: HttpClient) { }

  customers$ = (page: number = 0, size: number = 100) =>
    <Observable<CustomHttpResponse<Page & User & Stats>>>(
      this.http.get<CustomHttpResponse<Page & User & Stats>>(`${this.server}/customer/list?page=${page}&size=${size}`)
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
}
