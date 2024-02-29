import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CapitalizeDirective } from '../directives/capitalize-directive/capitalize.directive';




@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    CapitalizeDirective
  ],
  providers: [DatePipe], // Añade DatePipe como proveedor
  imports: [
    AuthRoutingModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DatePipe,
  ]
})
export class AuthModule { }
