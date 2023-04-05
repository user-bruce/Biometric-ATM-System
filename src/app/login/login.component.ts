import { Component, OnInit } from '@angular/core';
import { AtmService } from '../services/atm.service';
import Notiflix from 'notiflix';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalKey, LocalStorage } from 'ts-localstorage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  validForm: boolean = false;
  constructor(private fb: FormBuilder, private router: Router, private atmService: AtmService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: new FormControl([''], [Validators.required, Validators.maxLength(30)]),
      pin: new FormControl([''], [Validators.required, Validators.maxLength(4)]),
    })
  }

  //If valid then send signal to esp32 to prompt for fingerprints
  onFocusOutEvent($event: any): void {
    this.validateForm();
    if (this.validForm) {


      //TODO: Send signal to esp32 to prompt for fingerprint registration


      console.log(this.loginForm.getRawValue())
      this.atmService.login(this.loginForm.getRawValue()).subscribe({
        next: value => {
          console.log(value);
          const key = new LocalKey("loggedUser", {});
          LocalStorage.setItem(key, value);
          Notiflix.Notify.success("User logged in successfully");
          this.router.navigate(['/home'])
        },
        error: err => {
          Notiflix.Notify.failure("Login failed");
        }
      })
    }
  }

  validateForm(): void {
    if (this.loginForm.valid) {
      this.validForm = true;
      Notiflix.Notify.success('Valid credentials. Await fingerprint notification to complete signup')
    } else {
      this.validForm = false
      Notiflix.Notify.failure('Your form is invalid');
    }
    console.log(this.loginForm);
  }

}
