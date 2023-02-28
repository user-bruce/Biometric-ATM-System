import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {MatDialogModule} from '@angular/material/dialog'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { LoginHeaderComponent } from './login/login-header/login-header.component';
import {RouterModule, Routes} from "@angular/router";
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatChipsModule} from '@angular/material/chips';
import { DepositPageComponent } from './home/deposit-page/deposit-page.component';
import { WithdrawalPageComponent } from './home/withdrawal-page/withdrawal-page.component';
import { BalancePageComponent } from './home/balance-page/balance-page.component';
import { SignupHeaderComponent } from './signup/signup-header/signup-header.component';

//Define app routes
let routes: Routes;
routes = [
  {path: "", component: LoginComponent},
  {path: "login", component: LoginComponent},
  {path: "signup", component: SignupComponent},
  {path: "home", component: HomeComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginHeaderComponent,
    SignupComponent,
    HomeComponent,
    DepositPageComponent,
    WithdrawalPageComponent,
    BalancePageComponent,
    SignupHeaderComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,

  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
