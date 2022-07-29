import { Pipe, PipeTransform } from '@angular/core';
import { ItemUnitDto } from '../Dto/ItemUnitDto';

@Pipe({
  name: 'ItemUnitFilter'
})
export class ItemUnitFilterPipe implements PipeTransform {

  transform(ItemUnit: ItemUnitDto[], textFilterModel:string) {
    if (textFilterModel)
    {
      return ItemUnit.filter(d=>(d.unitCode != null && String(d.unitCode).startsWith(textFilterModel))
      || (d.unitNameL1 != null && d.unitNameL1.toLowerCase().startsWith(textFilterModel.toLowerCase()))
      );

    }
    return ItemUnit;
  }
}
