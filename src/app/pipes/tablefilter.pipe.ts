import { Pipe, PipeTransform } from '@angular/core';
import { DemographicInfo } from '../interfaces/demographicInfo.interface';

@Pipe({
  name: 'tablefilter',
  pure:false
})
export class TablefilterPipe implements PipeTransform {

  transform(demoGraphicInfoList : DemographicInfo[], filterModel:string) {
    if (filterModel)
    {
      return demoGraphicInfoList.filter(d=>d.typeDescAr.startsWith(filterModel)
      || d.typeDescEn.toLowerCase().startsWith(filterModel.toLowerCase())
      || String(d.demTypeId).startsWith(filterModel));

    }
    return demoGraphicInfoList;
    
  }

}
