import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemDto } from '../Dto/ItemDto';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

constructor(private http:HttpClient
  ) { }

itemGetAll() {
  return this.http.get<any[]>(Constants.ApiUrl + '/api/item');
}
itemGetByCode(code:number) {
  return this.http.get<any>(Constants.ApiUrl + '/api/item/GetByCode/'+code);
}

AddEditItemBulk(input:ItemDto[]) {
  return this.http.post<ItemDto[]>(Constants.ApiUrl + '/api/Item/AddEditItemBulk',
  JSON.stringify(input),
    {
      'headers': { 'content-type': 'application/json' }
    }
  );
}
itemGetByBarcodeofUnit(barcode:string) {
  return this.http.get<any>(Constants.ApiUrl + '/api/item/GetItemByBarcodeUnit/'+barcode);
}
}
