import { Pipe, PipeTransform } from '@angular/core';
import { Account } from '../interfaces/account.interface';

@Pipe({
  name: 'accountfilter'
})
export class AccountfilterPipe implements PipeTransform {

  transform(accountList: Account[], textFilterModel:string) {
    if (textFilterModel)
    {
      return accountList.filter(d=>(d.accountNo != null && d.accountNo.startsWith(textFilterModel))
      || (d.nameL1 != null && d.nameL1.toLowerCase().startsWith(textFilterModel.toLowerCase()))
      || (d.nameL2 != null && d.nameL2.startsWith(textFilterModel)));

    }

    return accountList;
  }

}
