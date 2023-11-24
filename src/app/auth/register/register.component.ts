
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms'
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  hide = true;
  startDate = new Date(2000, 1, 1);
  maxdate:any= new Date();
  userRegisterOn=false;
  isEditable = false;
constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private router:Router,){}
userDataForm = this.formBuilder.group({
  username: ['Efra', Validators.required],
  apellidoPa: ['Juarez', Validators.required],
  apellidoMa: ['Mendoza', Validators.required],
  fechaNacimiento: ['', Validators.required],

});
userAccountForm=this.formBuilder.group({
  email:['efrain@gmail.com', [Validators.required, Validators.email]],
  password: ['',[Validators.required]],
  phone: [null,[Validators.required]],
})

letterValidation(event: Event, controlName: string) {
  const inputValue = (event.target as HTMLInputElement).value;
  const onlyLetters = inputValue.replace(/[^a-zA-Z]+/g, '');
  this.userDataForm.get(controlName)?.setValue(onlyLetters, { emitEvent: false });
}
numberValidation(event: Event, controlName: string) {
  const inputElement = event.target as HTMLInputElement;
  const inputValue = inputElement.value;
  const onlyNumbers = inputValue.replace(/[^0-9]+/g, ''); // Mantener solo dígitos numéricos
  inputElement.value = onlyNumbers;
  this.userDataForm.get(controlName)?.setValue(onlyNumbers, { emitEvent: false });
}



get email(){
  return this.userAccountForm.controls.email;
}

get password(){
  return this.userAccountForm.controls.password;
}

isFormFilled(): boolean {
  return (this.userDataForm.valid && this.userAccountForm.valid) // Devuelve true si el formulario es válido
}

register (){
  if (this.isFormFilled()){
    const formData1 = this.userDataForm.value;
    const formData2= this.userAccountForm.value;
    const valorfecha= this.userDataForm.get('fechaNacimiento')?.value;
    formData1.fechaNacimiento = this.datePipe.transform(valorfecha, 'yyyy-MM-dd');
 
    const fullData = {
      ...formData1, ...formData2,
    }
    console.log(fullData);
  }
}
}
