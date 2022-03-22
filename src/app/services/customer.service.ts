import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NameCommon } from '../interfaces/namecommon.interface';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  customerGetAll(){
    return this.http.get<NameCommon>(Constants.ApiUrl + '/api/Customer/');
   }

  customerGetAllByType(isSale:boolean){
    return this.http.get<[NameCommon]>(Constants.ApiUrl + '/api/Customer/GetCustomersByType/' + isSale);
   }

   customerGetByCode(isSale:boolean,code:number){
    return this.http.get<NameCommon>(Constants.ApiUrl + '/api/Customer/GetCustomerByCode/' + isSale
    +'/' + code);
   }     

}
