import { NameCommon } from "./namecommon.interface";


export interface Lookup {
  id: number;

  parentId?: number;
  parentCode?: number;
  parentName?: string;

  parentIdDtl?: number;
  parentCodeDtl?: number;
  parentNameDtl?: string;

  isActive: boolean;
  code?: number;
  nameL1?: string;
  nameL2?: string;
  lookupGroup?: number;
  notes?: string;

  companyId?:number;

  isInserted:boolean;
  isUpdated:boolean;
  isDeleted:boolean;

  isSelected:boolean;

  lookupDetails:LookupDetails[];
}

export interface LookupDetails {
  id: number;
  code?: number;
  companyId?:number;
  nameL1?: string;
  nameL2?: string;
  lookupId: number;
  ord?: number;
  valLink: number;
  valLinkCode?: number;
  valLinkName?: string;

  accountId?: Number;
  accountCode?: string;
  account?:NameCommon;

  accountId2?: Number;
  accountCode2?: string;
  accountId2Navigation?:NameCommon;

  isActive: boolean;
  isDefault: boolean;
  descShortL1?:string;
  descShortL2?:string;
  descL1?:string;
  descL2?:string;
  notes?: string;
  value1?:string;
  value2?:string;
  value3?:number;
  date1?:Date;
  date2?:Date;
}


