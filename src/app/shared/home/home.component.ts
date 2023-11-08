import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login/login.service';
import { user } from 'src/app/services/auth/login/user';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userLoginOn: boolean = false;
  userData?: user;

  constructor(private loginService: LoginService, private router: Router) { }



  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userLoginOn = true;
      this.userData = { token: token };
    }
    else {
      this.userLoginOn = false;
      this.userData = { token: '' };
      this.router.navigateByUrl('/auth/login')
    }
  }
  decodeJwt(token: any) {
    const base64Url = token.split('.')[1]; // Obtiene la parte "payload" del token
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Reemplaza caracteres especiales
    const jsonPayload = decodeURIComponent(atob(base64)); // Decodifica el payload en base64
    return JSON.parse(jsonPayload); // Convierte el payload en un objeto JavaScript
  }
  isTokenExpired(token: any): boolean {
    const tokenData = this.decodeJwt(token); // Decodifica el token (implementa esta función)
    console.log(tokenData);

    if (tokenData && tokenData.exp) {
      const expirationDate = new Date(tokenData.exp * 1000); // Convierte la fecha Unix en una fecha JavaScript
      return expirationDate <= new Date(); // Compara con la fecha actual
    }
    return true; // Si no hay información de expiración, considera que el token ha expirado
  }
}
