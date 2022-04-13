import { Pipe, PipeTransform } from '@angular/core';
import { Invoice } from '../interfaces/Invoice.interface';

@Pipe({
  name: 'invoice'
})
export class InvoicePipe implements PipeTransform {

  transform(voucherJournalList : Invoice[], textFilterModel:string, dateFromFilterModel :Date
    ,dateToFilterModel: Date, dateReferenceFilterModel:Date, isDateFilter: Boolean, isDateRefFilter: Boolean) {
      if (textFilterModel)
      {
        return voucherJournalList.filter(d=>d.invRef.startsWith(textFilterModel)        
        || String(d.invId).startsWith(textFilterModel));
  
      }
  
    if (isDateFilter){
       if(!isDateRefFilter){
         return voucherJournalList.filter(d=>new Date(d.invDate).getTime() >= new Date(dateFromFilterModel).getTime() && new Date(d.invDate).getTime() <= new Date(dateToFilterModel).getTime());
        }   
       else{
         return voucherJournalList.filter(d=>new Date(d.invRefDate).getTime() == new Date(dateReferenceFilterModel).getTime());
       } 
        
      }
  
      return voucherJournalList;
    }

}
