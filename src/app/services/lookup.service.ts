import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lookup, LookupDetails } from '../interfaces/lookup.interface';
import { NameCommon } from '../interfaces/namecommon.interface';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private http: HttpClient) { }


  lookupGetAll(){
    return this.http.get<Lookup[]>(Constants.ApiUrl + '/api/lookup/GetAllLookups');
  }

  lookupDetailsGetById(id:number){    
    return this.http.get<[LookupDetails]>(Constants.ApiUrl + '/api/lookup/GetLookupDetails?lookupId=' + id);
  }
  GetlookupDetailsById(id:number){    
    return this.http.get<any>(Constants.ApiUrl + '/api/lookup/GetLookupDetails?lookupId=' + id);
  }


  lookupGetById(id:number){    
    return this.http.get<any>(Constants.ApiUrl + '/api/lookup/GetLookupDetails?lookupId=' + id);
  }
  lookupGetByCode(id:number,code:number){    
    return this.http.get<any>(Constants.ApiUrl + '/api/lookup/GetLookupDetailsByCode?lookupId=117&&Code=' + code);
  }
 
  lookupDelete(id:number){
    return this.http.delete<boolean>(Constants.ApiUrl +'/api/lookup/' + id);
  }

  lookupAddEdit(lookups: Lookup[]) {    
    
    return this.http.post<Lookup[]>(Constants.ApiUrl +'/api/lookup/AddEditLookupBulk',
      JSON.stringify(lookups),
      {
        'headers': {'content-type': 'application/json'}
      }
    );
   
  }
}
