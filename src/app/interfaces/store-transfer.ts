import { StoreTransferDtlDto } from '../Dto/StotreTransferDtlDto';

export interface StoreTransfer {
  id: number;
  storeConversionCode?: number;
  sourceStoreId?: number;
  storeId?: number;
  storeConversionDate: Date;
  notes?: string;
  storeConversionIsActive?: boolean;
  isDeleted: boolean;
  createdBy: number;
  createdOn: Date;
  lastUpdatedBy?: number;
  lastUpdatedOn: Date;
  companyId?: number;
  isRecieved?: boolean;
  branchId?: number;

  tblStoreConversionDtl: StoreTransferDtlDto[];
}
