import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { LogOutService } from 'src/app/services/auth/logout/logout.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit{
  constructor(private logout: LogOutService, private route: Router) { }
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  userEmail: string | null = null; // Asignación inicial
  ngOnInit() {
    // Abre el sidenav al inicializar el componente
    this.sidenav.mode = 'side';
    this.sidenav.open();
    const token = localStorage.getItem('token');
    if (token) {
      this.userEmail = this.extractEmailFromToken(token);
      console.log(this.userEmail);
    } else {
      console.error('No se encontró el token en el localStorage.');
    }
  }

  decodeJwt(token: any) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64));
    return JSON.parse(jsonPayload);
  }
  
  extractEmailFromToken(token: any): string | null {
    const decodedToken = this.decodeJwt(token);
  
    console.log('Decoded Token:', decodedToken);
  
    if (decodedToken && decodedToken.sub) {
      return decodedToken.sub;
    }
  
    return null;
  }
  
  isTokenExpired(token: any): boolean {
    const tokenData = this.decodeJwt(token);
    console.log(tokenData);
  
    if (tokenData && tokenData.exp) {
      const expirationDate = new Date(tokenData.exp * 1000);
      return expirationDate <= new Date();
    }
  
    return true;
  }

  onLogout() {

    this.logout.logOut().subscribe(
      response => {
        console.log('Logout successful');
        // Realizar redirección aquí
      },
      error => {
        console.error('Logout failed:', error);
        // localStorage.removeItem('token');
        // this.route.navigateByUrl('/auth/login');
        // console.clear();
      }
    );
  }
}
