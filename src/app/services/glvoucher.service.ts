import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { GlVoucher} from '../interfaces/glvoucher.interface';

@Injectable({
  providedIn: 'root'
})
export class GlVoucherService {

  constructor(private http: HttpClient) { }


  glVoucherGetAll() {
    return this.http.get<GlVoucher[]>(Constants.ApiUrl + '/api/GlVoucher/Get');
  }


  glVoucherGetById(id: number) {
    return this.http.get<GlVoucher>(Constants.ApiUrl +'/api/GlVoucher/GetById?id=' + id);
  }

  glVoucherDelete(id: number) {
    return this.http.delete<boolean>(Constants.ApiUrl +'/api/GlVoucher/Delete?id=' + id);
  }


  glVoucherCreateUpdate(glVoucher: GlVoucher) {
    return this.http.post<boolean>(Constants.ApiUrl +'/api/GlVoucher/CreateUpdate',
      JSON.stringify(glVoucher),
      {
        'headers': { 'content-type': 'application/json' }
      }
    );
  }
}
