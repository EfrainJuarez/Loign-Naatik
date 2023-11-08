import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class LogOutService {
  constructor(private http: HttpClient, private route: Router) { }

  logOut() {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token') });

    return this.http.post('http://localhost:8080/auth/my/logout', null, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        console.log('Redirecting to login page...');
        this.route.navigateByUrl('/auth/login');
        console.log('Redirected to login page.');
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 204) {
          // Si recibes un 204, considera que la solicitud se completó correctamente
          localStorage.removeItem('token');
          console.log('Redirecting to login page...');
          this.route.navigateByUrl('/auth/login');
          console.log('Redirected to login page.');
          return of(null);
        } else {
          console.error(`Error during logout: ${error.status}`);
          return throwError(() => new Error('Logout failed.'));
        }
      })
    );
  }

}

