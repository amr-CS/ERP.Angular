import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class CostCenterService {

  constructor(private http: HttpClient) { }

  costCenterGetAll() {
    return this.http.get<any[]>(Constants.ApiUrl + '/api/CostCenter');
  }

  costCenterGetByAccountId(accountId:number) {
    return this.http.get<any[]>(Constants.ApiUrl + '/api/CostCenter/GetCostCenterByAccountId?accountId=' + accountId);
  }

  costCenterById(id: number) {
    return this.http.get<any>(Constants.ApiUrl + '/api/CostCenter/' + id);
  }
}
