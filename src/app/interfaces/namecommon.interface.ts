import { Account } from "./account.interface";
import { BankAccount } from "./bankaccount.interface";

export interface NameCommon {
    id?:number,
    code?:string,
    nameL1?:string,
    nameL2?:string ,
    accountId?:number,
    accountNo?:string,    
    bankAccount?:[],
    bank?:BankAccount,
    boxDetails?:[{account:Account}]
  }  

  