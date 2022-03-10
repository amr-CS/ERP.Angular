import { Pipe, PipeTransform } from '@angular/core';
import { VoucherJournal } from '../interfaces/voucherjournal.interface';

@Pipe({
  name: 'voucherjournalfilter'
})
export class VoucherJournalFilterPipe implements PipeTransform {

  transform(voucherJournalList : VoucherJournal[], textFilterModel:string, dateFromFilterModel :Date
    ,dateToFilterModel: Date, dateReferenceFilterModel:Date, isDateFilter: Boolean, isDateRefFilter: Boolean) {
      if (textFilterModel)
      {
        return voucherJournalList.filter(d=>d.referenceNumber.startsWith(textFilterModel)        
        || String(d.id).startsWith(textFilterModel));
  
      }
  
    if (isDateFilter){
       if(!isDateRefFilter){
         return voucherJournalList.filter(d=>new Date(d.date).getTime() >= new Date(dateFromFilterModel).getTime() && new Date(d.date).getTime() <= new Date(dateToFilterModel).getTime());
        }   
       else{
         return voucherJournalList.filter(d=>new Date(d.referenceDate).getTime() == new Date(dateReferenceFilterModel).getTime());
       } 
        
      }
  
      return voucherJournalList;
  }

}
