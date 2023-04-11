import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AtmService } from '../services/atm.service';
import { LocalKey, LocalStorage } from "ts-localstorage";
import { ToastrService } from 'ngx-toastr';
import Notiflix from 'notiflix';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/websocket.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  validForm: boolean = false;

  serverMessage: String = "...";
  wsSubscription!: Subscription;
  status: any;

  constructor(private fb: FormBuilder, private wsService: WebsocketService, private router: Router, private atmService: AtmService) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      pin: new FormControl([''], [Validators.required, Validators.maxLength(4)]),
      repeatPin: new FormControl([''], [Validators.required, Validators.maxLength(4)])
    });
    this.wsSubscription = this.wsService.createObservableSocket("ws://192.168.43.134/ws").subscribe({
      next: data => {
        if (JSON.parse(data)['status'] === "signup_successful") {

          if (this.isFormValid()) {
            let body = {
              fingerprintID: JSON.parse(data)['id'],
              pin: this.signupForm['controls']['pin'].value
            }
            this.submitHolder(body);
            this.goToLogin()
          } else {
            Notiflix.Notify.failure(
              'PIN is incomplete or does not match',
              {
                timeout: 3000,
              }
            );
          }
        } else if (JSON.parse(data)['status'] === "sensor_ready") {
          Notiflix.Notify.success(
            JSON.parse(data)['message'],
            {
              timeout: 3000,
            }
          );

        } else if (JSON.parse(data)['status'] === 'signup_ready') {
          Notiflix.Notify.success(
            JSON.parse(data)['message'],
            {
              timeout: 3000,
            }
          );
        } else if (JSON.parse(data)['status'] === 'fingerprint_failure') {
          Notiflix.Notify.failure(
            JSON.parse(data)['message'],
            {
              timeout: 3000,
            }
          );
        }
        else if (JSON.parse(data)['status'] === 'fingerprint_match') {
          Notiflix.Notify.success(
            JSON.parse(data)['message'],
            {
              timeout: 3000,
            }
          );
        }
      },
      error: err => console.log('err'),
      complete: () => {

      }
    });

    setTimeout(() => {
      this.wsService.sendMessage('signup_request')
    }, 1000
    );
  }

  isFormValid(): Boolean {
    if (this.signupForm['controls']['pin'].value === '') {
      return false;
    } else if (this.signupForm['controls']['repeatPin'].value === '') {
      return false;
    } else if (this.signupForm['controls']['pin'].value !== this.signupForm['controls']['repeatPin'].value) {
      return false;
    } else {
      return true;
    }
  }

  submitHolder(body: any) {
    this.atmService.signup(body).subscribe({
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

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

}
