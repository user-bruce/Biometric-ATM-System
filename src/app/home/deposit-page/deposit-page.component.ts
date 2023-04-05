import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Notiflix from 'notiflix';
import { ToastrService } from 'ngx-toastr';
import { AtmService } from 'src/app/services/atm.service';
import { LocalKey, LocalStorage } from 'ts-localstorage';
import { User } from '../../shared/models/user'

@Component({
  selector: 'app-deposit-page',
  templateUrl: './deposit-page.component.html',
  styleUrls: ['./deposit-page.component.css']
})
export class DepositPageComponent implements OnInit {

  depositForm!: FormGroup;
  validForm: boolean = false;
  accounts!: any[];

  constructor(private fb: FormBuilder, private router: Router, private atmService: AtmService) { }

  ngOnInit(): void {
    this.depositForm = this.fb.group({
      account: new FormControl('', [Validators.required]),
      dollars: new FormControl([''], [Validators.required, Validators.maxLength(30)]),
      cents: new FormControl('00', [Validators.required, Validators.maxLength(4)]),
    })
    this.getAccounts();
  }

  getAccounts(): void {
    this.atmService.getAccounts().subscribe({
      next: value => {
        console.log(value);
        this.accounts = value;
        console.log(this.accounts);
      },
      error: err => {
        console.log(err.error.message)
      }
    })
  }

  depositClicked(): void {
    this.validateForm();

    const key = new LocalKey("loggedUser", '');
    const user: any = LocalStorage.getItem(key);

    const accountNumber: any = this.depositForm.get('account')?.value
    console.log(LocalStorage.getItem(key));
    let body = {
      holder: JSON.parse(user)[0]['id'],
      amount: this.depositForm.get('dollars')?.value + "." + this.depositForm.get('cents')?.value,
      account: accountNumber,
      transactionType: 'DEPOSIT'
    }
    this.submitDepositForm(body);
  }

  submitDepositForm(body: any): void {
    if (this.validForm) {
      this.atmService.deposit(body).subscribe({
        next: value => {
          console.log(value);
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  validateForm(): void {
    if (this.depositForm.valid) {
      this.validForm = true;
    } else {
      this.validForm = false
    }
    console.log(this.depositForm);
  }

}
