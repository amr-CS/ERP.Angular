/*export interface FoodNodeFlat {
    name: string;
    Id: Number;
    parentId: any;
    children?: FoodNodeFlat[];
   }*/

import { NameCommon } from "./namecommon.interface";

  

   export interface AccountMain {
    accountDetail: AccountDetail[];
  }
  export interface AccountDetail{
    id: any,
    code:any,
    nameL1: string,
    nameL2: any,
    accountNo: any,
    companyId: any,
    parentId: any,
    accountLevel: any,
    isCumulative: any,
    accountTypeId: any,
    accountTypeName:any,
    currencyId: any,
    currencyName:any,
    accountReportId: any,
    accountReportName:any,
    accountCategoryId: any,
    securityGradeId: any,
    securityGradeName:any,
    isCostCenter: any,
    currencyFactorId: any,
    accountIsDebit: any,
    cashFlowTypeId: any,
    isActive: any,
    isDeleted: any,
    createdBy: any,
    createdOn: any,
    lastUpdatedBy: any,
    lastUpdatedOn: any,
   // accountCostCenter: []
  // currency?:NameCommon;
   children?: AccountDetail[];
   }