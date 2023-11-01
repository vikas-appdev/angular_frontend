import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, BehaviorSubject, map, startWith, catchError, of, switchMap } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, CustomerState, Page } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { CustomerService } from 'src/app/service/customer.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerState$: Observable<State<CustomHttpResponse<CustomerState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<CustomerState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  readonly DataState = DataState;

  constructor(private activatedRoute: ActivatedRoute, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.customerService.customer$(+ params.get('id')).pipe(
          map((response) => {
            this.dataSubject.next(response);
            return {
              dataState: DataState.LOADED,
              appData: response,
            };
          }),
          startWith({ dataState: DataState.LOADING }),
          catchError((error: string) => {
            return of({ dataState: DataState.ERROR, error });
          })
        );
      })
    )
  }

  updateCustomer(customerForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.customerState$ = this.customerService.update$(customerForm.value).pipe(map((response) => {
      console.log(response);
      this.isLoadingSubject.next(false);
      this.dataSubject.next({ ...response, data: { ...response.data, customer: { ...response.data.customer, invoices: this.dataSubject.value.data.customer.invoices } } });
      return { dataState: DataState.LOADED, appData: this.dataSubject.value };
    }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        return of({ dataState: DataState.ERROR, error })
      })
    )
  }

}
