import { DatePipe } from '@angular/common';
import { Component, OnInit,ElementRef, ViewChild  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VoucherJournal, VoucherJournalDetails } from '../interfaces/voucherjournal.interface';
import { RowCommon } from '../interfaces/rowcommon.interface';
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

@Component({
  selector: 'app-voucherjournal',
  templateUrl: './voucherjournal.component.html',
  styleUrls: ['./voucherjournal.component.css']
})
export class VoucherJournalComponent implements OnInit {
  @ViewChild('table') detailsTable!: ElementRef;

  textFilterModel:string;
  dateFromFilterModel:Date;
  dateToFilterModel:Date;
  dateReferenceFilterModel:Date;

  totalDebit = 0;
  totalCredit = 0;
  totalDifference = 0;

  currentFinancialYear = '';
  isCurrentFinancialYear = true;
 
  // public voucherJournalColumns : Array<string>;
 public voucherJournalRows : Array<string>;

  public voucherJournal: VoucherJournal = {    
    id: 0,
    date: new Date().toLocaleDateString(),
    referenceNumber: '',
    referenceDate: new Date().toLocaleDateString(),
    journalTypeId: 2,
    sourceTypeId:1,
    isPosted: false,
    isIncomplete: false,
    isCancelled: false,
    isRepeated: false,
    isReversed: false,
    isDeleted: false,
    notes: '',
    journalVoucherDetails: []
  };
  public voucherJournalList: VoucherJournal[] = [];
  public nameCommon : NameCommon = {};
  public newVoucherJournalDetail: VoucherJournalDetails ={
    id: 0,
    journalVoucherId: 0,
    accountId: 0,
    accountNo: '',
    currencyId: 0,
    debit:0,
    debitDefaultCurrency:0,
    credit:0,
    creditDefaultCurrency:0,
    notes: '',
    account:{},
    currency:{},
    costCenter:{}    
  };

  public sourceTypeName?:string ='';
  public journalTypeName?:string ='';

  public accountList:Account[] = [];
  public costCenterList:CostCenter[] = [];

  itemDetailOld: VoucherJournalDetails ={
    id: 0,
    journalVoucherId: 0,
    accountId: 0,
    accountNo: '',
    currencyId: 0,
    debit:0,
    debitDefaultCurrency:0,
    credit:0,
    creditDefaultCurrency:0,
    notes: '',
    account:{},
    currency:{},
    costCenter:{}    
  };

  
  constructor(private service: VoucherJournalService,private transactionSourceService: TransactionSourceService,
    private transactionTypeService: TransactionTypeService, public datePipe:DatePipe, public utilityService: UtilityService,
    private alertify: AlertifyService, private accountService: AccountService, private costCenterService: CostCenterService
    ,private financialYearService : FinancialYearService) {

    this.transactionSourceGet();
    this.transactionTypeGet();
    this.accountGetAll();
    this.voucherJournalGetAll();
    this.getCurrentFinancialYear();

    this.textFilterModel = '';
    this.dateFromFilterModel = new Date();
    this.dateToFilterModel = new Date();
    this.dateReferenceFilterModel = new Date();

    this.voucherJournalRows = ['accountNo', 'debit', 'credit','costCenterId','notes'];
    
    for (let index = 0; index < Constants.inputsCount; index++) {      
      this.addItemDetail();
    }
  
   }

  ngOnInit(): void {
  }

  transactionSourceGet()
  { // the id for this page for source is 1
    this.transactionSourceService.transactionSourceGetById(1).subscribe(result=>{
      this.sourceTypeName = result.nameL1;
      this.voucherJournal.sourceTypeName = result.nameL1;
    });
  }

  transactionTypeGet()
  {
    // the id for this page for type is 2
    this.transactionTypeService.transactionTypeGetById(2).subscribe(result=>{
      this.journalTypeName = result.nameL1;
      this.voucherJournal.journalTypeName = result.nameL1;
    });
  }

  getCurrentFinancialYear()
  {
    this.financialYearService.financialYearGetCurrentFinancialYear().subscribe(result=>{
      this.currentFinancialYear = result.financialYear;
    });
  }

  accountGetAll()
  {
    this.accountService.accountGetAll().subscribe(result=>{
      this.accountList = result;
    });
  }

  totalDebitCreditCalculate()
  {
    var debtSum = 0;
    var creditSum = 0;
    this.voucherJournal.journalVoucherDetails.forEach(e => {
      debtSum += e.debit || 0;
      creditSum += e.credit || 0;
    });

    this.totalDebit = debtSum;
    this.totalCredit = creditSum;
    this.totalDifference = Math.abs(debtSum - creditSum);
  }
  
  voucherJournalGetAll() {
    this.service.voucherJournalGetAll().subscribe(result => {
      this.voucherJournalList = result;
    }, error => console.error(error));
  }

  voucherJournalGetById(id: any) {
    if (id) {
      this.service.voucherJournalGetById(Number(id)).subscribe(result => {
        if (result !== null) {
          this.isUpdate = true;
          this.voucherJournal = result;         
          this.voucherJournal.date = this.datePipe.transform(this.voucherJournal.date,'yyyy-MM-dd') || '';
          this.voucherJournal.referenceDate = this.datePipe.transform(this.voucherJournal.referenceDate,'yyyy-MM-dd') || '';
          // to remove null console errors
          this.voucherJournal.journalVoucherDetails.forEach(e => {
            if(e.account == null){
              e.account = {};
            }

            if(e.currency == null){
              e.currency = {};
            }

            if(e.costCenter == null){
              e.costCenter = {};         
            }            
          }); 
          this.totalDebitCreditCalculate();        
        }
      }, error => console.error(error));
    }

  }

  voucherJournalDelete(id: number) {    
    var isSuccess = false;
    if (id) {
      this.alertify.confirm('are you sure to delete journal Voucher ' + id,()=>{
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
  voucherJournalIsUpdateableToggle(){
    this.isUpdate = !this.isUpdate;
  }


  voucherJournalDetailsAdjustment(){
    var detailsCopy = this.voucherJournal.journalVoucherDetails;
    detailsCopy = [];
    this.voucherJournal.journalVoucherDetails.forEach(element => {
      debugger;
      if(element.accountNo && element.debit !=undefined && element.credit != undefined){
        detailsCopy.push(element);
      }      
    });
    this.voucherJournal.journalVoucherDetails = detailsCopy;    
  }

  successCreateUpdate(result:any){
    this.alertify.success('نجاح');
    this.voucherJournal = result;
    this.voucherJournal.journalVoucherDetails.forEach(element => {
      element.costCenter = element.costCenter ? element.costCenter :{};
      element.costCenterId = element.costCenterId ? element.costCenterId :undefined;
    });
    this.voucherJournalGetAll();

    this.isUpdate = true;      
  }
  voucherJournalCreateUpdate(myForm:NgForm) {
    // force the UI validation to appear
    console.log(this.voucherJournal)
    myForm.form.markAllAsTouched();
    if (this.Validate(myForm)) {
      this.undefineObjectProperties();
      this.voucherJournal.date = this.datePipe.transform(this.voucherJournal.date, 'yyyy-MM-dd') || '';
      this.voucherJournal.referenceDate = this.datePipe.transform(this.voucherJournal.referenceDate, 'yyyy-MM-dd') || '';
      this.voucherJournalDetailsAdjustment();

      if(this.voucherJournal.id == 0){         
        this.service.voucherJournalCreate(this.voucherJournal).
          subscribe(result => {
            this.successCreateUpdate(result);
        },  error => console.error(error));
      }
      else{             
        this.service.voucherJournalUpdate(this.voucherJournal).
        subscribe(result => {
          this.successCreateUpdate(result);          
      },  error => console.error(error));
      }

    }    
  }

  //Undefined the object properties not needed to be mapped on Create and Update 
  undefineObjectProperties(){
    this.voucherJournal.journalVoucherDetails.forEach(e => {       
      e.account = undefined;                  
      e.currency = undefined;                
      e.costCenter = undefined;          
  }); 
  }

  

  removeItemDetail(index:number) {
    this.voucherJournal.journalVoucherDetails.splice(index, 1);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  addItemDetail(i?:number) {         
    this.newVoucherJournalDetail.journalVoucherId = this.voucherJournal.id;
    if (this.voucherJournal.journalVoucherDetails === null) {
      this.voucherJournal.journalVoucherDetails = [];
    }
    
    if(i == undefined)
    {     
      this.voucherJournal.journalVoucherDetails.push(this.newVoucherJournalDetail);
    }
    else{      
      this.voucherJournal.journalVoucherDetails.splice(i + 1, 0, this.newVoucherJournalDetail);     
    }
    
    
    this.itemDetailOld = this.newVoucherJournalDetail;   
    this.newVoucherJournalDetail = {
      id: 0,
      journalVoucherId: 0,
      accountId: 0,
      accountNo: '',
      currencyId: 0,
      debit:0,
      debitDefaultCurrency:0,
      credit:0,
      creditDefaultCurrency:0,
      notes: '',
      account:{},
      currency:{},
      costCenter:{}    
    };

    this.totalDebitCreditCalculate();
  }

  setFocusAccountNo(t:any,index:number){
    var tbodyRows = t.childNodes[1].children.length;    
    t.childNodes[1].children[tbodyRows-1].childNodes[index].childNodes[0].focus()       
  }
  
  setFocus(t?:any,inputElemet?:any,index?:number) {    
    // Auto Focus when closing the modals
      
     if (index){        
      var tbodyRows = t.childNodes[1].children.length;
      var bodyElement = t.childNodes[1].children[tbodyRows - 1].childNodes[index].childNodes[0];
      bodyElement.focus();
    }
    
    else{      
      this.utilityService.setFocus(t, inputElemet, this.itemDetailOld, this.voucherJournalRows);  
    }
     this.itemDetailOld ={
      id: 0,
      journalVoucherId: 0,
      accountId: 0,
      accountNo: '',
      currencyId: 0,
      debit:0,
      debitDefaultCurrency:0,
      credit:0,
      creditDefaultCurrency:0,
      notes: '',
      account:{},
      currency:{},
      costCenter:{}    
    }   
}

  // Date Filter
  isDateFilter = false;
  isDateRefFilter = false;
  filterListByDate(){   
    this.textFilterModel = '';
    this.isDateFilter = true;      
  }

  onChangeDate(){
    this.isDateRefFilter  = false;
  }
  onChangeDateRef(){
    this.isDateRefFilter  = true;
  }
  

  modalSearchKeyUp(){
    this.isDateFilter = false;  
    this.isDateRefFilter  = false;
  }
 
  checkForcurrentSelectedDateYear(){
    this.isCurrentFinancialYear = true;
    var currentSelectedDateYear = (new Date(this.voucherJournal.date)).getFullYear();
    if(currentSelectedDateYear!= Number(this.currentFinancialYear)){
      this.isCurrentFinancialYear = false;
      this.alertify.error('يجب ان يكون التاريخ ضمن السنة المالية');
    }  
  }



  isAccountNoRequired(accountNumber : any , debit:any, credit:any){      
  return(accountNumber.value =='' && (accountNumber.dirty))  
  || (accountNumber.value =='' && ((debit.invalid || debit.dirty) || (credit.invalid || credit.dirty)));
}

// UI Valiadtion When Submit
isDetailsEmpty = false;
Validate(myForm:NgForm) {
  this.isDetailsEmpty = false;
  if(!myForm.valid){
    this.alertify.error('يجب ملء الحقول الالزامية');    
      return false;
  }

  if(!this.isCurrentFinancialYear){    
      this.checkForcurrentSelectedDateYear();
      return false;
  }

  if(this.voucherJournal.journalVoucherDetails == null || this.voucherJournal.journalVoucherDetails.length < 1)
  {     
    this.isDetailsEmpty = true;
    this.alertify.error('على الاقل ادخل بيانات واحدة فى التفاصيل !');
    return false;
  }

  var isOneDetailValid = false; 
  this.voucherJournal.journalVoucherDetails.forEach(element => {
    if (element.accountNo)
        isOneDetailValid = true;        
  });

  if(!isOneDetailValid)
  {         
    this.alertify.error('على الاقل ادخل رقم حساب واحد فى التفاصيل !');
    return false;
  }
  
  
  if(this.totalDifference != 0){
    this.alertify.error('يجب ان يكون الاجمالى صفر');
    return false;
  }

        
 return true;
}

addOldAccount(i:number, result:any){
      this.voucherJournal.journalVoucherDetails[i].accountId = result.id;
      this.voucherJournal.journalVoucherDetails[i].accountNo = result.accountNo;
      var tempJournalVoucherDetailsAccount = this.voucherJournal.journalVoucherDetails[i].account;
      if(tempJournalVoucherDetailsAccount){
        tempJournalVoucherDetailsAccount.nameL1 = result.nameL1;
        tempJournalVoucherDetailsAccount.nameL2 = result.nameL2;
      }
    
      this.voucherJournal.journalVoucherDetails[i].currencyId = result.currencyId;
      this.voucherJournal.journalVoucherDetails[i].currencyExchange = result.currency?.currencyExchange;
      var tempJournalVoucherDetailsCurrency = this.voucherJournal.journalVoucherDetails[i].currency;
      if(tempJournalVoucherDetailsCurrency){
        tempJournalVoucherDetailsCurrency.nameL1 = result.currency?.nameL1;
        tempJournalVoucherDetailsCurrency.nameL2 = result.currency?.nameL2;        
     }

     this.voucherJournal.journalVoucherDetails[i].debitDefaultCurrency = (this.voucherJournal.journalVoucherDetails[i].debit || 0) * (this.voucherJournal.journalVoucherDetails[i].currencyExchange || 0);
     this.voucherJournal.journalVoucherDetails[i].creditDefaultCurrency = (this.voucherJournal.journalVoucherDetails[i].credit || 0) * (this.voucherJournal.journalVoucherDetails[i].currencyExchange || 0);
   
    if(result.accountCostCenter.length > 0){
      this.voucherJournal.journalVoucherDetails[i].costCenterId = result.accountCostCenter[0].id;
      var tempJournalVoucherDetailsCostCenter = this.voucherJournal.journalVoucherDetails[i].costCenter;
      if(tempJournalVoucherDetailsCostCenter){
          tempJournalVoucherDetailsCostCenter.nameL1 = result.accountCostCenter[0].costCenter.nameL1;
          tempJournalVoucherDetailsCostCenter.nameL2 = result.accountCostCenter[0].costCenter.nameL2;
          tempJournalVoucherDetailsCostCenter.code = result.accountCostCenter[0].costCenter.code;
       }
     }
}

addNewAccount(result:any){
  this.newVoucherJournalDetail.accountId = result.id;
      this.newVoucherJournalDetail.accountNo = result.accountNo;
      
      if(this.newVoucherJournalDetail.account){
        this.newVoucherJournalDetail.account.nameL1 = result.nameL1;
        this.newVoucherJournalDetail.account.nameL2 = result.nameL2;
      }
    
      this.newVoucherJournalDetail.currencyId = result.currencyId;
      this.newVoucherJournalDetail.currencyExchange = result.currency?.currencyExchange;
      if(this.newVoucherJournalDetail.currency){
        this.newVoucherJournalDetail.currency.nameL1 = result.currency?.nameL1;
        this.newVoucherJournalDetail.currency.nameL2 = result.currency?.nameL2;
      }
        if(result.accountCostCenter.length > 0){
          this.newVoucherJournalDetail.costCenterId = result.accountCostCenter[0].id;       
          if(this.newVoucherJournalDetail.costCenter){
            this.newVoucherJournalDetail.costCenter.nameL1 = result.accountCostCenter[0].costCenter.nameL1;
            this.newVoucherJournalDetail.costCenter.nameL2 = result.accountCostCenter[0].costCenter.nameL2;
            this.newVoucherJournalDetail.costCenter.code = result.accountCostCenter[0].costCenter.code;
          }
      }
}

accountIndex:number = -1;
addAccountItemById(id:number){   
  this.accountService.accountGetById(id).subscribe(result=>{    
    if(this.accountIndex != -1)    
    {
      this.addOldAccount(this.accountIndex,result);
    }
    else {      
      this.addNewAccount(result);
      this.addItemDetail();

      //Focus on debit of index 4
      var t = this.detailsTable.nativeElement;          
      setTimeout(() => {this.setFocusAccountNo(t,4);}, 0);
            
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
    
        else {
          this.addNewAccount(result);                   
          this.addItemDetail();

          //Focus on debit of index 4
          var t = this.detailsTable.nativeElement;          
          setTimeout(() => {this.setFocusAccountNo(t,4);}, 0);
          
      }
    }
    else if(i !== undefined)
    {      
      this.voucherJournal.journalVoucherDetails[i].accountNo = '';
      this.voucherJournal.journalVoucherDetails[i].account = {};
      this.voucherJournal.journalVoucherDetails[i].currencyExchange = undefined;      
      this.voucherJournal.journalVoucherDetails[i].currency = {};    
      this.voucherJournal.journalVoucherDetails[i].costCenter = {};
    }
    else
    {
      this.newVoucherJournalDetail.accountNo = '';
    }
  
  });  


}


costCenterIndex:number = -1;
addCostCenterItem(id:number){
   this.costCenterService.costCenterById(id).subscribe(result=>{
    if(this.costCenterIndex != -1)    
    {
      this.voucherJournal.journalVoucherDetails[this.costCenterIndex].costCenterId = result.id;
      var tempJournalVoucherDetailsCostCenter = this.voucherJournal.journalVoucherDetails[this.costCenterIndex].costCenter;
      if(tempJournalVoucherDetailsCostCenter){
        tempJournalVoucherDetailsCostCenter.nameL1 = result.nameL1;
        tempJournalVoucherDetailsCostCenter.nameL2 = result.nameL2;
      }              

    }
    else {
      this.newVoucherJournalDetail.costCenterId = result.id;       
      if(this.newVoucherJournalDetail.costCenter){
        this.newVoucherJournalDetail.costCenter.nameL1 = result.nameL1;
        this.newVoucherJournalDetail.costCenter.nameL2 = result.nameL2;
      }      
  }
  
  this.costCenterIndex = -1;
  });  


}

  // <----- modal ----->
  displayStyle = "none";  
  openPopup(): void {
    this.displayStyle = "block";
    this.textFilterModel = '';
    this.dateFromFilterModel = new Date();
    this.dateToFilterModel =new Date();
    this.dateReferenceFilterModel =  new Date();
    this.isDateFilter = false;
    this.isDateRefFilter  = false;
  }

  closePopup(): void {
    this.displayStyle = "none";    
  }

  // <----- Account modal ----->
  displayAccountStyle = "none";
  AccountOpenPopup(i?: number): void {
    
    this.displayAccountStyle = "block"; 
     if(i != undefined)
        this.accountIndex = i;
    
  }

  AccountClosePopup(): void {
    this.displayAccountStyle = "none";    
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


}
