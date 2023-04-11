import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Notiflix from 'notiflix';
import { AtmService } from 'src/app/services/atm.service';
import { LocalKey, LocalStorage } from 'ts-localstorage';

@Component({
  selector: 'app-withdrawal-page',
  templateUrl: './withdrawal-page.component.html',
  styleUrls: ['./withdrawal-page.component.css']
})
export class WithdrawalPageComponent implements OnInit {

  withdrawalForm!: FormGroup;
  validForm: boolean = false;
  accounts: any[] = [];
  holder: any;

  constructor(private fb: FormBuilder, private router: Router, private atmService: AtmService) { }

  ngOnInit(): void {
    this.withdrawalForm = this.fb.group({
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

  withdrawalClicked(): void {
    this.validateForm();

    const key = new LocalKey("loggedHolder", '');
    const user: any = LocalStorage.getItem(key);
    const withdrawalDate = new Date();

    const accountNumber: any = this.withdrawalForm.get('account')?.value
    console.log(LocalStorage.getItem(key));
    console.log(JSON.parse(user));
    let body = {
      account: this.getAccountDetails(accountNumber),
      holder: this.holder,
      amount: this.withdrawalForm.get('dollars')?.value + "." + this.withdrawalForm.get('cents')?.value,
      date: withdrawalDate.getDate().toString()+"/"+withdrawalDate.getMonth().toString()+"/"+withdrawalDate.getFullYear().toString()+" "+withdrawalDate.getHours().toString()+":"+withdrawalDate.getMinutes().toString(),
      transactionType: 'WITHDRAWAL'
    }
    this.submitWithdrawalForm(body);
  }

  getAccountDetails(accountId: number): any{
    let acc = {};
    this.accounts.forEach(account =>{
      if(account.id == accountId){
        console.log("Account Details");
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

  submitWithdrawalForm(body: any): void {
    if (this.validForm) {
      //TODO: Change service name here
      this.atmService.withdraw(body).subscribe({
        next: value => {
          Notiflix.Notify.success('Withdrawal was successfull');
        },
        error: err => {
          Notiflix.Notify.failure("Withdrawal failed. Check if you have sufficient funds")
        }
      })
    }
  }

  validateForm(): void {
    if (this.withdrawalForm.valid) {
      this.validForm = true;
    } else {
      this.validForm = false
    }
    console.log(this.withdrawalForm);
  }


}
