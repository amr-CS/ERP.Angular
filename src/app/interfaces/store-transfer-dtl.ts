import { StoreTransferDto } from '../Dto/StoreTransferDto';

export interface StoreTransferDtl {
  id: number;
  storeConversionId: number;
  itemId: number;
  unitId: number;
  expireDate: string;
  itemQty?: number;
  notes: string;
  isDeleted: boolean;
  createdBy: number;
  createdOn: Date;
  lastUpdatedBy: number;
  lastUpdatedOn: Date;

  storeConversion: StoreTransferDto;

}


