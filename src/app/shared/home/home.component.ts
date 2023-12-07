import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PredictionService } from 'src/app/services/IA/prediction.service';
import { LoginService } from 'src/app/services/auth/login/login.service';
import { user } from 'src/app/services/auth/login/user';
import { predictionRequest } from 'src/app/services/IA/predictionRequest';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userLoginOn: boolean = false;
  userData?: user;

  prediction:any| undefined;
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;

  

  constructor(private router: Router,private _formBuilder: FormBuilder, private predictionService:PredictionService) { }

  clientData: FormGroup = this._formBuilder.group({
    customerID:['', Validators.required],
    gender:['',Validators.required],
    SeniorCitizen:['',Validators.required],
    Partner:['',Validators.required],
    Dependents:['',Validators.required],
    tenure:['',Validators.required]
  });
  serviceData = this._formBuilder.group({
    PhoneService:['', Validators.required],
    MultipleLines:['',Validators.required],
    InternetService:['',Validators.required],
    OnlineSecurity:['',Validators.required],
    OnlineBackup:['',Validators.required],
    DeviceProtection:['',Validators.required],
    TechSupport:['',Validators.required],
    StreamingTV:['',Validators.required],
    StreamingMovies:['',Validators.required]
  });
  paymentData = this._formBuilder.group({
    Contract:['', Validators.required],
    PaperlessBilling:['',Validators.required],
    PaymentMethod:['',Validators.required],
    MonthlyCharges:['',Validators.required],
    TotalCharges:['',Validators.required],
  });
  ngOnInit(): void {
    this.checkAuthentication();
    this.sidenav.mode = 'side';
    this.sidenav.open();
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

  isFormFilled(): boolean {
    return (this.clientData.valid && this.serviceData.valid && this.paymentData.valid) // Devuelve true si el formulario es válido
  }

  imprimirValores(){
    console.log(this.clientData.value);
    console.log(this.serviceData.value);
    console.log(this.paymentData.value);
    const SeniorCitizenControl = this.clientData.get('SeniorCitizen');
if (SeniorCitizenControl) {
  const tenureComoCadena = SeniorCitizenControl.value;
  const tenureComoNumero = parseInt(tenureComoCadena, 10);
  this.clientData.patchValue({ SeniorCitizen: tenureComoNumero });
}
    const fullData = {
      ...this.clientData.value,
      ...this.serviceData.value,
      ...this.paymentData.value
    };
    console.log(fullData);
    if (this.isFormFilled()){

      this.predictionService.prediction(fullData as predictionRequest).subscribe({
        next: (response)=>{
          console.log(response);
          if (response.prediction == 1){
            alert("El cliente se irá");
            this.prediction = "El cliente se irá";
          } else{ alert("El cliente no se irá");
        this.prediction = "El cliente no se irá";
        }


        },
        error: (error)=>{
          console.log(error);
        },
        complete: ()=>{
          console.info("Complete");
        }
    })
  
    }
      else{
        console.log("No iniciaste"); 
      }
      this.isTokenExpired(this.userData?.token);
  }

  }
