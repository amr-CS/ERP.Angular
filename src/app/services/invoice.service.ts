import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from '../interfaces/Invoice.interface';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

constructor(private http:HttpClient ) { 
}

GetAllinvoice() {
  return this.http.get<any>(Constants.ApiUrl +'/api/invoice');
}
GetinvoiceById(id:number) {
  return this.http.get<any>(Constants.ApiUrl +'/api/invoice/'+id);
}
invoiceCreate(invoice: Invoice) {
  return this.http.post<Invoice>(Constants.ApiUrl +'/api/invoice/',
    JSON.stringify(invoice),
    {
      'headers': { 'content-type': 'application/json' }
    }
  );
}
invoiceUpdate(invoice: Invoice) {
  return this.http.put<Invoice>(Constants.ApiUrl +'/api/invoice/',
    JSON.stringify(invoice),
    {
      'headers': { 'content-type': 'application/json' }
    }
  );
}
invoiceDelete(id: number) {
  return this.http.delete<boolean>(Constants.ApiUrl +'/api/invoice/' + id);
}

}
