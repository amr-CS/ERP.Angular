import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NameCommon } from '../interfaces/namecommon.interface';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class TransactionSourceService {

  constructor(private http: HttpClient) { }

  transactionSourceGetById(id: number) {
    return this.http.get<NameCommon>(Constants.ApiUrl +'/api/TransactionSource/' + id);
  }
}
