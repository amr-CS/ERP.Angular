import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

}
