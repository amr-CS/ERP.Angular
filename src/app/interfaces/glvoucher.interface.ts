export interface GlVoucher {
    demTypeId: number;
    typeDescAr: string;
    typeDescEn: string;
    demTypeDate: string;
    demographicTypeDtltbl: GlVoucherDetails[];
  }
  
  export interface GlVoucherDetails {
    demTypeDtlId: number;
    demTypeId: number;
    choicesAr: string;
    choicesEn: string;
    weightValue: string;
  }