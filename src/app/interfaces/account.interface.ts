import { Currency } from "./currency.interface.";

export interface Account {  
  id:number ;
  nameL1:string;
  nameL2:string;
  accountNo:string;
  currencyId:number;
  currency?:Currency;
  isCostCenter:boolean;
}
  
  