import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../interfaces/item';

@Pipe({
  name: 'ItemFilter'
})
export class ItemFilterPipe implements PipeTransform {

  transform(ItemList: Item[], textFilterModel:string) {
    if (textFilterModel)
    {
      return ItemList.filter(d=>(d.code != null && String(d.code).startsWith(textFilterModel))
      || (d.nameL1 != null && d.nameL1.toLowerCase().match(textFilterModel.toLowerCase()))
      || (d.nameL2 != null && d.nameL2.match(textFilterModel))|| (d.code != null && d.code.match(textFilterModel))
      || (d.id != null && String(d.id).match(textFilterModel)));
    }

    return ItemList;
  }

}
