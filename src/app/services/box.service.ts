import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NameCommon } from '../interfaces/namecommon.interface';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class BoxService {

  constructor(private http: HttpClient) { }

  boxGetAll(){
    return this.http.get<[NameCommon]>(Constants.ApiUrl + '/api/box/');
   }

   boxGetByCode(code:number){
    return this.http.get<NameCommon>(Constants.ApiUrl + '/api/box/GetBoxByCode/' + code);
   }
}
