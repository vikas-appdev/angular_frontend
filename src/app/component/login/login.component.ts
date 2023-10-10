import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Observable,
  catchError,
  of,
  startWith,
  map,
  BehaviorSubject,
} from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { Key } from 'src/app/enum/key.enum';
import { LoginState } from 'src/app/interface/appstates';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginState$: Observable<LoginState> = of({ dataState: DataState.LOADED });
  private phoneSubject = new BehaviorSubject<string | null>(null);
  private emailSubject = new BehaviorSubject<string | null>(null);
  readonly DataState = DataState;

  constructor(private router: Router, private userService: UserService) {}

  login(loginForm: NgForm): void {
    this.loginState$ = this.userService
      .login$(loginForm.value.email, loginForm.value.password)
      .pipe(
        map((response) => {
          console.log(response.data.user.usingMFA);
          if (response.data.user.usingMFA) {
            this.phoneSubject.next(response.data.user.mobileNumber);
            this.emailSubject.next(response.data.user.email);
            return {
              dataState: DataState.LOADED,
              isUsingMfa: true,
              loginSuccess: false,
              phone: response.data.user.mobileNumber.substring(
                response.data.user.mobileNumber.length - 4
              ),
            };
          } else {
            localStorage.setItem(Key.TOKEN, response.data.access_token);
            localStorage.setItem(
              Key.REFRESH_TOKEN,
              response.data.refresh_token
            );
            this.router.navigate(['/']);
            return { dataState: DataState.LOADED, loginSuccess: true };
          }
        }),
        startWith({ dataState: DataState.LOADING, isUsingMfa: false }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            isUsingMfa: false,
            loginSuccess: false,
            error,
          });
        })
      );
  }

  verifyCode(verifyCodeForm: NgForm): void {
    this.loginState$ = this.userService
      .verifyCode$(this.emailSubject.value, verifyCodeForm.value.code)
      .pipe(
        map((response) => {
          localStorage.setItem(Key.TOKEN, response.data.access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
          this.router.navigate(['/']);
          return { dataState: DataState.LOADED, loginSuccess: true };
        }),
        startWith({
          dataState: DataState.LOADING,
          isUsingMfa: true,
          loginSuccess: false,
          phone: this.phoneSubject.value.substring(
            this.phoneSubject.value.length - 4
          ),
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            isUsingMfa: true,
            loginSuccess: false,
            error,
            phone: this.phoneSubject.value.substring(
              this.phoneSubject.value.length - 4
            ),
          });
        })
      );
  }

  loginPage(): void {
    this.loginState$ = of({ dataState: DataState.LOADED });
  }
}
