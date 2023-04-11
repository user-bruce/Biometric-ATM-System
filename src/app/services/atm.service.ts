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

  getHolder(id: Number): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/holder/${id}`);
  }

  //Login
  login(body: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/auth`, body);
  }

  //Deposit
  deposit(body: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/transactions`, body);
  }

  //Get Accounts
  getAccounts(clientID: number): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/accounts/${clientID}`);
  }

  //Withdraw
  withdraw(body: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/transactions`, body);
  }

  //Get balance
  getBalance(pin: String): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/balance`, pin);
  }

  //Get Transactions
  listTransactions(clientID: Number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/transactions/${clientID}`);
  }
}
