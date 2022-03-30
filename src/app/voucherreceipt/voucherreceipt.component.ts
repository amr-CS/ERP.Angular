import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VoucherJournal, VoucherJournalCashDetails, VoucherJournalChequeDetails, VoucherJournalCreditCardDetails, VoucherJournalDetails } from '../interfaces/voucherjournal.interface';
import { NameCommon } from '../interfaces/namecommon.interface';
import { VoucherJournalService } from '../services/voucherjournal.service';
import { UtilityService } from '../services/utility.service';
import { TransactionSourceService } from '../services/transactionsource.service';
import { TransactionTypeService } from '../services/transactiontype.service';
import { AlertifyService } from '../services/alertify.service';
import { Account } from '../interfaces/account.interface';
import { AccountService } from '../services/account.service';
import { CostCenter } from '../interfaces/costcenter.interface';
import { CostCenterService } from '../services/costcenter.service';
import { FinancialYearService } from '../services/financialyear.service';
import { Constants } from '../services/constants';
import { CustomerService } from '../services/customer.service';
import { CurrencyService } from '../services/currency.service';
import { BoxService } from '../services/box.service';
import { BankService } from '../services/bank.service';
import { Currency } from '../interfaces/currency.interface.';
import { EPaymentTypeService } from '../services/epayment-type.service';

@Component({
  selector: 'app-voucherreceipt',
  templateUrl: './voucherreceipt.component.html',
  styleUrls: ['./voucherreceipt.component.css']
})
export class VoucherReceiptComponent {
  @ViewChild('table') detailsTable!: ElementRef;

  textFilterModel: string;
  dateFromFilterModel: Date;
  dateToFilterModel: Date;
  dateReferenceFilterModel: Date;

  totalDebit = 0;
  totalCredit = 0;
  totalDifference = 0;

  totalDebitReceipt = 0;
  totalDifferenceReceipt = 0;
  totalReceipt = 0;

  totalCash = 0;
  totalCheck = 0;
  totalCreditCard = 0;

  currentFinancialYear = '';
  isCurrentFinancialYear = true;
  selectedTab = 'home';

  public voucherReceiptRows: Array<string>;

  public voucherReceipt: VoucherJournal = {
    id: 0,
    date: new Date().toLocaleDateString(),
    referenceNumber: '',
    referenceDate: new Date().toLocaleDateString(),
    journalTypeId: 3,
    sourceTypeId: undefined,
    isPosted: false,
    isIncomplete: false,
    isCancelled: false,
    isRepeated: false,
    isReversed: false,
    isDeleted: false,
    notes: '',
    journalVoucherDetails: [],
    receiptVoucherCash: [],
    receiptVoucherCheque: [],
    receiptVoucherCreditCard: [],
    isCash: true,
    isCheck: false,
    isCreditCard: false
  };
  public voucherReceiptList: VoucherJournal[] = [];
  public nameCommon: NameCommon = {};
  public newVoucherReceiptDetail: VoucherJournalDetails = {
    id: 0, journalVoucherId: 0, accountId: 0, accountNo: '', currencyId: 0, debit: 0,
    debitDefaultCurrency: 0, credit: 0, creditDefaultCurrency: 0, notes: '',
    account: {}, currency: {}, costCenter: {}
  };

  public newVoucherReceiptCashDetail: VoucherJournalCashDetails = {
    id: 0, receiptVoucherId: 0, boxId: 0, currencyId: 0, amount: 0, amountDefaultCurrency: 0, notes: '',
    account: {}, currency: {}, costCenter: {}, box: {}
  };

  public newVoucherReceiptChequeDetail: VoucherJournalChequeDetails = {
    id: 0, receiptVoucherId: 0, bankAccountId: 0, currencyId: 0, amount: 0, referenceNumber: '', amountDefaultCurrency: 0, notes: '',
    costCenter: {}, bankAccount: {}, bankBranch: {}
  };

  public newVoucherReceiptCreditCardDetail: VoucherJournalCreditCardDetails = {
    id: 0, receiptVoucherId: 0, bankAccountId: 0, currencyId: 0, amount: 0, referenceNumber: '', amountDefaultCurrency: 0, notes: '',
    bankAccount: {}, bankBranch: {}, creditCardType: {}
  };

  public sourceTypeName?: string = '';
  public journalTypeName?: string = '';

  public accountList: Account[] = [];
  public costCenterList: CostCenter[] = [];
  public transactionSourceList: NameCommon[] = [];
  public customerCustomersList: NameCommon[] = [];
  public customerSalesList: NameCommon[] = [];
  public customersList: NameCommon[] = [];
  public currencyList: Currency[] = [];
  public boxList: NameCommon[] = [];
  public bankList: NameCommon[] = [];
  public bankBranchList: [] = [];
  public ePaymentList: NameCommon[] = [];



  itemDetailOld: VoucherJournalDetails = {
    id: 0, journalVoucherId: 0, accountId: 0, accountNo: '', currencyId: 0, debit: 0, debitDefaultCurrency: 0, credit: 0,
    creditDefaultCurrency: 0, notes: '', account: {}, currency: {}, costCenter: {}
  };


  constructor(private service: VoucherJournalService, private transactionSourceService: TransactionSourceService,
    private transactionTypeService: TransactionTypeService, public datePipe: DatePipe, public utilityService: UtilityService,
    private alertify: AlertifyService, private accountService: AccountService, private costCenterService: CostCenterService,
    private financialYearService: FinancialYearService, private customerService: CustomerService,
    private currencyService: CurrencyService, private boxService: BoxService, private bankService: BankService,
    private ePaymentTypeService: EPaymentTypeService) {

    //this.transactionSourceGet();
    this.transactionSourceGetAll()
    this.transactionTypeGet();
    this.accountGetAll();
    this.voucherReceiptGetByTransactionTypeId();
    this.getCurrentFinancialYear();
    this.customersGetAllByType();
    this.currencyGetAll();
    this.boxGetAll();
    this.bankGetAll();
    this.ePaymentTypeGetAll();


    this.textFilterModel = '';
    this.dateFromFilterModel = new Date();
    this.dateToFilterModel = new Date();
    this.dateReferenceFilterModel = new Date();

    this.voucherReceiptRows = ['accountNo', 'debit', 'credit', 'costCenterId', 'notes'];

    for (let index = 0; index < Constants.inputsCount; index++) {
      this.addItemDetail();
    }

  }

  ngOnInit(): void {
  }

  // transactionSourceGet()
  // { // the id for this page for source is 1
  //   this.transactionSourceService.transactionSourceGetById(1).subscribe(result=>{
  //     this.sourceTypeName = result.nameL1;
  //     this.voucherReceipt.sourceTypeName = result.nameL1;
  //   });
  // }



  customersGetAllByType() {
    this.customerService.customerGetAllByType(true).subscribe(result => {
      this.customerCustomersList = result;
    });

    this.customerService.customerGetAllByType(false).subscribe(result => {
      this.customerSalesList = result;
    });
  }

  currencyGetAll() {
    this.currencyService.currencyGetAll().subscribe(result => {
      this.currencyList = result;
    });
  }

  ePaymentTypeGetAll() {
    this.ePaymentTypeService.ePaymentTypeGetAll().subscribe(result => {
      this.ePaymentList = result;
    });
  }

  boxGetAll() {
    this.boxService.boxGetAll().subscribe(result => {
      this.boxList = result;
    });
  }

  bankGetAll() {
    this.bankService.bankGetAll().subscribe(result => {
      this.bankList = result;
    });
  }

  transactionSourceGetAll() {
    this.transactionSourceService.transactionSourceGetAll().subscribe(result => {
      this.transactionSourceList = result;
    });
  }

  transactionTypeGet() {
    // the id for this page for type is 2
    this.transactionTypeService.transactionTypeGetById(3).subscribe(result => {
      this.journalTypeName = result.nameL1;
      this.voucherReceipt.journalTypeName = result.nameL1;
    });
  }

  getCurrentFinancialYear() {
    this.financialYearService.financialYearGetCurrentFinancialYear().subscribe(result => {
      this.currentFinancialYear = result.financialYear;
    });
  }

  accountGetAll() {
    this.accountService.accountGetAll().subscribe(result => {
      this.accountList = result;
    });
  }

  totalDebitCreditCalculate() {
    var debtSum = 0;
    // var creditSum = 0;
    this.voucherReceipt.journalVoucherDetails.forEach(e => {
      debtSum += e.debit || 0;
      // creditSum += e.credit || 0;
    });

    this.totalDebit = debtSum;
    // this.totalCredit = creditSum;
    // this.totalDifference = Math.abs(debtSum - creditSum);
  }

  voucherReceiptGetByTransactionTypeId() {
    this.service.voucherJournalGetByTransactionTypeId(3).subscribe(result => {
      this.voucherReceiptList = result;
    }, error => console.error(error));
  }

  voucherReceiptGetById(id: any) {
    if (id) {
      this.service.voucherJournalGetById(Number(id)).subscribe(result => {
        if (result !== null) {

          this.isUpdate = true;
          this.voucherReceipt = result;
          this.voucherReceipt.date = this.datePipe.transform(this.voucherReceipt.date, 'yyyy-MM-dd') || '';
          this.voucherReceipt.referenceDate = this.datePipe.transform(this.voucherReceipt.referenceDate, 'yyyy-MM-dd') || '';
          this.voucherReceipt.sourceTypeName = result.sourceType?.nameL1;
          // this.voucherReceipt.customerVendorName = result.customerVendor?.nameL1;
          // this.voucherReceipt.customerVendorCode = result.customerVendor?.code;
          if (this.voucherReceipt.customerVendorId) {
            var currentCustomer = this.customerCustomersList.filter(c => c.id == this.voucherReceipt.customerVendorId);
            if (currentCustomer && currentCustomer.length > 0) {
              this.voucherReceipt.customerVendorName = currentCustomer[0].nameL1;
              this.voucherReceipt.customerVendorCode = currentCustomer[0].code;
            }
          }

          // this.voucherReceipt.salesName = result.sales?.nameL1;
          // this.voucherReceipt.salesCode = result.sales?.code;
          if (this.voucherReceipt.salesId) {
            var currentSales = this.customerSalesList.filter(s => s.id == this.voucherReceipt.salesId);
            if (currentSales && currentSales.length > 0) {
              this.voucherReceipt.salesName = currentSales[0].nameL1;
              this.voucherReceipt.salesCode = currentSales[0].code;
            }
          }
          // to remove null console errors
          this.voucherReceipt.journalVoucherDetails.forEach(e => {
            if (e.account == null) {
              e.account = {};
            }

            if (e.currency == null) {
              e.currency = {};
            }

            if (e.costCenter == null) {
              e.costCenter = {};
            }
          });

          this.voucherReceipt.receiptVoucherCash.forEach(e => {
            if (e.account == null) {
              e.account = {};
            }

            if (e.currency == null) {
              e.currency = {};
            }

            if (e.costCenter == null) {
              e.costCenter = {};
            }

            if (e.box == null) {
              e.box = {};
            }
            else {
              if (e.box && e.box.boxDetails &&
                e.box.boxDetails.length > 0 && e.box.boxDetails[0].account)

                e.account = e.box?.boxDetails?.[0].account;
              if (e.account)
                e.account.code = e.box?.boxDetails?.[0].account.accountNo;
              e.box.accountId = e.box?.boxDetails?.[0].account.id;
            }
          });



          this.voucherReceipt.receiptVoucherCheque.forEach(e => {

            if (e.bankAccount == null) {
              e.bankAccount = {};
            }
            else {
              e.bankBranch = {};
              e.bankBranch.nameL1 = e.bankAccount?.nameL1;
              e.bankBranch.nameL2 = e.bankAccount?.nameL2;
              e.bankBranch.code = e.bankAccount?.code;

              e.bankAccount.nameL1 = e.bankAccount?.bank?.nameL1;
              e.bankAccount.nameL2 = e.bankAccount?.bank?.nameL2;
              e.bankAccount.code = e.bankAccount?.bank?.code
            }

            if (e.costCenter == null) {
              e.costCenter = {};
            }
          });

          this.voucherReceipt.receiptVoucherCreditCard.forEach(e => {

            if (e.bankAccount == null) {
              e.bankAccount = {};
            }
            else {
              e.bankBranch = {};
              e.bankBranch.nameL1 = e.bankAccount?.nameL1;
              e.bankBranch.nameL2 = e.bankAccount?.nameL2;
              e.bankBranch.code = e.bankAccount?.code;

              e.bankAccount.nameL1 = e.bankAccount?.bank?.nameL1;
              e.bankAccount.nameL2 = e.bankAccount?.bank?.nameL2;
              e.bankAccount.code = e.bankAccount?.bank?.code
            }

            if (e.creditCardType == null) {
              e.creditCardType = {};
            }
          });

          this.totalDebitCalculate();
          this.calculateTotalCash();
          this.calculateTotalCheque();
          this.calculateTotalCreditCard();
          this.calculateTotalCreditCard();

        }
      }, error => console.error(error));
    }

  }

  voucherReceiptDelete(id: number) {
    var isSuccess = false;
    if (id) {
      this.alertify.confirm('are you sure to delete journal Voucher ' + id, () => {
        this.service.voucherJournalDelete(id).subscribe(result => {
          isSuccess = result;
          this.utilityService.reloadComponent();
          this.alertify.success('تم الحذف');
        }, error => alert('Not Found'));

      });

    }
    return isSuccess;
  }

  // flag to determine the ability to update or disable all controls
  public isUpdate = false;
  public pageName = "سند قبض";
  voucherReceiptIsUpdateableToggle() {
    this.isUpdate = !this.isUpdate;
  }


  voucherReceiptDetailsAdjustment() {
    var detailsCopy = this.voucherReceipt.journalVoucherDetails;
    detailsCopy = [];
    this.voucherReceipt.journalVoucherDetails.forEach(element => {
      if (element.accountNo && element.debit != undefined && element.credit != undefined) {
        detailsCopy.push(element);
      }
    });
    this.voucherReceipt.journalVoucherDetails = detailsCopy;
  }

  successCreateUpdate(result: any) {
    this.alertify.success('نجاح');
    this.voucherReceipt = result;

    this.voucherReceipt.sourceTypeName = result.sourceType?.nameL1;
    // this.voucherReceipt.customerVendorName = result.customerVendor?.nameL1;
          // this.voucherReceipt.customerVendorCode = result.customerVendor?.code;
          if (this.voucherReceipt.customerVendorId) {
            var currentCustomer = this.customerCustomersList.filter(c => c.id == this.voucherReceipt.customerVendorId);
            if (currentCustomer && currentCustomer.length > 0) {
              this.voucherReceipt.customerVendorName = currentCustomer[0].nameL1;
              this.voucherReceipt.customerVendorCode = currentCustomer[0].code;
            }
          }

          // this.voucherReceipt.salesName = result.sales?.nameL1;
          // this.voucherReceipt.salesCode = result.sales?.code;
          if (this.voucherReceipt.salesId) {
            var currentSales = this.customerSalesList.filter(s => s.id == this.voucherReceipt.salesId);
            if (currentSales && currentSales.length > 0) {
              this.voucherReceipt.salesName = currentSales[0].nameL1;
              this.voucherReceipt.salesCode = currentSales[0].code;
            }
          }

    this.voucherReceipt.journalVoucherDetails.forEach(element => {
      element.costCenter = element.costCenter ? element.costCenter : {};
      element.costCenterId = element.costCenterId ? element.costCenterId : undefined;
    });

    this.voucherReceipt.receiptVoucherCash.forEach(element => {
      if (element.box && element.box.boxDetails &&
        element.box.boxDetails.length > 0 && element.box.boxDetails[0].account)
        element.account = element.box?.boxDetails?.[0].account;

      if (element.account && element.box) {
        element.account.code = element.box?.boxDetails?.[0].account.accountNo;
        element.box.accountId = element.box?.boxDetails?.[0].account.id;
      }

      element.costCenter = element.costCenter ? element.costCenter : {};
      element.costCenterId = element.costCenterId ? element.costCenterId : undefined;
    });

    this.voucherReceipt.receiptVoucherCheque.forEach(e => {
      e.bankBranch = {};
      if (e.bankBranch) {
        e.bankBranch.nameL1 = e.bankAccount?.nameL1;
        e.bankBranch.nameL2 = e.bankAccount?.nameL2;
        e.bankBranch.code = e.bankAccount?.code;
      }

      if (e.bankAccount) {
        e.bankAccount.nameL1 = e.bankAccount?.bank?.nameL1;
        e.bankAccount.nameL2 = e.bankAccount?.bank?.nameL2;
        e.bankAccount.code = e.bankAccount?.bank?.code
      }

    });


    this.voucherReceipt.receiptVoucherCreditCard.forEach(e => {
      e.bankBranch = {};
      if (e.bankBranch) {
        e.bankBranch.nameL1 = e.bankAccount?.nameL1;
        e.bankBranch.nameL2 = e.bankAccount?.nameL2;
        e.bankBranch.code = e.bankAccount?.code;
      }

      if (e.bankAccount) {
        e.bankAccount.nameL1 = e.bankAccount?.bank?.nameL1;
        e.bankAccount.nameL2 = e.bankAccount?.bank?.nameL2;
        e.bankAccount.code = e.bankAccount?.bank?.code
      }


    });


    //this.voucherReceiptGetByTransactionTypeId();

    this.isUpdate = true;
  }

  voucherReceiptCreateUpdate(myForm: NgForm) {
    // force the UI validation to appear
    myForm.form.markAllAsTouched();
    if (this.Validate(myForm)) {
      this.undefineObjectProperties();
      this.voucherReceipt.date = this.datePipe.transform(this.voucherReceipt.date, 'yyyy-MM-dd') || '';
      this.voucherReceipt.referenceDate = this.datePipe.transform(this.voucherReceipt.referenceDate, 'yyyy-MM-dd') || '';
      this.voucherReceiptDetailsAdjustment();
      console.log(this.voucherReceipt)
      if (this.voucherReceipt.id == 0) {
        this.service.voucherJournalCreate(this.voucherReceipt).
          subscribe(result => {

            this.successCreateUpdate(result);
          }, error => console.error(error));
      }
      else {

        // empty list if corresponding checkbox is false
        if (!this.voucherReceipt.isCash)
          this.voucherReceipt.receiptVoucherCash = [];
        if (!this.voucherReceipt.isCheck)
          this.voucherReceipt.receiptVoucherCheque = [];
        if (!this.voucherReceipt.isCreditCard)
          this.voucherReceipt.receiptVoucherCreditCard = [];

        this.service.voucherJournalUpdate(this.voucherReceipt).
          subscribe(result => {

            this.successCreateUpdate(result);
          }, error => console.error(error));
      }

    }
  }

  //Undefined the object properties not needed to be mapped on Create and Update 
  undefineObjectProperties() {
    this.voucherReceipt.customerVendor = undefined;
    this.voucherReceipt.sourceType = undefined;
    this.voucherReceipt.sales = undefined;

    this.voucherReceipt.journalVoucherDetails.forEach(e => {
      e.account = undefined;
      e.currency = undefined;
      e.costCenter = undefined;
    });

    this.voucherReceipt.receiptVoucherCash.forEach(e => {
      e.account = undefined;
      e.currency = undefined;
      e.costCenter = undefined;
      e.box = undefined;
    });

    this.voucherReceipt.receiptVoucherCheque.forEach(e => {
      e.bankAccount = undefined;
      e.bankBranch = undefined;
      e.costCenter = undefined;
    });

    this.voucherReceipt.receiptVoucherCreditCard.forEach(e => {
      e.bankAccount = undefined;
      e.bankBranch = undefined;
      e.creditCardType = undefined;
    });

  }



  removeItemDetail(index: number) {
    this.voucherReceipt.journalVoucherDetails.splice(index, 1);
  }

  removeItemCashDetail(index: number) {
    this.voucherReceipt.receiptVoucherCash.splice(index, 1);
  }

  removeItemChequeDetail(index: number) {
    this.voucherReceipt.receiptVoucherCheque.splice(index, 1);
  }

  removeItemCreditCardDetail(index: number) {
    this.voucherReceipt.receiptVoucherCreditCard.splice(index, 1);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  addItemDetail(i?: number) {
    this.newVoucherReceiptDetail.journalVoucherId = this.voucherReceipt.id;
    if (this.voucherReceipt.journalVoucherDetails === null) {
      this.voucherReceipt.journalVoucherDetails = [];
    }

    if (i == undefined) {
      this.voucherReceipt.journalVoucherDetails.push(this.newVoucherReceiptDetail);
    }
    else {
      this.voucherReceipt.journalVoucherDetails.splice(i + 1, 0, this.newVoucherReceiptDetail);
    }


    //this.itemDetailOld = this.newVoucherReceiptDetail;
    this.newVoucherReceiptDetail = {
      id: 0, journalVoucherId: 0, accountId: 0, accountNo: '', currencyId: 0, debit: 0,
      debitDefaultCurrency: 0, credit: 0, creditDefaultCurrency: 0, notes: '', account: {}, currency: {}, costCenter: {}
    };

    this.totalDebitCalculate();
    //this.totalDebitCreditCalculate();

  }

  totalReceiptCalculate() {
    this.totalReceipt = this.totalDebitReceipt - this.totalDifferenceReceipt;
  }

  totalDifferenceCalculate() {
    this.totalDifferenceReceipt = this.totalCash + this.totalCheck + this.totalCreditCard;
    this.totalReceiptCalculate();
  }

  totalDebitCalculate() {
    this.totalDebitReceipt = 0;
    this.voucherReceipt.journalVoucherDetails.forEach(e => {
      this.totalDebitReceipt += e.debitDefaultCurrency || 0;
    });

    this.totalDifferenceCalculate();
  }

  calculateTotalCash() {
    this.totalCash = 0;
    this.voucherReceipt.receiptVoucherCash.forEach(e => {
      this.totalCash += Number(e.amountDefaultCurrency | 0);
    });

    this.totalDifferenceCalculate();
  }

  calculateTotalCheque() {
    this.totalCheck = 0;
    this.voucherReceipt.receiptVoucherCheque.forEach(e => {
      this.totalCheck += Number(e.amountDefaultCurrency | 0);
    });

    this.totalDifferenceCalculate();
  }

  calculateTotalCreditCard() {
    this.totalCreditCard = 0;
    this.voucherReceipt.receiptVoucherCreditCard.forEach(e => {
      this.totalCreditCard += Number(e.amountDefaultCurrency | 0);
    });

    this.totalDifferenceCalculate();
  }

  addItemCashDetail(i?: number) {
    this.newVoucherReceiptCashDetail.receiptVoucherId = this.voucherReceipt.id;
    if (this.voucherReceipt.receiptVoucherCash === null) {
      this.voucherReceipt.receiptVoucherCash = [];
    }

    if (i == undefined) {
      this.voucherReceipt.receiptVoucherCash.push(this.newVoucherReceiptCashDetail);
    }
    else {
      this.voucherReceipt.receiptVoucherCash.splice(i + 1, 0, this.newVoucherReceiptCashDetail);
    }


    //this.itemDetailOld = this.newVoucherReceiptCashDetail;
    this.newVoucherReceiptCashDetail = {
      id: 0, receiptVoucherId: 0, boxId: 0, currencyId: 0, amount: 0, amountDefaultCurrency: 0, notes: '',
      account: {}, currency: {}, costCenter: {}, box: {}
    };

    //this.totalDebitCreditCalculate();
    this.calculateTotalCash();

  }

  addItemChequeDetail(i?: number) {
    this.newVoucherReceiptChequeDetail.receiptVoucherId = this.voucherReceipt.id;
    if (this.voucherReceipt.receiptVoucherCheque === null) {
      this.voucherReceipt.receiptVoucherCheque = [];
    }

    if (i == undefined) {
      this.voucherReceipt.receiptVoucherCheque.push(this.newVoucherReceiptChequeDetail);
    }
    else {
      this.voucherReceipt.receiptVoucherCheque.splice(i + 1, 0, this.newVoucherReceiptChequeDetail);
    }


    //this.itemDetailOld = this.newVoucherReceiptChequeDetail;
    this.newVoucherReceiptChequeDetail = {
      id: 0, receiptVoucherId: 0, bankAccountId: 0, currencyId: 0, amount: 0, referenceNumber: '', amountDefaultCurrency: 0, notes: '',
      costCenter: {}, bankAccount: {}, bankBranch: {}
    };

    //this.totalDebitCreditCalculate();
    this.calculateTotalCheque();
  }


  addItemCreditCardDetail(i?: number) {
    this.newVoucherReceiptCreditCardDetail.creditCardTypeId = this.ePaymentList[0].id;
    this.newVoucherReceiptCreditCardDetail.creditCardType = {};
    this.newVoucherReceiptCreditCardDetail.creditCardType = this.ePaymentList[0];

    this.newVoucherReceiptCreditCardDetail.receiptVoucherId = this.voucherReceipt.id;
    if (this.voucherReceipt.receiptVoucherCreditCard === null) {
      this.voucherReceipt.receiptVoucherCreditCard = [];
    }

    if (i == undefined) {
      this.voucherReceipt.receiptVoucherCreditCard.push(this.newVoucherReceiptCreditCardDetail);
    }
    else {
      this.voucherReceipt.receiptVoucherCreditCard.splice(i + 1, 0, this.newVoucherReceiptCreditCardDetail);
    }


    //this.itemDetailOld = this.newVoucherReceiptCreditCardDetail;
    this.newVoucherReceiptCreditCardDetail = {
      id: 0, receiptVoucherId: 0, bankAccountId: 0, currencyId: 0, amount: 0, referenceNumber: '', amountDefaultCurrency: 0, notes: '',
      bankAccount: {}, bankBranch: {},
      creditCardType: {}
    };

    //this.totalDebitCreditCalculate();
    this.calculateTotalCreditCard();
  }

  setFocusAccountNo(t: any, index: number) {
    var tbodyRows = t.childNodes[1].children.length;
    t.childNodes[1].children[tbodyRows - 1].childNodes[index].childNodes[0].focus()
  }

  setFocus(t?: any, inputElemet?: any, index?: number) {
    // Auto Focus when closing the modals

    if (index) {
      var tbodyRows = t.childNodes[1].children.length;
      var bodyElement = t.childNodes[1].children[tbodyRows - 1].childNodes[index].childNodes[0];
      bodyElement.focus();
    }

    else {
      this.utilityService.setFocus(t, inputElemet, this.itemDetailOld, this.voucherReceiptRows);
    }
    this.itemDetailOld = {
      id: 0,
      journalVoucherId: 0,
      accountId: 0,
      accountNo: '',
      currencyId: 0,
      debit: 0,
      debitDefaultCurrency: 0,
      credit: 0,
      creditDefaultCurrency: 0,
      notes: '',
      account: {},
      currency: {},
      costCenter: {}
    }
  }

  // Date Filter
  isDateFilter = false;
  isDateRefFilter = false;
  filterListByDate() {
    this.textFilterModel = '';
    this.isDateFilter = true;
  }

  onChangeDate() {
    this.isDateRefFilter = false;
  }
  onChangeDateRef() {
    this.isDateRefFilter = true;
  }


  modalSearchKeyUp() {
    this.isDateFilter = false;
    this.isDateRefFilter = false;
  }

  checkForcurrentSelectedDateYear() {
    this.isCurrentFinancialYear = true;
    var currentSelectedDateYear = (new Date(this.voucherReceipt.date)).getFullYear();
    if (currentSelectedDateYear != Number(this.currentFinancialYear)) {
      this.isCurrentFinancialYear = false;
      this.alertify.error('يجب ان يكون التاريخ ضمن السنة المالية');
    }
  }

 isCurrencyNoRequired(accountNumber: any, currency: any) {
    return (accountNumber.value && accountNumber.dirty && !currency.value) || (
      currency.dirty && currency.invalid
    )     
  }

  isAccountNoRequired(accountNumber: any, debit: any) {
    return (accountNumber.value == '' && (accountNumber.dirty))
      || (accountNumber.value == '' && ((debit.invalid || debit.dirty)));
    // || (currencyCode.invalid || currencyCode.dirty)
  }

  // UI Valiadtion When Submit
  isDetailsEmpty = false;
  Validate(myForm: NgForm) {
    this.isDetailsEmpty = false;

    if (!myForm.valid) {
      this.alertify.error('يجب ملء الحقول الالزامية');
      return false;
    }

    if (!this.isCurrentFinancialYear) {
      this.checkForcurrentSelectedDateYear();
      return false;
    }

    if (this.voucherReceipt.journalVoucherDetails == null || this.voucherReceipt.journalVoucherDetails.length < 1) {
      this.isDetailsEmpty = true;
      this.alertify.error('على الاقل ادخل بيانات واحدة فى التفاصيل !');
      return false;
    }

    var isOneDetailValid = false;
    this.voucherReceipt.journalVoucherDetails.forEach(element => {
      if (element.accountNo)
        isOneDetailValid = true;
    });

    if (!isOneDetailValid) {
      this.alertify.error('على الاقل ادخل رقم حساب واحد فى التفاصيل !');
      return false;
    }

    if (this.voucherReceipt.isCash && this.voucherReceipt.receiptVoucherCash.length == 0) {
      this.alertify.error('على الاقل ادخل نقدي واحد فى التفاصيل !');
      return false;
    }

    if (this.voucherReceipt.isCheck && this.voucherReceipt.receiptVoucherCheque.length == 0) {
      this.alertify.error('على الاقل ادخل شيك واحد فى التفاصيل !');
      return false;
    }

    if (this.voucherReceipt.isCreditCard && this.voucherReceipt.receiptVoucherCreditCard.length == 0) {
      this.alertify.error('على الاقل ادخل بطاقة ائتمان واحد فى التفاصيل !');
      return false;
    }

    this.totalReceiptCalculate();
    if (this.totalReceipt != 0) {
      this.alertify.error('يجب ان يكون مجموع النقدية و الشيكات صفر');
      return false;
    }

    return true;
  }

  addOldAccount(i: number, result: any, source?: string) {
    if (source == undefined) {
      this.voucherReceipt.journalVoucherDetails[i].accountId = result.id;
      this.voucherReceipt.journalVoucherDetails[i].accountNo = result.accountNo;
      var tempJournalVoucherDetailsAccount = this.voucherReceipt.journalVoucherDetails[i].account;
      if (tempJournalVoucherDetailsAccount) {
        tempJournalVoucherDetailsAccount.nameL1 = result.nameL1;
        tempJournalVoucherDetailsAccount.nameL2 = result.nameL2;
      }

      this.voucherReceipt.journalVoucherDetails[i].currencyId = result.currencyId;
      this.voucherReceipt.journalVoucherDetails[i].currencyExchange = result.currency?.currencyExchange;
      var tempJournalVoucherDetailsCurrency = this.voucherReceipt.journalVoucherDetails[i].currency;
      if (tempJournalVoucherDetailsCurrency) {
        tempJournalVoucherDetailsCurrency.nameL1 = result.currency?.nameL1;
        tempJournalVoucherDetailsCurrency.nameL2 = result.currency?.nameL2;
        tempJournalVoucherDetailsCurrency.code = result.currency?.code;
      }

      this.voucherReceipt.journalVoucherDetails[i].debit = (this.voucherReceipt.journalVoucherDetails[i].debitDefaultCurrency || 0) * (this.voucherReceipt.journalVoucherDetails[i].currencyExchange || 1);


      if (result.accountCostCenter.length > 0) {
        this.voucherReceipt.journalVoucherDetails[i].costCenterId = result.accountCostCenter[0].id;
        var tempJournalVoucherDetailsCostCenter = this.voucherReceipt.journalVoucherDetails[i].costCenter;
        if (tempJournalVoucherDetailsCostCenter) {
          tempJournalVoucherDetailsCostCenter.nameL1 = result.accountCostCenter[0].costCenter.nameL1;
          tempJournalVoucherDetailsCostCenter.nameL2 = result.accountCostCenter[0].costCenter.nameL2;
          tempJournalVoucherDetailsCostCenter.code = result.accountCostCenter[0].costCenter.code;
        }
      }
      else {
        this.voucherReceipt.journalVoucherDetails[i].costCenterId = undefined;
        this.voucherReceipt.journalVoucherDetails[i].costCenter = {};
      }
    }

    else if (source === 'cash') {
      if (result) {
        var tempJournalVoucherCashDetailsAccount = this.voucherReceipt.receiptVoucherCash[i].account;
        if (tempJournalVoucherCashDetailsAccount) {
          tempJournalVoucherCashDetailsAccount.id = result.id;
          tempJournalVoucherCashDetailsAccount.code = result.accountNo;
          tempJournalVoucherCashDetailsAccount.nameL1 = result.nameL1;
          tempJournalVoucherCashDetailsAccount.nameL2 = result.nameL2;
        }

        this.voucherReceipt.receiptVoucherCash[i].currencyId = result.currencyId;
        this.voucherReceipt.receiptVoucherCash[i].currencyEquivalent = result.currency?.currencyExchange;
        var tempJournalVoucherCashDetailsCurrency = this.voucherReceipt.receiptVoucherCash[i].currency;
        if (tempJournalVoucherCashDetailsCurrency) {
          tempJournalVoucherCashDetailsCurrency.nameL1 = result.currency?.nameL1;
          tempJournalVoucherCashDetailsCurrency.nameL2 = result.currency?.nameL2;
          tempJournalVoucherCashDetailsCurrency.code = result.currency?.code;
        }

        this.voucherReceipt.receiptVoucherCash[i].amount = (this.voucherReceipt.receiptVoucherCash[i].amountDefaultCurrency || 0)
          * (this.voucherReceipt.receiptVoucherCash[i].currencyEquivalent || 1);


        if (result.accountCostCenter.length > 0) {
          this.voucherReceipt.receiptVoucherCash[i].costCenterId = result.accountCostCenter[0].id;
          var tempJournalVoucherCashDetailsCostCenter = this.voucherReceipt.receiptVoucherCash[i].costCenter;
          if (tempJournalVoucherCashDetailsCostCenter) {
            tempJournalVoucherCashDetailsCostCenter.nameL1 = result.accountCostCenter[0].costCenter.nameL1;
            tempJournalVoucherCashDetailsCostCenter.nameL2 = result.accountCostCenter[0].costCenter.nameL2;
            tempJournalVoucherCashDetailsCostCenter.code = result.accountCostCenter[0].costCenter.code;
          }
        }
        else {
          this.voucherReceipt.receiptVoucherCash[i].costCenterId = undefined;
          this.voucherReceipt.receiptVoucherCash[i].costCenter = {};
        }

      }

      else {
        this.voucherReceipt.receiptVoucherCash[i].currencyId = 0;
        this.voucherReceipt.receiptVoucherCash[i].currencyEquivalent = undefined;
        this.voucherReceipt.receiptVoucherCash[i].currency = undefined;
        this.voucherReceipt.receiptVoucherCash[i].costCenterId = undefined;
        this.voucherReceipt.receiptVoucherCash[i].costCenter = {};
        this.voucherReceipt.receiptVoucherCash[i].account = {};
      }
    }

    else if (source === 'cheque') {

      this.voucherReceipt.receiptVoucherCheque[i].currencyId = result.currencyId;
      this.voucherReceipt.receiptVoucherCheque[i].currencyEquivalent = result.currency?.currencyExchange;

      if (result.accountCostCenter.length > 0) {
        this.voucherReceipt.receiptVoucherCheque[i].costCenterId = result.accountCostCenter[0].id;
        var tempJournalVoucherChequeDetailsCostCenter = this.voucherReceipt.receiptVoucherCheque[i].costCenter;
        if (tempJournalVoucherChequeDetailsCostCenter) {
          tempJournalVoucherChequeDetailsCostCenter.nameL1 = result.accountCostCenter[0].costCenter.nameL1;
          tempJournalVoucherChequeDetailsCostCenter.nameL2 = result.accountCostCenter[0].costCenter.nameL2;
          tempJournalVoucherChequeDetailsCostCenter.code = result.accountCostCenter[0].costCenter.code;
        }
      }
      else {
        this.voucherReceipt.receiptVoucherCheque[i].costCenterId = undefined;
        this.voucherReceipt.receiptVoucherCheque[i].costCenter = {};
      }


    }
    else if (source === 'creditcard') {
      this.voucherReceipt.receiptVoucherCreditCard[i].currencyId = result.currencyId;
      this.voucherReceipt.receiptVoucherCreditCard[i].currencyEquivalent = result.currency?.currencyExchange;
    }
  }

  addNewAccount(result: any, source?: string) {
    if (source == undefined) {
      this.newVoucherReceiptDetail.accountId = result.id;
      this.newVoucherReceiptDetail.accountNo = result.accountNo;

      if (this.newVoucherReceiptDetail.account) {
        this.newVoucherReceiptDetail.account.nameL1 = result.nameL1;
        this.newVoucherReceiptDetail.account.nameL2 = result.nameL2;
      }

      this.newVoucherReceiptDetail.currencyId = result.currencyId;
      this.newVoucherReceiptDetail.currencyExchange = result.currency?.currencyExchange;

      if (this.newVoucherReceiptDetail.currency) {
        this.newVoucherReceiptDetail.currency.nameL1 = result.currency?.nameL1;
        this.newVoucherReceiptDetail.currency.nameL2 = result.currency?.nameL2;
      }
      if (result.accountCostCenter.length > 0) {
        this.newVoucherReceiptDetail.costCenterId = result.accountCostCenter[0].id;
        if (this.newVoucherReceiptDetail.costCenter) {
          this.newVoucherReceiptDetail.costCenter.nameL1 = result.accountCostCenter[0].costCenter.nameL1;
          this.newVoucherReceiptDetail.costCenter.nameL2 = result.accountCostCenter[0].costCenter.nameL2;
          this.newVoucherReceiptDetail.costCenter.code = result.accountCostCenter[0].costCenter.code;
        }
      }
      this.addItemDetail();
    }
    else if (source === 'cash') {
      if (result) {
        if (this.newVoucherReceiptCashDetail.account) {
          this.newVoucherReceiptCashDetail.account.accountId = result.id;
          this.newVoucherReceiptCashDetail.account.code = result.accountNo;
          this.newVoucherReceiptCashDetail.account.nameL1 = result.nameL1;
          this.newVoucherReceiptCashDetail.account.nameL2 = result.nameL2;
        }

        this.newVoucherReceiptCashDetail.currencyId = result.currencyId;
        this.newVoucherReceiptCashDetail.currencyEquivalent = result.currency?.currencyExchange;

        if (this.newVoucherReceiptCashDetail.currency) {
          this.newVoucherReceiptCashDetail.currency.nameL1 = result.currency?.nameL1;
          this.newVoucherReceiptCashDetail.currency.nameL2 = result.currency?.nameL2;
          this.newVoucherReceiptCashDetail.currency.code = result.currency?.code;
        }
        if (result.accountCostCenter.length > 0) {
          this.newVoucherReceiptCashDetail.costCenterId = result.accountCostCenter[0].id;
          if (this.newVoucherReceiptCashDetail.costCenter) {
            this.newVoucherReceiptCashDetail.costCenter.nameL1 = result.accountCostCenter[0].costCenter.nameL1;
            this.newVoucherReceiptCashDetail.costCenter.nameL2 = result.accountCostCenter[0].costCenter.nameL2;
            this.newVoucherReceiptCashDetail.costCenter.code = result.accountCostCenter[0].costCenter.code;
          }
        }
      }
      this.addItemCashDetail();
    }

    else if (source === 'cheque') {

      this.newVoucherReceiptChequeDetail.currencyId = result.currencyId;
      this.newVoucherReceiptChequeDetail.currencyEquivalent = result.currency?.currencyExchange;

      if (result.accountCostCenter.length > 0) {
        this.newVoucherReceiptChequeDetail.costCenterId = result.accountCostCenter[0].id;
        if (this.newVoucherReceiptChequeDetail.costCenter) {
          this.newVoucherReceiptChequeDetail.costCenter.nameL1 = result.accountCostCenter[0].costCenter.nameL1;
          this.newVoucherReceiptChequeDetail.costCenter.nameL2 = result.accountCostCenter[0].costCenter.nameL2;
          this.newVoucherReceiptChequeDetail.costCenter.code = result.accountCostCenter[0].costCenter.code;
        }
      }
      this.addItemChequeDetail();
    }

    else if (source === 'creditcard') {
      this.newVoucherReceiptCreditCardDetail.currencyId = result.currencyId;
      this.newVoucherReceiptCreditCardDetail.currencyEquivalent = result.currency?.currencyExchange;
      this.addItemCreditCardDetail();
    }
  }

  accountIndex: number = -1;
  addAccountItemById(id: number, source?: string) {

    this.accountService.accountGetById(id).subscribe(result => {
      if (this.accountIndex != -1) {
        this.addOldAccount(this.accountIndex, result, source);
      }
      else {
        this.addNewAccount(result, source);

        //Focus on debit of index 4
        // var t = this.detailsTable.nativeElement;
        // setTimeout(() => { this.setFocusAccountNo(t, 4); }, 0);

      }
      this.accountIndex = -1;
    });

  }

  addAccountItemByAccountNo(accountNo: string, i?: number) {

    this.accountService.accountGetByAccountNo(accountNo).subscribe(result => {
      if (result) {
        if (i !== undefined) {
          this.addOldAccount(i, result);

        }

        else {
          this.addNewAccount(result);
          this.addItemDetail();

          //Focus on debit of index 4
          var t = this.detailsTable.nativeElement;
          setTimeout(() => { this.setFocusAccountNo(t, 4); }, 0);

        }
      }
      else if (i !== undefined) {
        this.voucherReceipt.journalVoucherDetails[i].accountNo = '';
        this.voucherReceipt.journalVoucherDetails[i].account = {};
        this.voucherReceipt.journalVoucherDetails[i].currencyExchange = undefined;
        this.voucherReceipt.journalVoucherDetails[i].currency = {};
        this.voucherReceipt.journalVoucherDetails[i].costCenter = {};
      }
      else {
        this.newVoucherReceiptDetail.accountNo = '';
      }

    });


  }






  // <----- modal ----->
  displayStyle = "none";
  openPopup(): void {
    this.displayStyle = "block";
    this.textFilterModel = '';
    this.dateFromFilterModel = new Date();
    this.dateToFilterModel = new Date();
    this.dateReferenceFilterModel = new Date();
    this.isDateFilter = false;
    this.isDateRefFilter = false;
  }

  closePopup(): void {
    this.displayStyle = "none";
  }

  // <----- Account modal ----->
  displayAccountStyle = "none";
  AccountOpenPopup(i?: number): void {

    this.displayAccountStyle = "block";
    if (i != undefined)
      this.accountIndex = i;

  }

  AccountClosePopup(): void {
    this.displayAccountStyle = "none";
  }

  // <----- Cost Center modal ----->
  displayCostCenterStyle = "none";
  costCenterIndex: number = -1;
  addCostCenterItem(item: any, source?: string) {
    if (source == undefined || source == '')
      if (this.costCenterIndex != -1) {
        this.voucherReceipt.journalVoucherDetails[this.costCenterIndex].costCenterId = item.id;
        var tempJournalVoucherDetailsCostCenter = this.voucherReceipt.journalVoucherDetails[this.costCenterIndex].costCenter;
        if (tempJournalVoucherDetailsCostCenter) {
          tempJournalVoucherDetailsCostCenter.nameL1 = item.nameL1;
          tempJournalVoucherDetailsCostCenter.nameL2 = item.nameL2;
          tempJournalVoucherDetailsCostCenter.code = item.code;
        }

      }
      else {
        this.newVoucherReceiptDetail.costCenterId = item.id;
        if (this.newVoucherReceiptDetail.costCenter) {
          this.newVoucherReceiptDetail.costCenter.nameL1 = item.nameL1;
          this.newVoucherReceiptDetail.costCenter.nameL2 = item.nameL2;
          this.newVoucherReceiptDetail.costCenter.code = item.code;
        }
      }
    else if (this.secondarySource == 'cash') {

      if (this.costCenterIndex != -1) {
        this.voucherReceipt.receiptVoucherCash[this.costCenterIndex].costCenterId = item.id;
        var tempJournalVoucherDetailsCashCostCenter = this.voucherReceipt.receiptVoucherCash[this.costCenterIndex].costCenter;
        if (tempJournalVoucherDetailsCashCostCenter) {
          tempJournalVoucherDetailsCashCostCenter.nameL1 = item.nameL1;
          tempJournalVoucherDetailsCashCostCenter.nameL2 = item.nameL2;
          tempJournalVoucherDetailsCashCostCenter.code = item.code;
        }

      }
      else {
        this.newVoucherReceiptCashDetail.costCenterId = item.id;
        if (this.newVoucherReceiptCashDetail.costCenter) {
          this.newVoucherReceiptCashDetail.costCenter.nameL1 = item.nameL1;
          this.newVoucherReceiptCashDetail.costCenter.nameL2 = item.nameL2;
          this.newVoucherReceiptCashDetail.costCenter.code = item.code;
        }
      }
    }
    else if (this.secondarySource == 'cheque') {
      if (this.costCenterIndex != -1) {
        this.voucherReceipt.receiptVoucherCheque[this.costCenterIndex].costCenterId = item.id;
        var tempJournalVoucherDetailsChequeCostCenter = this.voucherReceipt.receiptVoucherCheque[this.costCenterIndex].costCenter;
        if (tempJournalVoucherDetailsChequeCostCenter) {
          tempJournalVoucherDetailsChequeCostCenter.nameL1 = item.nameL1;
          tempJournalVoucherDetailsChequeCostCenter.nameL2 = item.nameL2;
          tempJournalVoucherDetailsChequeCostCenter.code = item.code;
        }

      }
      else {
        this.newVoucherReceiptChequeDetail.costCenterId = item.id;
        if (this.newVoucherReceiptChequeDetail.costCenter) {
          this.newVoucherReceiptChequeDetail.costCenter.nameL1 = item.nameL1;
          this.newVoucherReceiptChequeDetail.costCenter.nameL2 = item.nameL2;
          this.newVoucherReceiptChequeDetail.costCenter.code = item.code;
        }


      }

    }

    this.costCenterIndex = -1;
    this.secondarySource = '';

  }

  costCenterGetByAccountId(accountId: number) {
    this.costCenterService.costCenterGetByAccountId(accountId).subscribe(result => {
      this.costCenterList = result;
      if (this.costCenterList.length > 0)
        this.displayCostCenterStyle = "block";
      else
        this.alertify.error('لا يوجد مركز تكاليف لهذا الحساب');
    });
  }

  CostCenterOpenPopup(accountId: number, i?: number, source?: string): void {
    if (accountId && accountId != 0)
      this.costCenterGetByAccountId(accountId);
    else
      this.alertify.error('اختر حساب اولا');

    if (i != undefined)
      this.costCenterIndex = i;
    if (source != undefined && source != '')
      this.secondarySource = source;
  }


  CostCenterClosePopup(): void {
    this.displayCostCenterStyle = "none";
  }


  // <----- Transaction Source modal ----->

  displayTransactionSourceStyle = "none";
  addTransactionSourceItem(item: any) {
    this.voucherReceipt.sourceTypeId = item.id;
    this.voucherReceipt.sourceTypeName = item.nameL1;
  }

  emptyTransactionSourceItem() {
    this.voucherReceipt.sourceTypeId = undefined;
    this.voucherReceipt.sourceTypeName = undefined;
  }

  TransactionSourceOpenPopup(): void {
    this.displayTransactionSourceStyle = "block";
  }


  TransactionSourceClosePopup(): void {
    this.displayTransactionSourceStyle = "none";
  }

  transactionSourceGetById(id?: number) {
    if (id != undefined && id > 0 && Number.isInteger(id)) {
      this.transactionSourceService.transactionSourceGetById(id).subscribe(result => {
        if (result) {
          this.addTransactionSourceItem(result);
        }
        else {
          this.alertify.error('لا يوجد رمز قيد لهذا الرقم');
          this.emptyTransactionSourceItem();
        }
      });
    }
    else {
      this.emptyTransactionSourceItem();
    }
  }

  // <----- Customer modal ----->

  displayCustomerStyle = "none";
  isCustomer = true;
  addCustomerItem(item: any) {
    if (this.isCustomer) {
      this.voucherReceipt.customerVendorId = item.id;
      this.voucherReceipt.customerVendorCode = item.code;
      this.voucherReceipt.customerVendorName = item.nameL1;
    }
    else {

      this.voucherReceipt.salesId = item.id;
      this.voucherReceipt.salesCode = item.code;
      this.voucherReceipt.salesName = item.nameL1;
    }

  }

  emptyCustomerItem() {
    if (this.isCustomer) {
      this.voucherReceipt.customerVendorId = undefined;
      this.voucherReceipt.customerVendorCode = undefined;
      this.voucherReceipt.customerVendorName = undefined;
    }
    else {

      this.voucherReceipt.salesId = undefined;
      this.voucherReceipt.salesCode = undefined;
      this.voucherReceipt.salesName = undefined;
    }
  }

  CustomerOpenPopup(): void {
    this.displayCustomerStyle = "block";
    if (this.isCustomer)
      this.customersList = this.customerCustomersList;
    else
      this.customersList = this.customerSalesList;
  }

  CustomerClosePopup(): void {
    this.displayCustomerStyle = "none";
  }

  customerGetByCode(code: string) {
    if (code != undefined && code && Number.isInteger(Number(code))) {
      this.customerService.customerGetByCode(this.isCustomer, Number(code)).subscribe(result => {
        if (result) {

          this.addCustomerItem(result);
        }
        else {
          var errorMsg = this.isCustomer ? 'لا يوجد مندوبين لهذا الرقم' : 'لا يوجد عملاء لهذا الرقم';
          this.alertify.error(errorMsg);
          this.emptyCustomerItem();
        }

      });
    } else {
      this.emptyCustomerItem();
    }
  }

  // <----- Currency modal ----->
  secondarySource = '';
  displayCurrencyStyle = "none";
  currencyIndex: number = -1;
  addCurrencyItem(item: any, source?: string) {
    if (source == undefined || source == '') {
      if (this.currencyIndex != -1) {
        var journalVoucherDetailsCurrencyTemp = this.voucherReceipt.journalVoucherDetails[this.currencyIndex].currency;
        this.voucherReceipt.journalVoucherDetails[this.currencyIndex].currencyId = item.id;
        this.voucherReceipt.journalVoucherDetails[this.currencyIndex].currencyExchange = item.currencyExchange;

        this.voucherReceipt.journalVoucherDetails[this.currencyIndex].debit =
          (this.voucherReceipt.journalVoucherDetails[this.currencyIndex].debitDefaultCurrency || 0) * (item.currencyExchange || 1);

        if (journalVoucherDetailsCurrencyTemp) {
          journalVoucherDetailsCurrencyTemp.nameL1 = item.nameL1;
          journalVoucherDetailsCurrencyTemp.nameL2 = item.nameL2;
          journalVoucherDetailsCurrencyTemp.code = item.code;
        }
      } else {
        this.newVoucherReceiptDetail.currencyId = item.id;
        if (this.newVoucherReceiptDetail.currency) {
          this.newVoucherReceiptDetail.currency.nameL1 = item.nameL1;
          this.newVoucherReceiptDetail.currency.nameL2 = item.nameL2;
          this.newVoucherReceiptDetail.currency.code = item.code;
          this.newVoucherReceiptDetail.currencyExchange = item.currencyExchange;
          this.addItemDetail();
        }
      }
    } else if (source == 'cash') {

      if (this.currencyIndex != -1) {
        var journalVoucherCashDetailsCurrencyTemp = this.voucherReceipt.receiptVoucherCash[this.currencyIndex].currency;
        this.voucherReceipt.receiptVoucherCash[this.currencyIndex].currencyId = item.id;
        this.voucherReceipt.receiptVoucherCash[this.currencyIndex].currencyEquivalent = item.currencyExchange;

        this.voucherReceipt.receiptVoucherCash[this.currencyIndex].amount =
          (this.voucherReceipt.receiptVoucherCash[this.currencyIndex].amountDefaultCurrency || 0) * (item.currencyExchange || 1);

        if (journalVoucherCashDetailsCurrencyTemp) {
          journalVoucherCashDetailsCurrencyTemp.nameL1 = item.nameL1;
          journalVoucherCashDetailsCurrencyTemp.nameL2 = item.nameL2;
          journalVoucherCashDetailsCurrencyTemp.code = item.code;
        }
      } else {
        this.newVoucherReceiptCashDetail.currencyId = item.id;
        this.newVoucherReceiptCashDetail.currencyEquivalent = item.currencyExchange;
        if (this.newVoucherReceiptCashDetail.currency) {
          this.newVoucherReceiptCashDetail.currency.nameL1 = item.nameL1;
          this.newVoucherReceiptCashDetail.currency.nameL2 = item.nameL2;
          this.newVoucherReceiptCashDetail.currency.code = item.code;

          this.addItemCashDetail();
        }
      }

    }
    this.secondarySource = '';
    this.currencyIndex = -1;
  }

  emptyCurrencyItem(source?: string) {
    if (source == undefined || source == '') {
      if (this.currencyIndex != -1) {
        this.voucherReceipt.journalVoucherDetails[this.currencyIndex].currencyId = 0;
        this.voucherReceipt.journalVoucherDetails[this.currencyIndex].currencyExchange = undefined;
        this.voucherReceipt.journalVoucherDetails[this.currencyIndex].debit = undefined;
        this.voucherReceipt.journalVoucherDetails[this.currencyIndex].currency = {};
      } else {
        this.newVoucherReceiptDetail.currencyId = 0;
        this.newVoucherReceiptDetail.currencyExchange = undefined;
        this.newVoucherReceiptDetail.currency = {};
      }
    }
    else if (source == 'cash') {
      if (this.currencyIndex != -1) {
        this.voucherReceipt.receiptVoucherCash[this.currencyIndex].currencyId = 0;
        this.voucherReceipt.receiptVoucherCash[this.currencyIndex].currencyEquivalent = undefined;
        this.voucherReceipt.receiptVoucherCash[this.currencyIndex].amount = 0;
        this.voucherReceipt.receiptVoucherCash[this.currencyIndex].currency = {};
      } else {
        this.newVoucherReceiptCashDetail.currencyId = 0;
        this.newVoucherReceiptCashDetail.currencyEquivalent = undefined;
        this.newVoucherReceiptCashDetail.currency = {};

      }
    }
  }

  CurrencyOpenPopup(i?: number, source?: string): void {
    this.displayCurrencyStyle = "block";
    if (i != undefined)
      this.currencyIndex = i;
    if (source != undefined && source != '')
      this.secondarySource = source;
  }

  CurrencyClosePopup(): void {
    this.displayCurrencyStyle = "none";
  }

  currencyGetByCode(code?: string, i?: number, source?: string) {
    this.currencyIndex = (i != undefined) ? i : -1;

    if (code != undefined && code && Number.isInteger(Number(code))) {
      this.currencyService.currencyGetByCode(Number(code)).subscribe(result => {
        if (result) {
          this.addCurrencyItem(result, source);
        }
        else {
          this.alertify.error('لا يوجد عملات  لهذا الرقم');
          this.emptyCurrencyItem(source);
        }
      });
    }
    else {
      this.emptyCurrencyItem(source);
    }
  }

  // <----- Box modal ----->

  displayBoxStyle = "none";
  boxIndex = -1;
  addBoxItem(item: any) {
    this.accountIndex = this.boxIndex;
    if (this.boxIndex != -1) {
      var temp = this.voucherReceipt.receiptVoucherCash[this.boxIndex].box;
      this.voucherReceipt.receiptVoucherCash[this.boxIndex].boxId = item.id;

      if (temp) {
        temp.nameL1 = item.nameL1;
        temp.nameL2 = item.nameL2;
        temp.code = item.code;
        temp.accountId = item.boxDetails[0] ? item.boxDetails[0].accountId : undefined;
        if (temp.accountId)
          this.addAccountItemById(temp.accountId, 'cash');
      }
    } else {

      this.newVoucherReceiptCashDetail.boxId = item.id;

      if (this.newVoucherReceiptCashDetail.box) {
        this.newVoucherReceiptCashDetail.box.nameL1 = item.nameL1;
        this.newVoucherReceiptCashDetail.box.nameL2 = item.nameL2;
        this.newVoucherReceiptCashDetail.box.code = item.code;
        this.newVoucherReceiptCashDetail.box.accountId = item.boxDetails[0] ? item.boxDetails[0].accountId : undefined;
        if (this.newVoucherReceiptCashDetail.box.accountId)
          this.addAccountItemById(this.newVoucherReceiptCashDetail.box.accountId, 'cash');
        else {
          this.addItemCashDetail();
        }

      }
    }

    this.boxIndex = -1;

  }

  emptyBoxItem() {
    if (this.boxIndex != -1) {
      this.voucherReceipt.receiptVoucherCash[this.boxIndex].boxId = 0;
      this.voucherReceipt.receiptVoucherCash[this.boxIndex].box = {};
      this.voucherReceipt.receiptVoucherCash[this.boxIndex].costCenter = {};
      this.voucherReceipt.receiptVoucherCash[this.boxIndex].currency = {};
      this.voucherReceipt.receiptVoucherCash[this.boxIndex].account = {};
    } else {
      this.newVoucherReceiptCashDetail.boxId = 0;
      this.newVoucherReceiptCashDetail.box = {};
      this.newVoucherReceiptCashDetail.costCenter = {};
      this.newVoucherReceiptCashDetail.currency = {};
      this.newVoucherReceiptCashDetail.account = {};
    }

  }

  BoxOpenPopup(i?: number): void {
    if (i != undefined)
      this.boxIndex = i;
    this.displayBoxStyle = "block";
  }

  BoxClosePopup(): void {
    this.displayBoxStyle = "none";
  }


  boxGetByCode(code?: string, i?: number) {
    this.boxIndex = (i != undefined) ? i : -1;

    if (code != undefined && code && Number.isInteger(Number(code))) {
      this.boxService.boxGetByCode(Number(code)).subscribe(result => {
        if (result) {
          this.addBoxItem(result);
        }
        else {
          this.alertify.error('لا يوجد صندوق  لهذا الرقم');
          this.emptyBoxItem();
        }
      });
    }
    else {
      this.emptyBoxItem();
    }
  }

  // <----- Bank modal ----->

  displayBankStyle = "none";
  bankIndex = -1;
  addBankItem(item: any, source?: string) {
    this.accountIndex = this.bankIndex;
    if (source == 'cheque') {
      if (this.bankIndex != -1) {

        var temp = this.voucherReceipt.receiptVoucherCheque[this.bankIndex].bankAccount;
        var tempBranch = this.voucherReceipt.receiptVoucherCheque[this.bankIndex].bankBranch;
        if (item.bankAccount && item.bankAccount.length > 0)
          this.voucherReceipt.receiptVoucherCheque[this.bankIndex].bankAccountId = item.bankAccount[0].id;

        if (temp) {
          temp.nameL1 = item.nameL1;
          temp.nameL2 = item.nameL2;
          temp.code = item.code;
          temp.accountId = item.bankAccount && item.bankAccount.length > 0 ? item.bankAccount[0].accountId : 0;
          if (temp.accountId)
            this.addAccountItemById(temp.accountId, 'cheque');
          else {
            this.voucherReceipt.receiptVoucherCheque[this.bankIndex].costCenterId = undefined;
            this.voucherReceipt.receiptVoucherCheque[this.bankIndex].costCenter = {};
          }
        }
        if (tempBranch && item.bankAccount && item.bankAccount.length > 0) {
          this.bankBranchList = item.bankAccount;
          tempBranch.nameL1 = item.bankAccount[0].nameL1;
          tempBranch.nameL2 = item.bankAccount[0].nameL2;
          tempBranch.code = item.bankAccount[0].code;
          tempBranch.id = item.bankAccount[0].id;

        }
        else {
          this.voucherReceipt.receiptVoucherCheque[this.bankIndex].bankBranch = {};
        }

      }
      else {

        if (item.bankAccount && item.bankAccount.length > 0)
          this.newVoucherReceiptChequeDetail.bankAccountId = item.bankAccount[0].id;

        if (this.newVoucherReceiptChequeDetail.bankAccount) {
          this.newVoucherReceiptChequeDetail.bankAccount.nameL1 = item.nameL1;
          this.newVoucherReceiptChequeDetail.bankAccount.nameL2 = item.nameL2;
          this.newVoucherReceiptChequeDetail.bankAccount.code = item.code;

          this.newVoucherReceiptChequeDetail.bankAccount.accountId = item.bankAccount && item.bankAccount.length > 0 ? item.bankAccount[0].accountId : 0;
          if (this.newVoucherReceiptChequeDetail.bankAccount.accountId)
            this.addAccountItemById(this.newVoucherReceiptChequeDetail.bankAccount.accountId, 'cheque');
          else {
            this.newVoucherReceiptChequeDetail.costCenterId = undefined;
            this.newVoucherReceiptChequeDetail.costCenter = {};
            this.addItemChequeDetail();
          }

        }

        if (item.bankAccount && item.bankAccount.length > 0) {
          this.bankBranchList = item.bankAccount;
          if (this.newVoucherReceiptChequeDetail.bankBranch) {
            this.newVoucherReceiptChequeDetail.bankBranch.nameL1 = item.bankAccount[0].nameL1;
            this.newVoucherReceiptChequeDetail.bankBranch.nameL2 = item.bankAccount[0].nameL2;
            this.newVoucherReceiptChequeDetail.bankBranch.code = item.bankAccount[0].code;
            this.newVoucherReceiptChequeDetail.bankBranch.id = item.bankAccount[0].id;
          }
        }
        else {
          this.newVoucherReceiptChequeDetail.bankBranch = {};
        }

      }
    }
    else if (source = 'creditcard') {

      if (this.bankIndex != -1) {
        var temp = this.voucherReceipt.receiptVoucherCreditCard[this.bankIndex].bankAccount;
        var tempBranch = this.voucherReceipt.receiptVoucherCreditCard[this.bankIndex].bankBranch;
        if (item.bankAccount && item.bankAccount.length > 0)
          this.voucherReceipt.receiptVoucherCreditCard[this.bankIndex].bankAccountId = item.bankAccount[0].id;

        if (temp) {
          temp.nameL1 = item.nameL1;
          temp.nameL2 = item.nameL2;
          temp.code = item.code;
          temp.accountId = item.bankAccount && item.bankAccount.length > 0 ? item.bankAccount[0].accountId : 0;
          if (temp.accountId)
            this.addAccountItemById(temp.accountId, 'creditcard');
        }
        if (tempBranch && item.bankAccount && item.bankAccount.length > 0) {
          this.bankBranchList = item.bankAccount;
          tempBranch.nameL1 = item.bankAccount[0].nameL1;
          tempBranch.nameL2 = item.bankAccount[0].nameL2;
          tempBranch.code = item.bankAccount[0].code;
          tempBranch.id = item.bankAccount[0].id;
        }
        else {
          this.voucherReceipt.receiptVoucherCreditCard[this.bankIndex].bankBranch = {};
        }

      }
      else {

        if (item.bankAccount && item.bankAccount.length > 0)
          this.newVoucherReceiptCreditCardDetail.bankAccountId = item.bankAccount[0].id;

        if (this.newVoucherReceiptCreditCardDetail.bankAccount) {
          this.newVoucherReceiptCreditCardDetail.bankAccount.nameL1 = item.nameL1;
          this.newVoucherReceiptCreditCardDetail.bankAccount.nameL2 = item.nameL2;
          this.newVoucherReceiptCreditCardDetail.bankAccount.code = item.code;
          if (item.bankAccount && item.bankAccount.length > 0)
            this.newVoucherReceiptCreditCardDetail.bankAccount.accountId = item.bankAccount[0].accountId;
          if (this.newVoucherReceiptCreditCardDetail.bankAccount.accountId)
            this.addAccountItemById(this.newVoucherReceiptCreditCardDetail.bankAccount.accountId, 'creditcard');
          else
            this.addItemCreditCardDetail();

        }

        if (this.newVoucherReceiptCreditCardDetail.bankBranch &&
          item.bankAccount && item.bankAccount.length > 0) {
          this.bankBranchList = item.bankAccount;
          this.newVoucherReceiptCreditCardDetail.bankBranch.nameL1 = item.bankAccount[0].nameL1;
          this.newVoucherReceiptCreditCardDetail.bankBranch.nameL2 = item.bankAccount[0].nameL2;
          this.newVoucherReceiptCreditCardDetail.bankBranch.code = item.bankAccount[0].code;
          this.newVoucherReceiptCreditCardDetail.bankBranch.id = item.bankAccount[0].id;

        }
        else {
          this.newVoucherReceiptCreditCardDetail.bankBranch = {};
        }
      }

    }

    this.bankIndex = -1;
  }

  emptyBankItem(source?: string) {
    if (this.bankIndex != -1) {
      this.voucherReceipt.receiptVoucherCheque[this.bankIndex].bankAccountId = 0;
      this.voucherReceipt.receiptVoucherCheque[this.bankIndex].currencyId = 0;
      this.voucherReceipt.receiptVoucherCheque[this.bankIndex].bankAccount = {};
      this.voucherReceipt.receiptVoucherCheque[this.bankIndex].costCenter = {};
    }
    else {

      this.newVoucherReceiptChequeDetail.bankAccountId = 0;
      this.newVoucherReceiptChequeDetail.currencyId = 0;
      this.newVoucherReceiptChequeDetail.bankAccount = {};
      this.newVoucherReceiptChequeDetail.costCenter = {};

    }
  }

  BankOpenPopup(i?: number, source?: string): void {
    if (i != undefined)
      this.bankIndex = i;
    if (source != undefined && source != '')
      this.secondarySource = source;
    this.displayBankStyle = "block";
  }

  BankClosePopup(): void {
    this.displayBankStyle = "none";
  }

  bankGetByCode(code?: string, i?: number, source?: string) {
    this.bankIndex = (i != undefined) ? i : -1;
    if (code != undefined && code && Number.isInteger(Number(code))) {
      this.bankService.bankGetByCode(Number(code)).subscribe(result => {
        if (result) {
          this.addBankItem(result, source);;
        }
        else {
          this.alertify.error('لا يوجد بنك  لهذا الرقم');
          this.emptyBankItem();
        }
      });
    }
    else {
      this.emptyBankItem();
    }
  }


  // <----- Bank Branch modal ----->

  displayBankBranchStyle = "none";
  bankBranchIndex = -1;
  addBankBranchItem(item: any, source?: string) {

    this.accountIndex = this.bankBranchIndex;
    if (source == 'cheque') {
      if (this.bankBranchIndex != -1) {

        this.voucherReceipt.receiptVoucherCheque[this.bankBranchIndex].bankAccountId = item.id;
        var temp = this.voucherReceipt.receiptVoucherCheque[this.bankBranchIndex].bankBranch;
        if (temp) {
          temp.nameL1 = item.nameL1;
          temp.nameL2 = item.nameL2;
          temp.code = item.code;
        }
      }
      else {
        this.newVoucherReceiptChequeDetail.bankAccountId = item.id;
        if (this.newVoucherReceiptChequeDetail.bankAccount) {
          this.newVoucherReceiptChequeDetail.bankAccount.nameL1 = item.nameL1;
          this.newVoucherReceiptChequeDetail.bankAccount.nameL2 = item.nameL2;
          this.newVoucherReceiptChequeDetail.bankAccount.code = item.code;
        }
      }
    }
    else if (source = 'creditcard') {
      if (this.bankBranchIndex != -1) {
        this.voucherReceipt.receiptVoucherCreditCard[this.bankBranchIndex].bankAccountId = item.id;
        var temp = this.voucherReceipt.receiptVoucherCreditCard[this.bankBranchIndex].bankBranch;
        if (temp) {
          temp.nameL1 = item.nameL1;
          temp.nameL2 = item.nameL2;
          temp.code = item.code;
        }
      }
      else {
        this.newVoucherReceiptCreditCardDetail.bankAccountId = item.id;

        if (this.newVoucherReceiptCreditCardDetail.bankAccount) {
          this.newVoucherReceiptCreditCardDetail.bankAccount.nameL1 = item.nameL1;
          this.newVoucherReceiptCreditCardDetail.bankAccount.nameL2 = item.nameL2;
          this.newVoucherReceiptCreditCardDetail.bankAccount.code = item.code;
        }
      }
    }

    this.bankBranchIndex = -1;
  }

  emptyBankBranchItem(source?: string) {
    if (this.bankBranchIndex != -1) {
      this.voucherReceipt.receiptVoucherCheque[this.bankIndex].bankBranch = {}
    }
    else {
      this.newVoucherReceiptChequeDetail.bankBranch = {};
    }
  }

  bankBranchGetByBankCode(code: string) {
    this.bankService.bankGetByCode(Number(code)).subscribe(result => {
      this.bankBranchList = result.bankAccount || [];

      if (this.bankBranchList.length > 0)
        this.displayBankBranchStyle = "block";
      else
        this.alertify.error('لا يوجد فرع لهذا البنك');
    });
  }

  BankBranchOpenPopup(bank?: NameCommon, i?: number, source?: string): void {
    this.bankBranchList = [];

    if (bank && bank.code)
      this.bankBranchGetByBankCode(bank.code);
    else
      this.alertify.error('اختر بنك اولا');

    if (i != undefined)
      this.bankBranchIndex = i;
    if (source != undefined && source != '')
      this.secondarySource = source;
    if (this.bankBranchList && this.bankBranchList.length > 0)
      this.displayBankBranchStyle = "block";
  }

  BankBranchClosePopup(): void {
    this.displayBankBranchStyle = "none";
  }


  // <----- EPayment modal ----->

  displayEPaymentStyle = "none";
  ePaymentIndex = -1;
  addEPaymentItem(item: any) {
    if (this.ePaymentIndex != -1) {
      this.voucherReceipt.receiptVoucherCreditCard[this.ePaymentIndex].creditCardTypeId = item.id;
      this.voucherReceipt.receiptVoucherCreditCard[this.ePaymentIndex].creditCardType = item;
    } else {
      this.newVoucherReceiptCreditCardDetail.creditCardTypeId = item.id;
      this.newVoucherReceiptCreditCardDetail.creditCardType = item;
      this.addItemCreditCardDetail();
    }
  }

  emptyEPaymentItem() {
    if (this.ePaymentIndex != -1) {
      this.voucherReceipt.receiptVoucherCreditCard[this.ePaymentIndex].creditCardTypeId = undefined;
      this.voucherReceipt.receiptVoucherCreditCard[this.ePaymentIndex].creditCardType = {}
    }
    else {
      this.newVoucherReceiptCreditCardDetail.creditCardTypeId = undefined;
      this.newVoucherReceiptCreditCardDetail.creditCardType = {};
    }
    this.ePaymentIndex = -1;
  }

  EPaymentOpenPopup(i?: number): void {
    if (i != undefined)
      this.ePaymentIndex = i;
    this.displayEPaymentStyle = "block";
  }

  EPaymentClosePopup(): void {
    this.displayEPaymentStyle = "none";
  }



  printReportJV(id: any) {
    var url = Constants.ApiUrl + '/api/JournalVoucher/JournalReport/' + id
    window.open(url, "_blank");
  }
  //checkbox
  masterSelected: boolean = false;
  checkedList: any;

  public index = 0;
  GetFirst() {
    this.index = 0;
    this.voucherReceiptGetById(this.checkedList[this.index])
  }
  GetLast() {
    this.index = (this.checkedList.length) - 1
    this.voucherReceiptGetById(this.checkedList[this.index])

  }
  GetNextIndex() {
    if (this.index <= this.checkedList.length) {
      // Call Function Display Data
      ++this.index;
    }
    this.voucherReceiptGetById(this.checkedList[this.index])
  }
  GetPrevIndex() {
    if (this.index > 0) {
      // Call Function Display Data
      --this.index;
    }
    this.voucherReceiptGetById(this.checkedList[this.index])
  }


  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (var i = 0; i < this.voucherReceiptList.length; i++) {
      this.voucherReceiptList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.voucherReceiptList.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.voucherReceiptList.length; i++) {
      if (this.voucherReceiptList[i].isSelected)
        this.checkedList.push(this.voucherReceiptList[i].id);
    }

  }

}
