import { StoreTransfer } from "../interfaces/store-transfer";
import { StoreTransferDtlDto } from "./StotreTransferDtlDto";

export class StoreTransferDto implements StoreTransfer{
  id: number=0;
  storeConversionCode?: number =0;
  sourceStoreId?: number=0;
  sourceStoreName?:string="";
  sourceStoreCode:string="";
  storeId?: number =0;
  storeName?:string="";
  storeCode?:number=0;
  storeConversionDate: Date=new Date();
  notes?: string ="";
  storeConversionIsActive?: boolean =false;
  isDeleted: boolean =false;
  createdBy: number=0;
  createdOn: Date=new Date();
  lastUpdatedBy?: number=0;
  lastUpdatedOn: Date=new Date();
  companyId?: number =0;
  isRecieved?: boolean =false;
  branchId?: number =0;
  tblStoreConversionDtl: StoreTransferDtlDto[]=[];
  isSelected:boolean=false;

}
