import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Constants } from './constants';
import { AccountDetail,AccountMain } from '../interfaces/accountMain.interface';


@Injectable({
  providedIn: 'root'
})
export class TreeService {

constructor(private http:HttpClient) { }

accountGetAll() {
  return this.http.get<AccountDetail[]>(Constants.ApiUrlMain + 'account')
}

accountGetById(id:any) {
  return this.http.get<AccountDetail[]>(Constants.ApiUrlMain + 'account/GetById/' + id)
}
AccountTree(id:any) {
  return this.http.get<any[]>(Constants.ApiUrlMain + 'account/GetAccountTree?parentId='+id)
}
AccountTreeNull() {
  return this.http.get<any[]>(Constants.ApiUrlMain + 'account/GetAccountTree')
}
DeleteAccount(id:any) {

  return this.http.delete(Constants.ApiUrlMain + 'account/'+id)
}
CreateAccount(AccountDetail: any) {

  return this.http.post<any>(Constants.ApiUrlMain + 'account/AddEditAccountBulk',AccountDetail, {
    'headers': { 'content-type': 'application/json' }
  }
  )
}
currency() {
  return this.http.get<any>(Constants.ApiUrlMain + 'currency')
}
securityGrade() {
  return this.http.get<any>(Constants.ApiUrlMain + 'securityGrade')
}
AccountType() {
  return this.http.get<any>(Constants.ApiUrlMain + 'AccountType')
}
AccountReport() {
  return this.http.get<any>(Constants.ApiUrlMain + 'AccountReport')
}
GetAccount(id:any) {
  return this.http.get<any>(Constants.ApiUrlMain + 'account/GetAccount?id='+id)
}
GetParent(id:any) {
  return this.http.get<any>(Constants.ApiUrlMain + 'account/GetParent?id='+id)
}
GetAccountByCode(code:any) {
  return this.http.get<any>(Constants.ApiUrlMain + 'account/GetAccountByCode?code='+code)
}





CurrencyById(id:any) {
  return this.http.get<any>(Constants.ApiUrlMain + 'currency/'+id)
}

}
