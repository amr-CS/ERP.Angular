import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Currency } from '../interfaces/currency.interface.';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }

  currencyGetAll(){
    return this.http.get<[Currency]>(Constants.ApiUrl + '/api/currency/');
   }

   currencyGetByCode(code:number){
    return this.http.get<Currency>(Constants.ApiUrl + '/api/currency/GetCurrencyByCode/' + code);
   }
}
