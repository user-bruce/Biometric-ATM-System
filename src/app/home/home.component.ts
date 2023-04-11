import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {BalancePageComponent} from "./balance-page/balance-page.component";
import {DepositPageComponent} from "./deposit-page/deposit-page.component";
import {WithdrawalPageComponent} from "./withdrawal-page/withdrawal-page.component";
import { AtmService } from '../services/atm.service';
import { LocalKey, LocalStorage } from 'ts-localstorage';
import { ToastrService } from 'ngx-toastr';
import Notiflix from 'notiflix';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['accountName', 'amount', 'transactionType', 'date'];
  dataSource!: any[];

  //Name
  name: string | undefined;
  position: string | undefined;

  constructor(public dialog: MatDialog, private atmService: AtmService, private toatsr: ToastrService) { }

  //Open the dialog
  openBalanceDialog(): void{
    const dialogRef = this.dialog.open(BalancePageComponent,{
      data: {
        name : this.name,
        position: this.position,
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      console.log(result);
    })
  }

  //Open the deposit dialog
  openDepositDialog(): void{
    const dialogRef = this.dialog.open(DepositPageComponent,{
      data: {
        name : this.name,
        position: this.position,
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      console.log(result);
    })
  }

  //Open the withdrawal dialog
  openWithdrawalDialog(): void{
    const dialogRef = this.dialog.open(WithdrawalPageComponent,{
      data: {
        name : this.name,
        position: this.position,
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      console.log(result);
    })
  }

  ngOnInit(): void {
    this.name="Mr Bruce Chimoyo";
    this.position = "Mayor";

    const key = new LocalKey("loggedHolder", '');
    const user: any = LocalStorage.getItem(key);

    this.atmService.listTransactions(Number(user)).subscribe({
      next: value =>{
        this.dataSource = value.slice(0,4);
        value.forEach((element: any) => {
          if (Number(element.holder.fingerprintID) === Number(user)) {
            this.dataSource.push(element);
          }
        });
        console.log(this.dataSource)
        this.dataSource = this.dataSource.slice(0,4);
      },
      error: err=>{
        Notiflix.Notify.failure(err.message)
      }
    })
  }

  // getRecentTransactions(): void{
  //   const key = new LocalKey("loggedUser", '');
  //   const user: any = LocalStorage.getItem(key);

  //   this.atmService.listTransactions(JSON.parse(user)[0]['id']).subscribe({
  //     next: value =>{
  //       this.dataSource = value;
  //       console.log(this.dataSource)
  //     },
  //     error: err=>{
  //       Notiflix.Notify.failure(err.message)
  //     }
  //   })
  // }

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
