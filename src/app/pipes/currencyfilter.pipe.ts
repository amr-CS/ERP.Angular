import { Pipe, PipeTransform } from '@angular/core';
import { Currency } from '../interfaces/currency.interface.';

@Pipe({
  name: 'currencyfilter'
})
export class CurrencyfilterPipe implements PipeTransform {

  transform(currencyList: Currency[], textFilterModel:string) {
    if (textFilterModel)
    {
      return currencyList.filter(d=>(d.code != null && String(d.code).startsWith(textFilterModel))
      || (d.nameL1 != null && d.nameL1.toLowerCase().startsWith(textFilterModel.toLowerCase()))
      || (d.nameL2 != null && d.nameL2.startsWith(textFilterModel)));

    }
    return currencyList;
  }

}
