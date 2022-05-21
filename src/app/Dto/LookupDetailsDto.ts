import { LookupDetails } from "../interfaces/lookup.interface";
import { NameCommon } from "../interfaces/namecommon.interface";

export class lookupDetailsDto implements LookupDetails{
  id: number=0;
  code?: number | undefined;
  companyId?: number | undefined;
  nameL1?: string | undefined;
  nameL2?: string | undefined;
  lookupId: number=0;
  ord?: number | undefined;
  valLink: number=0;
  valLinkCode?: number | undefined;
  valLinkName?: string | undefined;
  accountId?: Number | undefined;
  accountCode?: string | undefined;
  account?: NameCommon | undefined;
  accountId2?: Number | undefined;
  accountCode2?: string | undefined;
  accountId2Navigation?: NameCommon | undefined;
  isActive: boolean=false;
  isDefault: boolean=false;
  descShortL1?: string | undefined;
  descShortL2?: string | undefined;
  descL1?: string | undefined;
  descL2?: string | undefined;
  notes?: string | undefined;
  value1?: string | undefined;
  value2?: string | undefined;
  value3?: number | undefined;
  date1?: Date | undefined;
  date2?: Date | undefined;
}
