import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InvoiceCashDetailsDto } from '../Dto/InvoiceCashDetailsDto';
import { InvoiceDtlDto } from '../Dto/InvoiceDtlDto';
import { InvoiceDto } from '../Dto/InvoiceDto';
import { Account } from '../interfaces/account.interface';
import { CostCenter } from '../interfaces/costcenter.interface';
import { Invoice, InvoiceCashDetails, InvoiceDtl } from '../interfaces/Invoice.interface';
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

export class InvoiceOrderComponent{
  selectedTab='generalData'
  public pageName="امر توريد مخزني"
public costCenterList:CostCenter[] = [];
public invoiceList:any[] = [];
  Page: number=0;


  constructor(private service:InvoiceService,private alertify:AlertifyService,private storeService:LookupService,private customerService:CustomerService,private itemService:ItemService
    , private accountService: AccountService, private costCenterService: CostCenterService
   ,private lookupService:LookupService ,public utilityService: UtilityService) {
this.storeGetAll()
this.accountGetAll();
this.customersGetAllByType()
this.ItemsGetAll();
this.getall();
  /*  for (let index = 0; index < Constants.inputsCount; index++) {
      this.addItemDetail();
    }*/
    this.addAccountDetail()
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
  accountGetAll() {
    this.accountService.accountGetAll().subscribe(result => {
      this.accountList = result;
    });
  }
  textFilterModel!: string;
  dateFromFilterModel!: Date;
  dateToFilterModel!: Date;
  dateReferenceFilterModel!: Date;
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

  getall(){
    this.service.GetAllinvoice().subscribe(result=>{
      this.invoiceList=result;
    })
  }

  public storeList: any ;
  public itemList: any ;
  public accountList:Account[] = [];
  public UnitList:NameCommon[] = [];
  totalCash =0;
  totalCashItem =0;



  public customerSalesList: NameCommon[] = [];

  public invoice: Invoice=new InvoiceDto();
  public invoiceDtl :InvoiceDtl=new InvoiceDtlDto();
    accountDetail: InvoiceCashDetails =new InvoiceCashDetailsDto();


    trackByIndex(index: number, obj: any): any {
      return index;
    }
//Undefined the object properties not needed to be mapped on Create and Update
undefineObjectProperties() {
  this.invoice.payment.forEach(e => {
    e.account = undefined;
    e.currency = undefined;
    e.costCenter = undefined;
  });
  this.invoice.invoiceDtl.forEach(e => {
    e.item = undefined;
    e.unit = undefined;
  });
}
defineObjectProperties() {
  this.invoice.payment.forEach(e => {
    e.account = {};
    e.currency = {};
    e.costCenter = {};
  });
  this.invoice.invoiceDtl.forEach(e => {
    e.item = {};
    e.unit = {};
  });
}
total=0;
totalCalculate() {
  this.total = this.totalCashItem - this.totalCash;
}
// UI Valiadtion When Submit
isDetailsEmpty = false;
Validate(myForm:NgForm) {
  this.isDetailsEmpty = false;
  if(!myForm.valid){
    this.alertify.error('يجب ملء الحقول الالزامية');
      return false;
  }

  this.totalCalculate();
    if (this.total != 0) {
      this.alertify.error('يجب ان يكون مجموع النقدية والتفاصيل يساوي صفر');
      return false;
    }



 return true;
}

invoiceCreateUpdate(myForm:NgForm) {
  myForm.form.markAllAsTouched();
      if (this.Validate(myForm)) {
      this.undefineObjectProperties()
      this.invoice.payment.forEach(e => {
        e.account = undefined;
        e.currency = undefined;
        e.costCenter = undefined;
      });
      this.invoice.invoiceDtl.forEach(e => {
        e.invType=1
        e.storeId=this.invoice.storeId
        e.date=this.invoice.invDate
        e.companyId=this.invoice.companyId

       e.item = undefined;
        e.unit = undefined;
      });
       if(this.invoice.invId == 0){
      this.invoice.invtype=7


      console.log(this.invoice)
         this.service.invoiceCreate(this.invoice).
            subscribe(result => {
              this.successCreateUpdate(result);
          },  error => console.error(error));
      } else{
        this.service.invoiceUpdate(this.invoice).
        subscribe(result => {
          this.successCreateUpdate(result);
      },  error => console.error(error));

      }
    }
    }
    addItemDetail(i?:number) {
      if (this.invoice.invoiceDtl === null) {
        this.invoice.invoiceDtl = [];
      }

      if(i == undefined)
      {
        this.invoice.invoiceDtl.push(this.invoiceDtl);
      }
      else{
        this.invoice.invoiceDtl.splice(i + 1, 0, this.invoiceDtl);
      }
      this.invoiceDtl=new InvoiceDtlDto();




    }
    addAccountDetail(i?:number) {
      if (this.invoice.payment === null) {
        this.invoice.payment = [];
      }

      if(i == undefined)
      {
        this.invoice.payment.push(this.accountDetail);
      }
      else{
        this.invoice.payment.splice(i + 1, 0, this.accountDetail);
      }
      this.accountDetail=new InvoiceCashDetailsDto();




    }
    successCreateUpdate(result:any){
      this.alertify.success('تم الحفظ بنجاح');
      this.invoice = result;
      this.setCustomerAndStore()
      //this.invoiceGetByTransactionTypeId();

     // this.isUpdate = true;
    }



    ////Modal Store
    storeGetAll() {
      this.storeService.lookupDetailsGetById(117).subscribe(result => {
        this.storeList = result;
      });
    }
    displaystoreStyle = "none";
    addstoreItem(item: any) {
      this.invoice.storeId = item.id;
      this.invoice.storeCode = item.code;
      this.invoice.storeName = item.nameL1;

    }

    emptystoreItem() {
      this.invoice.storeId = 0;
      this.invoice.storeCode = 0;
      this.invoice.storeName = '';
    }

    storeOpenPopup(): void {
      this.displaystoreStyle = "block";
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
    storeClosePopup(): void {
      this.displaystoreStyle = "none";
    }

    storeGetById(code: number) {

        this.storeService.lookupGetByCode(117,code).subscribe(result => {

          if (result) {
            this.addstoreItem(result);
          }
          else {
            this.alertify.error('لا يوجد رمز قيد لهذا الرقم');
            this.emptystoreItem();
          }
        });

    }
     // <----- Customer modal ----->

  displayCustomerStyle = "none";
  isCustomer = false;
  addCustomerItem(item: any) {


      this.invoice.salesId = item.id;
      this.invoice.salesCode = item.code;
      this.invoice.salesName = item.nameL1;


  }

  customersGetAllByType() {
    this.customerService.customerGetAllByType(true).subscribe(result => {
      this.customerSalesList = result;
    });

    this.customerService.customerGetAllByType(false).subscribe(result => {
      this.customerSalesList = result;
    });
  }

  emptyCustomerItem() {

      this.invoice.salesId = 0;
      this.invoice.salesCode = 0;
      this.invoice.salesName = '';

  }

  CustomerOpenPopup(): void {
    this.displayCustomerStyle = "block";

  }

  CustomerClosePopup(): void {
    this.displayCustomerStyle = "none";
  }

  customerGetByCode(code: number) {
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
//item modal
  // <----- Item modal ----->

  displayItemStyle = "none";
  Index:number = -1;
  addItemItem(item: any) {
    var product=this.invoice.invoiceDtl[this.Index].item
    if(this.Index != -1&&product)
    {
      this.invoice.invoiceDtl[this.Index].itemId=item.id;
      product.id = item.id;
      product.code = item.code;
      product.nameL1= item.nameL1;
this.GetUnit(item.id);

    }
  this.Index = -1;

}

  ItemsGetAll() {
    this.itemService.itemGetAll().subscribe(result => {
      this.itemList = result;
    });


  }

  emptyItemItem() {
    this.invoiceDtl.itemId = 0;
    this.invoiceDtl.itemCode = 0;
    this.invoiceDtl.itemName= '';
  }

  ItemOpenPopup(i:number): void {
    this.displayItemStyle = "block";
  this.Index=i;
  }

  ItemClosePopup(): void {
    this.displayItemStyle = "none";
  }

  ItemGetByCode(code: number,i:number) {
    this.Index=i;
      this.itemService.itemGetByCode( Number(code)).subscribe(result => {
        if (result) {

          this.addItemItem(result);
        }
        else {
          var errorMsg =  'لا يوجد صنف';
          this.alertify.error(errorMsg);
          this.emptyItemItem();
        }

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

accountIndex:number = -1;
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
changeCredit(credit :number=1,currencyExchange:number=1,i: number=0 ){
  this.invoice.payment[i].amountDefaultCurrency=credit*currencyExchange
}
changeCreditItem(qty:number=1,credit :number=1,i: number=0 ){
  this.invoice.invoiceDtl[i].totalBaseItemCredit=qty*credit;
}


addAccountItemById(id:number){
  this.accountService.accountGetById(id).subscribe(result=>{
    if(this.accountIndex != -1)
    {
      this.addOldAccount(this.accountIndex,result);
    }

  this.accountIndex = -1;
  });

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

CostCenterOpenPopup(accountId:number ,i?: number): void {
  if(accountId && accountId != 0 )
     this.costCenterGetByAccountId(accountId);
  else
     this.alertify.error('اختر حساب اولا');

   if(i != undefined)
      this.costCenterIndex = i;
}


CostCenterClosePopup(): void {
  this.displayCostCenterStyle = "none";

}

costCenterIndex:number = -1;
addCostCenterItem(id:number){
   this.costCenterService.costCenterById(id).subscribe(result=>{
      this.invoice.payment[this.costCenterIndex].costCenterId = result.id;
      this.invoice.payment[this.costCenterIndex].costCenterName = result.nameL1;
      this.invoice.payment[this.costCenterIndex].costCenterCode = result.code;
  this.costCenterIndex = -1;
  });


}

//Unit Modal
GetUnit(id:number){
  this.lookupService.GetlookupDetailsByIdforItems(id).subscribe(result=>{
    if(result!=undefined){
    this.UnitList = result;
    }
  })
}
UnitIndex:number = -1;

addUnitItem(id:number,Unit:any){
  var unit=this.invoice.invoiceDtl[this.UnitIndex].unit
    if(this.UnitIndex != -1&&unit)
    {
      this.invoice.invoiceDtl[this.UnitIndex].unitId=Unit.id;
      unit.id = Unit.id;
      unit.code = Unit.code;
      unit.nameL1= Unit.nameL1;
    }
  this.UnitIndex = -1;
}



displayUnitStyle = "none";



UnitOpenPopup(i?: number): void {
  this.displayUnitStyle = "block";
   if(i != undefined)
      this.UnitIndex = i;
}

UnitClosePopup(): void {
  this.displayUnitStyle = "none";
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
invoiceGetById(id: any) {
  if (id) {
    this.service.GetinvoiceById(Number(id)).subscribe(result => {
this.invoice=result;
console.log(this.invoice)
this.setCustomerAndStore()
this.calculateTotalCashForItems()
this.calculateTotalCash()
 })
  }
}
setCustomerAndStore(){
  if (this.invoice.salesId) {
    var currentCustomer = this.customerSalesList.filter(c => c.id == this.invoice.salesId);
      if(currentCustomer[0].nameL1&&currentCustomer[0].code){
        this.invoice.salesName=currentCustomer[0].nameL1;
        this.invoice.salesCode=parseInt(currentCustomer[0].code);
      }
  }
  if (this.invoice.storeId) {
    var getStore = this.storeList.filter((c: { id: number; }) => c.id == this.invoice.storeId);
      if(getStore[0].nameL1&&getStore[0].code){
        this.invoice.storeName=getStore[0].nameL1;
        this.invoice.storeCode=parseInt(getStore[0].code);
      }
  }
}
invoiceDelete(id: number) {
  var isSuccess = false;
  if (id) {
    this.alertify.confirm('are you sure to delete journal Voucher ' + id,()=>{
      this.service.invoiceDelete(id).subscribe(result => {
        isSuccess = result;
        this.utilityService.reloadComponent();
        this.alertify.success('تم الحذف');
      }, error => alert('Not Found'));

    });

  }
  return isSuccess;
}
removeItempayment(index: number) {
  this.invoice.payment.splice(index, 1);
}
removeDtl(index: number) {
  this.invoice.invoiceDtl.splice(index, 1);
}


}





