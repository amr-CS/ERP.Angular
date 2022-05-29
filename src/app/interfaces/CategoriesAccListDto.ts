export interface CategoriesAccListDto {
    compId: number;
    catId: number;
    curId: number;
    branchId : number;
    catAccId : number;
    catTaxAccId   : number;
    catSellAccId  : number;
    catBackBuyAccId  : number;
    catBackSellAccId : number;
    catCostAccId : number;
    catDiscAccId : number;
    catInDiscAccId : number;
    createdBy : number;
    lastUpdatedBy : number;
    vatDebitAccId : number;
    vatCreditAccId : number;
    vatCreditAccNumber:string,
    vatDebitAccNumber:string,
    catCode : number;
    curCode : number;
    curName:string;
    branchNumber : string;
    catTaxAccNumber : string;
    catSellAccNumber : string;
    catBackBuyAccNumber: string;
    catBackSellAccNumber: string;
    catCostAccNumber: string;
    catDiscAccNumber: string;
    catInDiscAccNumber: string;
    isDeleted:boolean;
}
