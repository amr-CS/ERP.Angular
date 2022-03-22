import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NameCommon } from '../interfaces/namecommon.interface';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class EPaymentTypeService {

  constructor(private http: HttpClient) { }

  ePaymentTypeGetAll() {
    return this.http.get<[NameCommon]>(Constants.ApiUrl + '/api/EPaymentType/');
  }

  ePaymentTypeGetById(id: number) {
    return this.http.get<NameCommon>(Constants.ApiUrl + '/api/EPaymentType/' + id);
  }

  ePaymentTypeGetByCode(code: number) {
    return this.http.get<NameCommon>(Constants.ApiUrl + '/api/EPaymentType/GetEPaymentTypeByCode/' + code);
  }

}
