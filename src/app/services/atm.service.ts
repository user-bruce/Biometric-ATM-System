import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtmService {

  constructor(private httpClient: HttpClient) {

  }

  //Base url
  baseUrl: String = "http://127.0.0.1:8000/api"

  //Signup
  signup(body: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/signup`, body);
  }

  //Login
  login(body: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/auth`, body);
  }

  //Deposit
  deposit(body: any): Observable<any> {
    console.log(body);
    return this.httpClient.post<any>(`${this.baseUrl}/transactions`, body);
  }

  //Get Accounts
  getAccounts(): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/accounts`);
  }

  //Withdraw
  withdraw(pin: String): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/withdraw`, pin);
  }

  //Get balance
  getBalance(pin: String): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/balance`, pin);
  }

  //Get Transactions
  listTransactions(pin: String): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/login`, pin);
  }
}
