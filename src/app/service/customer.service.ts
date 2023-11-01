import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse, CustomerState, Page, Profile } from '../interface/appstates';
import { User } from '../interface/user';
import { Stats } from '../interface/stats';
import { Customer } from '../interface/customer';
import { LoanAccount } from '../interface/loanaccount';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  //private readonly server: string = 'http://68.183.93.191:8080';
  private readonly server: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  customers$ = (page: number = 0, size: number = 100) =>
    <Observable<CustomHttpResponse<Page & User & Stats>>>(
      this.http.get<CustomHttpResponse<Page & User & Stats>>(`${this.server}/customer/list?page=${page}&size=${size}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  customer$ = (customerId: number) =>
    <Observable<CustomHttpResponse<CustomerState>>>(
      this.http.get<CustomHttpResponse<CustomerState>>(`${this.server}/customer/get/${customerId}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  update$ = (customer: Customer) =>
    <Observable<CustomHttpResponse<CustomerState>>>(
      this.http.put<CustomHttpResponse<CustomerState>>(`${this.server}/customer/update`, customer)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  searchCustomers$ = (name: string = '', page: number = 0, size: number = 100) =>
    <Observable<CustomHttpResponse<Page & User>>>(
      this.http.get<CustomHttpResponse<Page & User>>(`${this.server}/customer/search?name=${name}&page=${page}&size=${size}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );



  newCustomers$ = (customer: Customer) =>
    <Observable<CustomHttpResponse<Customer & User>>>(
      this.http.post<CustomHttpResponse<Customer & User>>(`${this.server}/customer/create/1`, customer)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  newLoan$ = (loanAccount: LoanAccount, customerId: number) =>
    <Observable<CustomHttpResponse<Customer & LoanAccount>>>(
      this.http.post<CustomHttpResponse<Customer & LoanAccount>>(`${this.server}/loan/create/${customerId}`, loanAccount)
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
