import { Pipe, PipeTransform } from '@angular/core';
import { NameCommon } from '../interfaces/namecommon.interface';

@Pipe({
  name: 'securityGradefilter'
})
export class SecurityGradePipe implements PipeTransform {

  transform(SecurityGradeList: NameCommon[], textFilterModel:string) {
    if (textFilterModel)
    {
      return SecurityGradeList.filter(d=>(d.code != null && String(d.code).startsWith(textFilterModel))
      || (d.nameL1 != null && d.nameL1.toLowerCase().startsWith(textFilterModel.toLowerCase()))
      || (d.nameL2 != null && d.nameL2.startsWith(textFilterModel)));

    }
    return SecurityGradeList;
  }
}
