import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InvoiceCashDetailsDto } from '../Dto/InvoiceCashDetailsDto';
import { InvoiceDtlDto } from '../Dto/InvoiceDtlDto';
import { InvoiceDto } from '../Dto/InvoiceDto';
import { Account } from '../interfaces/account.interface';
import { CostCenter } from '../interfaces/costcenter.interface';
import {
  Invoice,
  InvoiceCashDetails,
  InvoiceDtl,
} from '../interfaces/Invoice.interface';
import { LookupDetails } from '../interfaces/lookup.interface';
import { NameCommon } from '../interfaces/namecommon.interface';
import { AccountService } from '../services/account.service';
import { AlertifyService } from '../services/alertify.service';
import { Constants } from '../services/constants';
import { CostCenterService } from '../services/costcenter.service';
import { CustomerService } from '../services/customer.service';
import { InvoiceService } from '../services/invoice.service';
import { ItemService } from '../services/item.service';
import { LookupService } from '../services/lookup.service';
import { UtilityService } from '../services/utility.service';
@Component({
  selector: 'app-invoice-order',
  templateUrl: './invoice-order.component.html',
  styleUrls: ['./invoice-order.component.css'],
})
export class InvoiceOrderComponent {
  //#region declare properities
  //1:امر صرف   //2:امر توريد
  accountIndex:number = -1;
  public costCenterList:CostCenter[] = [];
  total=0;
  invoice: Invoice = new InvoiceDto();
  isCustomer = false;
  Page: number = 0;
  pageName: string = 'امر توريد مخزني';
  myForm: any;
  displaystoreStyle = 'none';
  storeList: any;
  textFilterModel!: string;
  dateFromFilterModel!: Date;
  dateToFilterModel!: Date;
  dateReferenceFilterModel!: Date;
  customerSalesList: NameCommon[] = [];
  displayCustomerStyle = 'none';
  accountList: Account[] = [];
  itemList: any;
  UnitList: NameCommon[] = [];
  totalCash = 0;
  totalCashItem = 0;
  invoiceList: any[] = [];
  invoiceDtl: InvoiceDtl[] = [];
  costCenterIndex:number = -1;

   //invoiceDtl :InvoiceDtl=new InvoiceDtlDto();
  public accountDetail: InvoiceCashDetails = new InvoiceCashDetailsDto();
  //#endregion

  constructor(
    private service: InvoiceService,
    private alertify: AlertifyService,
    private storeService: LookupService,
    private customerService: CustomerService,
    private itemService: ItemService,
    private accountService: AccountService,
    private costCenterService: CostCenterService,
    private lookupService: LookupService,
    public utilityService: UtilityService
  ) {}
  ngOnInit(): void {
    this.storeGetAll();
    this.accountGetAll();
    this.customersGetAllByType();
    this.ItemsGetAll();
    this.getall();
    this.addAccountDetail();
    this.addItemDetail();
  }
  swapPage(typePage: number) {
    if (typePage == 1) {
      this.Page = 1;
      this.pageName = 'امر صرف مخزني';
    } else if ((typePage = 2)) {
      this.Page = 1;
      this.pageName = 'امر توريد مخزني';
    } else {
      this.alertify.error('please select tab..');
    }
  }
  addAccountDetail(i?: number) {
    if (this.invoice.payment === null) {
      this.invoice.payment = [];
    }

    if (i == undefined) {
      this.invoice.payment.push(this.accountDetail);
    } else {
      this.invoice.payment.splice(i + 1, 0, this.accountDetail);
    }
    this.accountDetail = new InvoiceCashDetailsDto();
  }
  addItemDetail(i?: number) {
    if (this.invoice.invoiceDtl === null) {
      this.invoice.invoiceDtl = [];
    }

    // if(i == undefined)
    // {
    //   this.invoice.invoiceDtl.push(this.invoiceDtl);
    // }
    // else{
    //   this.invoice.invoiceDtl.splice(i + 1, 0, this.invoiceDtl);
    // }
    // this.invoiceDtl=new InvoiceDtlDto();
  }
  getall() {
    this.service.GetAllinvoice().subscribe((result) => {
      this.invoiceList = result;
    });
  }
  storeGetAll() {
    this.storeService.lookupDetailsGetById(117).subscribe((result) => {
      this.storeList = result;
    });
  }
  ItemsGetAll() {
    this.itemService.itemGetAll().subscribe((result) => {
      this.itemList = result;
    });
  }
  accountGetAll() {
    this.accountService.accountGetAll().subscribe((result) => {
      this.accountList = result;
    });
  }
  customersGetAllByType() {
    this.customerService.customerGetAllByType(true).subscribe((result) => {
      this.customerSalesList = result;
    });
  }
  CustomerClosePopup(): void {
    this.displayCustomerStyle = 'none';
  }
  CustomerOpenPopup(): void {
    this.displayCustomerStyle = 'block';
  }
  setCustomerAndStore() {
    if (this.invoice.salesId) {
      var currentCustomer = this.customerSalesList.filter(
        (c) => c.id == this.invoice.salesId
      );
      if (currentCustomer[0].nameL1 && currentCustomer[0].code) {
        this.invoice.salesName = currentCustomer[0].nameL1;
        this.invoice.salesCode = parseInt(currentCustomer[0].code);
      }
    }
    if (this.invoice.storeId) {
      var getStore = this.storeList.filter(
        (c: { id: number }) => c.id == this.invoice.storeId
      );
      if (getStore[0].nameL1 && getStore[0].code) {
        this.invoice.storeName = getStore[0].nameL1;
        this.invoice.storeCode = parseInt(getStore[0].code);
      }
    }
  }
  addstoreItem(item: any) {
    this.invoice.storeId = item.id;
    this.invoice.storeCode = item.code;
    this.invoice.storeName = item.nameL1;
  }
  storeClosePopup(): void {
    this.displaystoreStyle = 'none';
  }
  invoiceDelete(id: any) {}
  openPopup() {}
  invoiceCreateUpdate(x: any) {}
  customerGetByCode(code: number) {
    if (code != undefined && code && Number.isInteger(Number(code))) {
      this.customerService
        .customerGetByCode(this.isCustomer, Number(code))
        .subscribe((result) => {
          if (result) {
            this.addCustomerItem(result);
          } else {
            var errorMsg = this.isCustomer
              ? 'لا يوجد مندوبين لهذا الرقم'
              : 'لا يوجد عملاء لهذا الرقم';
            this.alertify.error(errorMsg);
            this.emptyCustomerItem();
          }
        });
    } else {
      this.emptyCustomerItem();
    }
  }
  emptyCustomerItem() {
    this.invoice.salesId = 0;
    this.invoice.salesCode = 0;
    this.invoice.salesName = '';
  }
  addCustomerItem(item: any) {
    this.invoice.salesId = item.id;
    this.invoice.salesCode = item.code;
    this.invoice.salesName = item.nameL1;
  }
  storeOpenPopup(): void {
    this.displaystoreStyle = 'block';
  }
  storeGetById(code: number) {
    this.storeService.lookupGetByCode(117, code).subscribe((result) => {
      if (result) {
        this.addstoreItem(result);
      } else {
        this.alertify.error('لا يوجد رمز قيد لهذا الرقم');
        this.emptystoreItem();
      }
    });
  }
  emptystoreItem() {
    this.invoice.storeId = 0;
    this.invoice.storeCode = 0;
    this.invoice.storeName = '';
  }
  changeCredit(credit :number=1,currencyExchange:number=1,i: number=0 ){
    this.invoice.payment[i].amountDefaultCurrency=credit*currencyExchange
  }
  changeCreditItem(qty:number=1,credit :number=1,i: number=0 ){
    this.invoice.invoiceDtl[i].totalBaseItemCredit=qty*credit;
  }
  calculateTotalCash() {
    this.totalCash = 0;
    this.invoice.payment.forEach(e => {
      if(e.amountDefaultCurrency){
      this.totalCash += Number(e.amountDefaultCurrency | 0);}
    });
    this.totalCalculate();
  }
  calculateTotalCashForItems() {
    this.totalCashItem = 0;
    this.invoice.invoiceDtl.forEach(e => {
      if(e.totalBaseItemCredit){
      this.totalCashItem += Number(e.totalBaseItemCredit | 0);}
    });
    this.totalCalculate();
  }
  totalCalculate() {
    this.total = this.totalCashItem - this.totalCash;
  }
  CostCenterOpenPopup(accountId:number ,i?: number): void {
    if(accountId && accountId != 0 )
       this.costCenterGetByAccountId(accountId);
    else
       this.alertify.error('اختر حساب اولا');

     if(i != undefined)
        this.costCenterIndex = i;
  }
  // <----- Cost Center modal ----->
displayCostCenterStyle = "none";
costCenterGetByAccountId(accountId:number)
{
  this.costCenterService.costCenterGetByAccountId(accountId).subscribe(result=>{
    this.costCenterList = result;
    if(this.costCenterList.length > 0)
    this.displayCostCenterStyle = "block";
  else
    this.alertify.error('لا يوجد مركز تكاليف لهذا الحساب');
  });
}
  // <----- Account modal ----->
  displayAccountStyle = "none";
  AccountOpenPopup(i?: number): void {

    this.displayAccountStyle = "block";
     if(i != undefined)
        {this.accountIndex = i;

        }

  }

  AccountClosePopup(): void {
    this.displayAccountStyle = "none";

  }
  removeItempayment(index: number) {
    this.invoice.payment.splice(index, 1);
  }
  addAccountItemByAccountNo(accountNo:string, i?:number){

    this.accountService.accountGetByAccountNo(accountNo).subscribe(result=>{
        if(result){
          if(i !== undefined)
          {
            this.addOldAccount(i,result);
          }
        }
        })
      }

addOldAccount(i:number, result:any){
  var acc=this.invoice.payment[i].account
  var cost=this.invoice.payment[i].costCenter
  var currency=this.invoice.payment[i].currency


  if(acc!=undefined){
    this.invoice.payment[i].accountId=result.id;
    acc.accountId = result.id;
    acc.accountNo = result.accountNo;
    acc.nameL1 = result.nameL1;
  }
  if(result.accountCostCenter.length > 0&&cost!=undefined){
    this.invoice.payment[i].costCenterId=result.accountCostCenter[0].costCenter.id;
    cost.id = result.accountCostCenter[0].costCenter.id;
    cost.code= result.accountCostCenter[0].costCenter.code;
    cost.nameL1 = result.accountCostCenter[0].costCenter.nameL1;
   }
   if(currency){
   currency.id = result.currencyId;
   this.invoice.payment[i].currencyId=result.currencyId
   currency.currencyExchange = result.currency?.currencyExchange;
   }


}
trackByIndex(index: number, obj: any): any {
  return index;
}
}
