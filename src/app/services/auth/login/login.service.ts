import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, BehaviorSubject, tap, Observable } from 'rxjs';

import { user } from './user';
import { LoginRequest } from './LoginRequest';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<user> = new BehaviorSubject<user>({ token: '' });


  constructor(private _http: HttpClient) { }

  login(credentials: LoginRequest): Observable<user> {
    return this._http.post<user>('http://localhost:8080/auth/login', credentials).pipe(
      tap((userData: user) => {
        this.currentUserData.next(userData);
        this.currentUserLoginOn.next(true);
      }),
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    }
    else {
      console.log(`Backend returned code ${error.status}, body was: ${error.error}`);

    }
    return throwError(() => Error('Something bad happened; please try again later.'))
  }

  get userData(): Observable<user> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

}
