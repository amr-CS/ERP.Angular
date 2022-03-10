import { Pipe, PipeTransform } from '@angular/core';
import { CostCenter } from '../interfaces/costcenter.interface';

@Pipe({
  name: 'costcenterfilter'
})
export class CostcenterfilterPipe implements PipeTransform {

  transform(costCenterList: CostCenter[], textFilterModel:string) {
    if (textFilterModel)
    {
      return costCenterList.filter(d=>(d.code != null && String(d.code).startsWith(textFilterModel))
      || (d.nameL1 != null && d.nameL1.toLowerCase().startsWith(textFilterModel.toLowerCase()))
      || (d.nameL2 != null && d.nameL2.startsWith(textFilterModel)));

    }
    return costCenterList;
  }

}
