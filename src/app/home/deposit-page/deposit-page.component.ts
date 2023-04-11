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
  accounts: any[] = [];
  holder: any;

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
    const key = new LocalKey("loggedHolder", '');
    const user: any = LocalStorage.getItem(key);
    this.atmService.getAccounts(Number(user)).subscribe({
      next: value => {
        value.forEach((element: any) => {
          if (Number(element.holder.fingerprintID) === Number(user)) {
            this.accounts.push(element);
          }
        });
      },
      error: err => {
        console.log(err.error.message);
      }
    })
  }

  depositClicked(): void {
    this.validateForm();

    const key = new LocalKey("loggedHolder", '');
    const user: any = LocalStorage.getItem(key);
    const depositDate = new Date();
    const accountNumber: any = this.depositForm.get('account')?.value
    console.log(LocalStorage.getItem(key));
    console.log(JSON.parse(user));
    console.log(new Date().toLocaleDateString());
    let body = {
      account: this.getAccountDetails(accountNumber),
      holder: this.holder,
      amount: this.depositForm.get('dollars')?.value + "." + this.depositForm.get('cents')?.value,
      date: depositDate.getDate().toString() + "/" + depositDate.getMonth().toString() + "/" + depositDate.getFullYear().toString() + " " + depositDate.getHours().toString() + ":" + depositDate.getMinutes().toString(),
      transactionType: 'DEPOSIT'
    }
    this.submitDepositForm(body);
  }

  getAccountDetails(accountId: number): any {
    let acc = {};
    this.accounts.forEach(account => {
      if (account.id == accountId) {
        console.log("Account Details")
        console.log(account)
        this.holder = account.holder;
        acc = {
          id: account.id,
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          balance: account.balance,
          holder: account.holder.id
        }
        console.log("Account to be submitted")
        console.log(acc);
      }
    })
    return acc;
  }

  submitDepositForm(body: any): void {
    if (this.validForm) {
      this.atmService.deposit(body).subscribe({
        next: value => {
          Notiflix.Notify.success('Amount successfully deposited');
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
