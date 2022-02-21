import { Pipe, PipeTransform } from '@angular/core';
import { DemographicInfo } from '../interfaces/demographicInfo.interface';

@Pipe({
  name: 'demographicfilter'
})
export class DemographicfilterPipe implements PipeTransform {

  transform(demoGraphicInfoList : DemographicInfo[], textFilterModel:string, dateFromFilterModel :Date
    ,dateToFilterModel: Date, isDateFilter: Boolean) {
    if (textFilterModel)
    {
      return demoGraphicInfoList.filter(d=>d.typeDescAr.startsWith(textFilterModel)
      || d.typeDescEn.toLowerCase().startsWith(textFilterModel.toLowerCase())
      || String(d.demTypeId).startsWith(textFilterModel));

    }

  if(isDateFilter){
      return  demoGraphicInfoList.filter(d=>new Date(d.demTypeDate).getTime() >= new Date(dateFromFilterModel).getTime() && new Date(d.demTypeDate).getTime() <= new Date(dateToFilterModel).getTime());
    }

    return demoGraphicInfoList;
    
  }

}
