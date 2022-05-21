import { Lookup, LookupDetails } from "../interfaces/lookup.interface";

export class lookupDto implements Lookup{
  id: number=0;
  parentId?: number =0;
  parentCode?: number =0;
  parentName?: string ='';
  parentIdDtl?: number =0;
  parentCodeDtl?: number =0;
  parentNameDtl?: string ='';
  isActive: boolean=false;
  code?: number =0;
  nameL1?: string ='';
  nameL2?: string ='';
  lookupGroup?: number =0;
  notes?: string ='';
  companyId?: number =0;
  isInserted: boolean=false;
  isUpdated: boolean=false;
  isDeleted: boolean=false;
  isSelected: boolean=false;
  lookupDetails: LookupDetails[]=[];

}
