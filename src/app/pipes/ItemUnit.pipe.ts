import { Pipe, PipeTransform } from '@angular/core';
import { LookupDetails } from '../interfaces/lookup.interface';

@Pipe({
  name: 'ItemUnit'
})
export class ItemUnitPipe implements PipeTransform {

  transform(ItemUnit: LookupDetails[], textFilterModel:string) {
    if (textFilterModel)
    {
      return ItemUnit.filter(d=>(d.code != null && String(d.code).startsWith(textFilterModel))
      || (d.nameL1 != null && d.nameL1.toLowerCase().startsWith(textFilterModel.toLowerCase()))
      || (d.nameL2 != null && d.nameL2.startsWith(textFilterModel)));

    }
    return ItemUnit;
  }

}
