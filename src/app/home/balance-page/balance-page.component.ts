import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { DepositPageComponent } from '../deposit-page/deposit-page.component';
import { WithdrawalPageComponent } from '../withdrawal-page/withdrawal-page.component';

@Component({
  selector: 'app-balance-page',
  templateUrl: './balance-page.component.html',
  styleUrls: ['./balance-page.component.css']
})
export class BalancePageComponent implements OnInit {

  constructor(public dialog:MatDialog) { }

  ngOnInit(): void {
  }

    //Open the deposit dialog
    openDepositDialog(): void{
      const dialogRef = this.dialog.open(DepositPageComponent,{
        // data: {
        //   name : this.name,
        //   position: this.position,
        // }
      });
      dialogRef.afterClosed().subscribe(result =>{
        console.log(result);
      })
    }

    //Open the withdrawal dialog
    openWithdrawalDialog(): void{
      const dialogRef = this.dialog.open(WithdrawalPageComponent,{

      });
      dialogRef.afterClosed().subscribe(result =>{
        console.log(result);
      })
    }

}
