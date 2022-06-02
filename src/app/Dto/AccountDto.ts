import { Account } from "../interfaces/account.interface";
import { Currency } from "../interfaces/currency.interface.";

export class AccountDto implements Account{
  id: number=0;
  nameL1: string='';
  nameL2: string='';
  accountNo: string='';
  currencyId: number=0;
  currency?: Currency | undefined;
  isCostCenter: boolean=false;

}
