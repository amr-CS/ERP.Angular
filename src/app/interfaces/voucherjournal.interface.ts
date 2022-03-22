import { NameCommon } from "./namecommon.interface";


export interface VoucherJournal {
  id: number;
  documentNumber?: number;
  date: string;
  referenceNumber: string;
  referenceDate: string;
  customerVendorId?: number;
  customerVendorCode?: string;
  customerVendorName?: string;
  sourceTypeId?: number;
  sourceTypeName?: string;
  journalTypeId: number;
  journalTypeName?: string;
  person?: string;
  salesId?: number;
  salesCode?: string;
  salesName?: string;
  isPosted: boolean;
  isIncomplete: boolean;
  isCancelled: boolean;
  isRepeated: boolean;
  isReversed: boolean;
  isCash: boolean;
  isCheck: boolean;
  isCreditCard: boolean;
  isDeleted: boolean;
  isSelected?:boolean;
  notes: string;
  sourceType?:NameCommon;
  customerVendor?:NameCommon;
  sales?:NameCommon;
  journalVoucherDetails: VoucherJournalDetails[];
  receiptVoucherCash: VoucherJournalCashDetails[];
  receiptVoucherCheque: VoucherJournalChequeDetails[];
  receiptVoucherCreditCard: VoucherJournalCreditCardDetails[];
}

export interface VoucherJournalDetails {
  id: number;
  journalVoucherId: number;
  accountId: number;
  accountNo: string;
  currencyId: number;
  currencyExchange?: number;
  debit?: number;
  credit?: number;
  costCenterId?: number;
  notes: string;
  debitDefaultCurrency?: number;
  creditDefaultCurrency?: number;
  account?: NameCommon;
  costCenter?: NameCommon;
  currency?: NameCommon;
}

export interface VoucherJournalCashDetails {
  id: number;
  receiptVoucherId: number;
  boxId: number;
  currencyId: number;
  amount: number;
  amountDefaultCurrency: number;
  currencyEquivalent?: number;
  costCenterId?: number;
  notes: string;
  account?: NameCommon;
  box?: NameCommon;
  costCenter?: NameCommon;
  currency?: NameCommon;
}

export interface VoucherJournalChequeDetails {
  id: number;
  receiptVoucherId: number;
  bankAccountId: number;
  currencyId: number;
  amount: number;
  referenceNumber: string;
  referenceDate?: Date;
  amountDefaultCurrency: number;
  currencyEquivalent?: number;
  costCenterId?: number;
  notes: string;

  costCenter?: NameCommon;
  bankAccount?: NameCommon;
  bankBranch?: NameCommon;
}

export interface VoucherJournalCreditCardDetails {
  id: number;
  receiptVoucherId: number;
  bankAccountId: number;
  currencyId: number;
  amount: number;
  referenceNumber: string;
  referenceDate?: Date;
  amountDefaultCurrency: number;
  currencyEquivalent?: number;
  costCenterId?: number;  
  notes: string;
  creditCardTypeId?: number;  
  creditCardType?: NameCommon;
  bankAccount?: NameCommon;
  bankBranch?: NameCommon;

}