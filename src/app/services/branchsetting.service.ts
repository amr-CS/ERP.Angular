import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs';
import { Branchsetting } from '../interfaces/branchsetting.interface';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class BranchsettingService {

constructor(private http:HttpClient) { }

getAllBranchsetting(){
 return this.http.get<Branchsetting>(Constants.ApiUrl + '/api/branchsetting/1')
}
SaveBranchsetting(branchsetting:Branchsetting){
  if(branchsetting.id>0){
  return this.http.put<Branchsetting>(Constants.ApiUrl + '/api/branchsetting/',
  JSON.stringify(branchsetting),
  {
    'headers': { 'content-type': 'application/json' }
  })}
  else{
    return this.http.post<Branchsetting>(Constants.ApiUrl + '/api/branchsetting/',
  JSON.stringify(branchsetting),
  {
    'headers': { 'content-type': 'application/json' }
  })
  }

 }
 getLookup(id:number){
  return this.http.get<Branchsetting>(Constants.ApiUrl + 'api/lookup/GetLookupDetails?lookupId='+id)
 }

}
