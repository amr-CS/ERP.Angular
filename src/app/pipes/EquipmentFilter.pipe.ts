import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'EquipmentFilter'
})
export class EquipmentFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
