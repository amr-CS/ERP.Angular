import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreTransferDto } from '../Dto/StoreTransferDto';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class StoreTransferService {

  constructor(private http:HttpClient) { }

  AddEditStoreTransferBulk(input:StoreTransferDto[]) {
    return this.http.post<StoreTransferDto[]>(Constants.ApiUrl + '/api/StoreConversion/AddEditStoreConversionBulk',
    JSON.stringify(input),
      {
        'headers': { 'content-type': 'application/json' }
      }
    );
  }
  AddEditStoreTransfer(input:StoreTransferDto) {
    return this.http.post<StoreTransferDto>(Constants.ApiUrl + '/api/StoreConversion/AddEditStoreConversion',
    JSON.stringify(input),
      {
        'headers': { 'content-type': 'application/json' }
      }
    );
  }

  GetAllStoreTransferBulk() {
    return this.http.get<StoreTransferDto[]>(Constants.ApiUrl + '/api/StoreConversion',
    );
  }
  storeTransferGetById(id:number) {
    return this.http.get<any>(Constants.ApiUrl + '/api/StoreConversion/GetStoreConversionById/'+id);
  }
}
