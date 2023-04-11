import { Component, OnInit } from '@angular/core';
import { AtmService } from '../services/atm.service';
import Notiflix from 'notiflix';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalKey, LocalStorage } from 'ts-localstorage';
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/websocket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  serverMessage: String = "...";
  wsSubscription!: Subscription;
  status: any;

  loginForm!: FormGroup;
  validForm: boolean = false;
  constructor(private fb: FormBuilder, private wsService: WebsocketService, private router: Router, private atmService: AtmService) {
    this.wsSubscription = this.wsService.createObservableSocket("ws://192.168.43.134/ws").subscribe({
      next: data => {
        if (JSON.parse(data)['status'] === "login_successful") {
          const key = new LocalKey("loggedHolder", "")
          LocalStorage.setItem(key, JSON.parse(data)['id'])
          if (this.isFormValid()) {
            if (this.checkUser(Number(JSON.parse(data)['id']))) {
              const key = new LocalKey("loggedHolder", "")
              LocalStorage.setItem(key, JSON.parse(data)['id'])
            }
          }
        } else if (JSON.parse(data)['status'] === 'login_ready') {
          Notiflix.Notify.success(
            `${JSON.parse(data)['message']}`,
            {
              timeout: 3000,
            },
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
          const key = new LocalKey("loggedHolder", "")
          LocalStorage.setItem(key, JSON.parse(data)['id'])
          Notiflix.Notify.success(
            JSON.parse(data)['message'],
            {
              timeout: 3000,
            }
          );
          if (this.isFormValid()) {
            if (this.checkUser(Number(JSON.parse(data)['id']))) {
              const key = new LocalKey("loggedHolder", "")
              LocalStorage.setItem(key, JSON.parse(data)['id'])
            }
          }

        }
        else if (JSON.parse(data)['status'] === 'login_failure') {
          Notiflix.Notify.failure(
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
      this.wsService.sendMessage('login_request')
    }, 1000
    );
  }

  checkUser(id: Number): Boolean {
    var available: Boolean = false;
    this.atmService.getHolder(id).subscribe({
      next: value => {
        this.goToHome();
      }, error: err => {
      }
    })

    return available;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      pin: new FormControl([''], [Validators.required, Validators.maxLength(4)]),
    })
  }

  isFormValid(): Boolean {
    if (this.loginForm['controls']['pin'].value === '') {
      return false;
    } else {
      return true;
    }
  }

  goToHome(): void {
    this.router.navigate(['/home'])
  }

  // submitHolder(body: any) {
  //   this.atmService.signup(body).subscribe({
  //     next: value => {
  //       console.log(value)
  //       Notiflix.Notify.success("User logged in successfully");
  //       this.router.navigate(['/home'])
  //     },
  //     error: err => {
  //       Notiflix.Notify.failure("Login failed")
  //     }
  //   })
  // }

}
