import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bank, BankAccount } from '../interfaces/bank.interface';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  constructor(private http: HttpClient) { 
    
  }

  bankGetAll(){
    return this.http.get<[Bank]>(Constants.ApiUrl + '/api/bank/');
  }

  bankAccountsGetById(id:number){
    return this.http.get<[BankAccount]>(Constants.ApiUrl + '/api/bank/');
  }

  bankDelete(id:number){
    return this.http.delete<boolean>(Constants.ApiUrl +'/api/bank/' + id);
  }

  bankAddEdit(banks: Bank[]) {
    return this.http.post<Bank[]>(Constants.ApiUrl +'/api/bank/AddEditBankBulk',
      JSON.stringify(banks),
      {
        'headers': { 'content-type': 'application/json' }
      }
    );
  }  
  
}
