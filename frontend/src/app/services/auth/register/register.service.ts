import { Injectable } from '@angular/core';
import { registerRequest } from './registerRequest'; // Importa la interfaz RegistrationRequest
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject, tap } from 'rxjs';
import { user } from './user'

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  currentUserLoginOn: BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<user>=new BehaviorSubject<user>({token:''});

  constructor(private http: HttpClient) { }

  login(data: registerRequest): Observable<user> {
    return this.http.post<user>('http://localhost:8080/auth/add', data).pipe(
      tap((userData: user) => {
        this.currentUserData.next(userData);
        this.currentUserLoginOn.next(true);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error:HttpErrorResponse){
    if (error.status===0){
      console.error('An error occurred:', error.error);
  }
  else{
    console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
    
  }
  return throwError(()=> Error('Something bad happened; please try again later.'))
}

get userData():Observable<user>{
  return this.currentUserData.asObservable();
}

get userLoginOn():Observable<boolean>{
  return this.currentUserLoginOn.asObservable();
}
}
