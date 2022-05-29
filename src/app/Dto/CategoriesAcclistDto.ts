import { CategoriesAccListDto } from "../interfaces/CategoriesAccListDto";

export class CategoriesAcclistDto implements CategoriesAccListDto{
  compId: number =0;
  catId: number=0;
  curId: number=0;
  branchId: number=0;
  catAccId: number=0;
  catTaxAccId: number=0;
  catSellAccId: number=0;
  catBackBuyAccId: number=0;
  catBackSellAccId: number=0;
  catCostAccId: number=0;
  catDiscAccId: number=0;
  catInDiscAccId: number=0;
  vatDebitAccId: number=0;
  vatCreditAccId: number=0;
  catGroupAccId:number=0;
  vatCreditAccNumber: string='';
  vatDebitAccNumber: string='';
  catCode: number=0;
  curCode: number=0;
  curName: string='';
  branchNumber: string='';
  catTaxAccNumber: string='';
  catSellAccNumber: string='';
  catGroupAccNumber:string='';
  catBackBuyAccNumber: string='';
  catBackSellAccNumber: string='';
  catCostAccNumber: string='';
  catDiscAccNumber: string='';
  catInDiscAccNumber: string='';
  username?: string;
  timestamp?: Date;
  createdOn?: Date;
  lastUpdatedOn?: Date;
  createdBy: number=0;
  lastUpdatedBy: number=0;
  isDeleted:boolean=false;
}
