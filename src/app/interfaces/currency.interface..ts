import { NameCommon } from "./namecommon.interface";

export interface Currency {
  id:number ;
  nameL1?:string;
  nameL2?:string;
  code?:number ;
  currencyExchange?:number ;
  currencyDecimal?: number;
  currencyFactorId?:number ;
  currencyIsDefault?:boolean ;
  currencyGenderId?:number;
  branchId?:number ;
  companyId?:number ;
  currencyAbbr: string;
  isActive?:boolean ;
}

