import { Pipe, PipeTransform } from '@angular/core';
import { Bank } from '../interfaces/bank.interface';

@Pipe({
  name: 'bankfilterPipe'
})
export class BankfilterPipe implements PipeTransform {

  transform(bankList: Bank[], textFilterModel:string){
    if (textFilterModel)
    {
      return bankList.filter(d=>(d.code != null && String(d.code).startsWith(textFilterModel))
      || (d.nameL1 != null && d.nameL1.toLowerCase().startsWith(textFilterModel.toLowerCase()))
      || (d.nameL2 != null && d.nameL2.startsWith(textFilterModel))
      || (d.id != null && String(d.id).startsWith(textFilterModel)));
    }

    return bankList;
  }

}
