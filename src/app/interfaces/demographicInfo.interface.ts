export interface DemographicInfo {
    demTypeId: number;
    typeDescAr: string;
    typeDescEn: string;
    demTypeDate: string;
    demographicTypeDtltbl: DemographicInfoDetails[];
  }
  
  export interface DemographicInfoDetails {
    demTypeDtlId: number;
    demTypeId: number;
    choicesAr: string;
    choicesEn: string;
    weightValue: string;
  }