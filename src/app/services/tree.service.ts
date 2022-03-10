import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Constants } from './constants';
import { AccountMain } from '../interfaces/accountMain.interface';


@Injectable({
  providedIn: 'root'
})
export class TreeService {

constructor(private http:HttpClient) { }

accountGetAll() {
  return this.http.get<AccountMain[]>(Constants.ApiUrlMain + 'account')
}

accountGetById(id:any) {
  return this.http.get<AccountMain[]>(Constants.ApiUrlMain + 'account/GetById/' + id)
}
AccountTree(id:any) {
  return this.http.get<any[]>(Constants.ApiUrlMain + 'account/GetAccountTree?parentId='+id)
}
AccountTreeNull() {
  return this.http.get<any[]>(Constants.ApiUrlMain + 'account/GetAccountTree')
}
DeleteAccount(id:any) {
  console.log(this.http.delete(Constants.ApiUrlMain + 'account/'+id))

  return this.http.delete(Constants.ApiUrlMain + 'account/'+id)
}
CreateAccount(accountMain: AccountMain) {

  return this.http.post<any>(Constants.ApiUrlMain + 'account/AddEditBulk/',JSON.stringify(accountMain), {
    'headers': { 'content-type': 'application/json' }
  }
  )
}



}
