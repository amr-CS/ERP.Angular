export interface AddEditCategoriesAccDto {
  compId: number;
  catId: number;
  curId: number;
  branchId: number;
  catAccId: number;
  catTaxAccId?: number;
  catSellAccId?: number;
  catBackBuyAccId?: number;
  catBackSellAccId?: number;
  catCostAccId?: number;
  catDiscAccId?: number;
  catInDiscAccId?: number;
  username?: string;
  timestamp?: Date;
  createdOn?: Date;
  lastUpdatedOn?: Date;
  createdBy?: number;
  lastUpdatedBy?: number;
  vatDebitAccId?: number;
  vatCreditAccId?: number;
  isDeleted:boolean;
}
