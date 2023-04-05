import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AtmService } from '../services/atm.service';
import { LocalKey, LocalStorage } from "ts-localstorage";
import { ToastrService } from 'ngx-toastr';
import Notiflix from 'notiflix';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  validForm: boolean = false;

  constructor(private fb: FormBuilder,private router: Router, private atmService: AtmService) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      userName: new FormControl([''], [Validators.required, Validators.maxLength(30)]),
      pin: new FormControl([''], [Validators.required, Validators.maxLength(4)]),
      repeatPin: new FormControl([''], [Validators.required, Validators.maxLength(4)])
    })
  }

  //If valid then send signal to esp32 to prompt for fingerprints
  onFocusOutEvent($event: any): void {
    this.validateForm();
    if (this.validForm) {


      //TODO: Send signal to esp32 to prompt for fingerprint registration


      console.log(this.signupForm.getRawValue())
      this.atmService.signup(this.signupForm.getRawValue()).subscribe({
        next: value => {
          console.log(value)
          Notiflix.Notify.success("User registered successfully");
          this.router.navigate(['/login'])
        },
        error: err => {
          Notiflix.Notify.failure("Signup failed")
        }
      })
    }
  }

  validateForm(): void {
    if (this.signupForm.valid && (this.signupForm.get('pin')!.value === this.signupForm.get('repeatPin')!.value)) {
      this.validForm = true;
      Notiflix.Notify.success('Valid credentials. Await fingerprint notification to complete signup')
    } else {
      this.validForm = false
      if (this.signupForm.valid && (this.signupForm.get('pin')!.value !== this.signupForm.get('repeatPin')!.value)) {
        Notiflix.Notify.failure('Your PIN numbers do not match');
      } else {
        Notiflix.Notify.failure('Your form is invalid');
      }
    }
    console.log(this.signupForm);
  }

}
