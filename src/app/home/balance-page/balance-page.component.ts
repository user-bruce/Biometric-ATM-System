import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { DepositPageComponent } from '../deposit-page/deposit-page.component';
import { WithdrawalPageComponent } from '../withdrawal-page/withdrawal-page.component';
import { AtmService } from 'src/app/services/atm.service';
import { LocalKey, LocalStorage } from 'ts-localstorage';
import Notiflix from 'notiflix';

@Component({
  selector: 'app-balance-page',
  templateUrl: './balance-page.component.html',
  styleUrls: ['./balance-page.component.css']
})
export class BalancePageComponent implements OnInit {

  accounts: any[] = [];
  currentBalance = 0.00;

  constructor(public dialog: MatDialog, private atmService: AtmService) {

  }

  ngOnInit(): void {
    const key = new LocalKey("loggedHolder", '')
    const user: any = LocalStorage.getItem(key)


    this.atmService.getAccounts(Number(user)).subscribe({
      next: value => {
        value.forEach((element: any) => {
          if (Number(element.holder.fingerprintID) === Number(user)) {
            this.accounts.push(element);
          }
        });
      },
      error: err => {
        Notiflix.Notify.failure("Could not fetch accounts")
      }
    })
  }

  optionClicked(acc: any) {
    this.currentBalance = acc.balance
  }

  //Open the deposit dialog
  openDepositDialog(): void {
    const dialogRef = this.dialog.open(DepositPageComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {

    })
  }

  //Open the withdrawal dialog
  openWithdrawalDialog(): void {
    const dialogRef = this.dialog.open(WithdrawalPageComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      
    })
  }

}
