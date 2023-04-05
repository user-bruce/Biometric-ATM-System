import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-withdrawal-page',
  templateUrl: './withdrawal-page.component.html',
  styleUrls: ['./withdrawal-page.component.css']
})
export class WithdrawalPageComponent implements OnInit {

  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  withdrawalClicked(): void{
    console.log("Withdraw success");
    this.toastr.success("Withdrawal was successful", "Success");
  }

}
