import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }


  menuGetAll() {
    //return this.http.get<any[]>(Constants.ApiUrl + '/api/Menu');
    return [{id:1,code:'1',nameL1:'القائمة الاولى ',nameL2:''},
            {id:2,code:'2',nameL1:'القائمة الثانية ',nameL2:''}];
  } 

  menuGetByCode(code: string) {
    //return this.http.get<any>(Constants.ApiUrl + '/api/Menu/GetByMenuCode?aenuCode=' + code);
    var l = [{id:1,code:1,nameL1:'القائمة الاولى ',nameL2:''},
    {id:2,code:2,nameL1:'القائمة الثانية ',nameL2:''}];

    return l.filter(l=>l.code == Number(code));

  }
}
