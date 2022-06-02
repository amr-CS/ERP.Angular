
import { Pipe, PipeTransform } from '@angular/core';
import {  LookupDetails } from '../interfaces/lookup.interface';

@Pipe({
  name: 'lookupCategoryFilter'
})
export class LookupCategoryFilterPipe implements PipeTransform {

  transform(lookUpList: LookupDetails[], textFilterModel:string) {
    if (textFilterModel)
    {
      return lookUpList.filter(d=>(d.code != null && String(d.code).startsWith(textFilterModel))
      || (d.nameL1 != null && d.nameL1.toLowerCase().match(textFilterModel.toLowerCase()))
      || (d.nameL2 != null && d.nameL2.match(textFilterModel))
      || (d.id != null && String(d.id).match(textFilterModel)));
    }

    return lookUpList;
  }

}
