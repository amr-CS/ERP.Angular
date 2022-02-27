import { Pipe, PipeTransform } from '@angular/core';
import { GlVoucher } from '../interfaces/glvoucher.interface';

@Pipe({
  name: 'glvoucherfilter'
})
export class GlVoucherFilterPipe implements PipeTransform {

  transform(glVoucherList : GlVoucher[], textFilterModel:string, dateFromFilterModel :Date
    ,dateToFilterModel: Date, isDateFilter: Boolean) {
      if (textFilterModel)
      {
        return glVoucherList.filter(d=>d.typeDescAr.startsWith(textFilterModel)
        || d.typeDescEn.toLowerCase().startsWith(textFilterModel.toLowerCase())
        || String(d.demTypeId).startsWith(textFilterModel));
  
      }
  
    if(isDateFilter){
        return  glVoucherList.filter(d=>new Date(d.demTypeDate).getTime() >= new Date(dateFromFilterModel).getTime() && new Date(d.demTypeDate).getTime() <= new Date(dateToFilterModel).getTime());
      }
  
      return glVoucherList;
  }

}
