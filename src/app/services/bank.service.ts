import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NameCommon } from '../interfaces/namecommon.interface';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private http: HttpClient) { }

  bankGetAll(){
    return this.http.get<[NameCommon]>(Constants.ApiUrl + '/api/bank/');
   }

  bankGetByCode(code:number){
    return this.http.get<NameCommon>(Constants.ApiUrl + '/api/bank/GetbankByCode/' + code);
   }

   bankGetById(id:number ){
    return this.http.get<NameCommon>(Constants.ApiUrl + '/api/bank/'+id);
   }
}
