import { NameCommon } from "./namecommon.interface";

export interface Bank {
  id: number;
  parentId?: number;
  code?: number;
  nameL1?: string;
  nameL2?: string;

  accountId?: Number;
  accountCode?: string;
  accountName?: string;

  bankTypeId?: Number;
  bankTypeCode?: Number;
  bankTypeName?: Number;
  
  branchId?: number;
  branchcode?: number;
  branchName?: number;

  isActive: boolean;

  bankAccount:BankAccount[];

  isInserted:boolean;
  isUpdated:boolean;
  isDeleted:boolean;

  isSelected:boolean;
}

export interface BankAccount {
  id: number;
  code?: number;
  nameL1?: string;
  nameL2?: string;
  bankId: number;
  accountId: Number;
  accountCode?: string;
  accountName?: string;
  isActive: boolean;
  account?:NameCommon;
}


