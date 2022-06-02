import { InvoiceCashDetails } from "../interfaces/Invoice.interface";
import { NameCommon } from "../interfaces/namecommon.interface";

export class InvoiceCashDetailsDto implements InvoiceCashDetails{
  id: number=0;
  invoiceId: number=0;
  accountId: number=0;
  accountNo: string='';
  accountName: string='';
  currencyId: number=0;
  currencyExchange?: number | undefined;
  debit?: number | undefined;
  amount?: number | undefined;
  costCenterId?: number | undefined;
  costCenterCode?: number | undefined;
  costCenterName?: "" | undefined;
  notes: string='';
  debitDefaultCurrency?: number | undefined;
  amountDefaultCurrency?: number | undefined;
  account?: NameCommon | undefined;
  costCenter?: NameCommon | undefined;
  currency?: NameCommon | undefined;

}
