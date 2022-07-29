import { StoreTransferDtl } from "../interfaces/store-transfer-dtl";
import { StoreTransferDto } from "./StoreTransferDto";

export class StoreTransferDtlDto implements StoreTransferDtl{
  id: number=0;
  storeConversionId: number=0;
  itemId: number=0;
  itemName:string="";
  itemCode:string="";
  unitId: number=0;
  unitName:string="";
  unitCode?:number;
  expireDate: string="";
  itemQty?: number;
  notes: string="";
  isDeleted: boolean=false;
  createdBy: number=0;
  createdOn: Date=new Date();
  lastUpdatedBy: number=0;
  lastUpdatedOn: Date=new Date();
  storeConversion: StoreTransferDto=new StoreTransferDto();

}
