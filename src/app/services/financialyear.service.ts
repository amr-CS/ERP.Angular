import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FinancialYear } from '../interfaces/financialyear.interface';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class FinancialYearService {

  constructor(private http: HttpClient) {  
   }

   financialYearGetCurrentFinancialYear(){
    return this.http.get<FinancialYear>(Constants.ApiUrl + '/api/TblFinancialYear/GetCurrentFinancialYear');
   }
}
