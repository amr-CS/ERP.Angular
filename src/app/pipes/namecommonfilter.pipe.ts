import { Pipe, PipeTransform } from '@angular/core';
import { NameCommon } from '../interfaces/namecommon.interface';

@Pipe({
  name: 'namecommonfilter'
})
export class NameCommonfilterPipe implements PipeTransform {

  transform(nameCommon: NameCommon[], textFilterModel:string) {
    if (textFilterModel)
    {
      return nameCommon.filter(d=>(d.code != null && String(d.code).startsWith(textFilterModel))
      || (d.nameL1 != null && d.nameL1.toLowerCase().startsWith(textFilterModel.toLowerCase()))
      || (d.nameL2 != null && d.nameL2.startsWith(textFilterModel)));

    }
    return nameCommon;
  }

}
