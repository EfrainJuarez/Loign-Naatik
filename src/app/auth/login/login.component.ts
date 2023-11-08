import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login/login.service';
import { LoginRequest } from 'src/app/services/auth/login/LoginRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  loginForm = this.formBuilder.group({
    email: ['efrain@gmail.com', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private router: Router, private loginService: LoginService) { }

  openDialog() {
    this.dialog.open(DialogElementsExampleDialog);
  }
  get user() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }
  login() {
    if (this.loginForm.valid) {
      console.log("Ya iniciaste")
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (response) => {
          console.log(response);
          localStorage.setItem('token', response.token);
        },
        error: (error) => {
          console.log(error);
          this.openDialog();
        },
        complete: () => {
          console.info("Complete");
          this.router.navigateByUrl('/inicio')
          this.loginForm.reset()
        }
      })
    }
    else {
      console.log("No iniciaste");
      this.loginForm.markAllAsTouched();
    }
  }

}
@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'dialog-elements-example.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogElementsExampleDialog { }
