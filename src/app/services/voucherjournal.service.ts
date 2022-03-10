import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { VoucherJournal} from '../interfaces/voucherjournal.interface';

@Injectable({
  providedIn: 'root'
})
export class VoucherJournalService {

  constructor(private http: HttpClient) { }


  voucherJournalGetAll() {
    return this.http.get<VoucherJournal[]>(Constants.ApiUrl + '/api/JournalVoucher');
  }


  voucherJournalGetById(id: number) {
    return this.http.get<VoucherJournal>(Constants.ApiUrl +'/api/JournalVoucher/' + id);
  }

  voucherJournalDelete(id: number) {
    return this.http.delete<boolean>(Constants.ApiUrl +'/api/JournalVoucher/' + id);
  }


  voucherJournalCreate(glVoucher: VoucherJournal) {
    return this.http.post<VoucherJournal>(Constants.ApiUrl +'/api/JournalVoucher/',
      JSON.stringify(glVoucher),
      {
        'headers': { 'content-type': 'application/json' }
      }
    );
  }

  voucherJournalUpdate(glVoucher: VoucherJournal) {
    return this.http.put<VoucherJournal>(Constants.ApiUrl +'/api/JournalVoucher/',
      JSON.stringify(glVoucher),
      {
        'headers': { 'content-type': 'application/json' }
      }
    );
  }
}
