import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../interfaces/account.interface';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }
  
  accountGetAll() {
    return this.http.get<any[]>(Constants.ApiUrl + '/api/Account');
  }

  accountGetById(id: number) {
    return this.http.get<any>(Constants.ApiUrl + '/api/Account/' + id);
  }


}
