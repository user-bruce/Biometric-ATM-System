import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {BalancePageComponent} from "./balance-page/balance-page.component";
import {DepositPageComponent} from "./deposit-page/deposit-page.component";
import {WithdrawalPageComponent} from "./withdrawal-page/withdrawal-page.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //Name
  name: string | undefined;
  position: string | undefined;

  constructor(public dialog: MatDialog) { }

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
  }

}
