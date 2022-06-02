import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriesAcclistDto } from '../Dto/CategoriesAcclistDto';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class CategoriesAccService {

constructor(private http: HttpClient) { }

categoiesAccountGetAll() {
  return this.http.get<any[]>(Constants.ApiUrl + '/api/CategoriesAcc');
}
createCategoiesAccount(input:any) {
  return this.http.post<any>(Constants.ApiUrl + '/api/CategoriesAcc',input);
}

categoiesAccountGetById(id:any) {
  return this.http.get<any>(Constants.ApiUrl + `/api/CategoriesAcc/${id}`);
}

updateCategoiesAccount(input:any) {
  return this.http.put<any>(Constants.ApiUrl + '/api/CategoriesAcc',input);
}

deleteCategoiesAccount(id:any) {
  return this.http.delete<any>(Constants.ApiUrl + `/api/CategoriesAcc/${id}`);
}

GetCategoriesAccountByCatId(id:any) {
  return this.http.get<any[]>(Constants.ApiUrl + `/api/CategoriesAcc/GetCategoriesAccountByCatId?catId=${id}`);
}
AddEditCategoriesAcc(categoriesAccDto: CategoriesAcclistDto[]) {

  return this.http.post<CategoriesAcclistDto[]>(Constants.ApiUrl +'/api/CategoriesAcc/AddEditCategoriesAccBulk',
    JSON.stringify(categoriesAccDto),
    {
      'headers': {'content-type': 'application/json'}
    }
  );

}
}
