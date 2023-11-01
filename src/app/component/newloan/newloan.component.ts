import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-newloan',
  templateUrl: './newloan.component.html',
  styleUrls: ['./newloan.component.css']
})
export class NewloanComponent implements OnInit {

  newCustomerState$: Observable<State<CustomHttpResponse<Page & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  id: number

  constructor(private route: ActivatedRoute, private customerService: CustomerService, private router: Router) { }


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.id = this.route.snapshot.params['id'];

    this.newCustomerState$ = this.customerService.customers$().pipe(
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
  }

  createLoanAccount(newCustomerForm: NgForm): void {
    console.log(newCustomerForm.value);
    this.isLoadingSubject.next(true);
    this.newCustomerState$ = this.customerService.newLoan$(newCustomerForm.value, this.id).pipe(
      map((response) => {
        console.log(response.data.id);
        newCustomerForm.reset()
        this.isLoadingSubject.next(false);
        return { dataState: DataState.LOADED, appData: this.dataSubject.value };
      }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        return of({ dataState: DataState.LOADED, error });
      })
    );
  }
}
