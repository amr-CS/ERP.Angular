import { NameCommon } from "./namecommon.interface";

export interface VoucherJournal {  
    id:number;
    documentNumber?:number;
    date:string;
    referenceNumber:string;
    referenceDate:string;
    customerVendorId?:number;
    sourceTypeId?:number;
    sourceTypeName?:string;
    journalTypeId:number;
    journalTypeName?:string;
    isPosted:boolean;
    isIncomplete:boolean;
    isCancelled:boolean;
    isRepeated:boolean;
    isReversed:boolean;
    isDeleted:boolean;
    notes:string;
    isSelected:boolean;
    journalVoucherDetails: VoucherJournalDetails[];
  }
  
  export interface VoucherJournalDetails {
    id:number ;
    journalVoucherId:number;
    accountId:number;
    accountNo:string;
    currencyId:number;
    currencyExchange?:number;
    debit?:number ;
    credit?:number ;
    costCenterId?:number ;
    notes:string ;
    debitDefaultCurrency?:number;
    creditDefaultCurrency?:number;
    account?:NameCommon;
    costCenter?:NameCommon;
    currency?:NameCommon;
    
    
  }