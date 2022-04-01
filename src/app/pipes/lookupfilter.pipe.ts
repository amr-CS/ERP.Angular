import { Pipe, PipeTransform } from '@angular/core';
import { Lookup } from '../interfaces/lookup.interface';

@Pipe({
  name: 'lookupfilter'
})
export class LookupfilterPipe implements PipeTransform {

  transform(lookUpList: Lookup[], textFilterModel:string) {
    if (textFilterModel)
    {
      return lookUpList.filter(d=>(d.code != null && String(d.code).startsWith(textFilterModel))
      || (d.nameL1 != null && d.nameL1.toLowerCase().startsWith(textFilterModel.toLowerCase()))
      || (d.nameL2 != null && d.nameL2.startsWith(textFilterModel))
      || (d.id != null && String(d.id).startsWith(textFilterModel)));
    }

    return lookUpList;
  }

}
