import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {MatDialogModule} from '@angular/material/dialog'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { LoginHeaderComponent } from './login/login-header/login-header.component';
import {RouterModule, Routes} from "@angular/router";
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import {MatIconModule} from "@angular/material/icon";
import {ToastrModule} from 'ngx-toastr';
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatChipsModule} from '@angular/material/chips';
import { DepositPageComponent } from './home/deposit-page/deposit-page.component';
import { WithdrawalPageComponent } from './home/withdrawal-page/withdrawal-page.component';
import { BalancePageComponent } from './home/balance-page/balance-page.component';
import { SignupHeaderComponent } from './signup/signup-header/signup-header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import {MatSelectModule} from '@angular/material/select';

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
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    HttpClientModule,
    MatCardModule,
    MatListModule,
    ToastrModule.forRoot(
      {
        maxOpened: 1,
        progressBar: true,
        progressAnimation: 'decreasing',
        preventDuplicates: true,
      }
    ),
    MatDialogModule,
    FontAwesomeModule,

  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
