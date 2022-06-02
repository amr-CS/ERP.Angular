import { Currency } from "../interfaces/currency.interface.";

export class CurrencyDto implements Currency{
  id: number=0;
  nameL1: string='';
  nameL2: string='';
  code?: number | undefined;
  currencyExchange?: number | undefined;
  currencyDecimal?: number | undefined;
  currencyFactorId?: number | undefined;
  currencyIsDefault?: boolean | undefined;
  currencyGenderId?: number | undefined;
  branchId?: number | undefined;
  companyId?: number | undefined;
  currencyAbbr: string='';
  isActive?: boolean | undefined;

}
