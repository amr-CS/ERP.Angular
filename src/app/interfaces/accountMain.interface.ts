/*export interface FoodNodeFlat {
    name: string;
    Id: Number;
    parentId: any;
    children?: FoodNodeFlat[];
   }*/
  
  export interface AccountMain {
    id: any,
    nameL1: string,
    nameL2: any,
    accountNo: any,
    companyId: any,
    parentId: any,
    accountLevel: any,
    isCumulative: any,
    accountTypeId: any,
    currencyId: any,
    accountReportId: any,
    accountCategoryId: any,
    securityGradeId: any,
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
    accountCostCenter: []
    children?: AccountMain[];
   }