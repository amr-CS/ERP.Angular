import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-voucherjournal',
  templateUrl: './voucherjournal.component.html',
  styleUrls: ['./voucherjournal.component.css']
})
export class VoucherJournalComponent implements OnInit {
  textFilterModel:string;
  dateFromFilterModel:Date;
  dateToFilterModel:Date;
  dateReferenceFilterModel:Date;

  totalDebit = 0;
  totalCredit = 0;
  totalDifference = 0;

 
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

  itemDetailOld:any;

  
  constructor(private service: VoucherJournalService,private transactionSourceService: TransactionSourceService,
    private transactionTypeService: TransactionTypeService, public datePipe:DatePipe, public utilityService: UtilityService,
    private alertify: AlertifyService, private accountService: AccountService, private costCenterService: CostCenterService) {

    this.transactionSourceGet();
    this.transactionTypeGet();
    this.accountGetAll();
    this.voucherJournalGetAll();

    this.textFilterModel = '';
    this.dateFromFilterModel = new Date();
    this.dateToFilterModel = new Date();
    this.dateReferenceFilterModel = new Date();

    this.voucherJournalRows = ['accountNo', 'debit', 'credit','costCenterId','notes'];
    
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

  voucherJournalCreateUpdate(myForm:NgForm) {
    // force the UI validation to appear
    console.log(this.voucherJournal)
    myForm.form.markAllAsTouched();
    if (this.Validate(myForm)) {
      this.undefineObjectProperties();
      this.voucherJournal.date = this.datePipe.transform(this.voucherJournal.date, 'yyyy-MM-dd') || '';
      this.voucherJournal.referenceDate = this.datePipe.transform(this.voucherJournal.referenceDate, 'yyyy-MM-dd') || '';
      
      if(this.voucherJournal.id == 0){         
        this.service.voucherJournalCreate(this.voucherJournal).
          subscribe(result => {
            this.alertify.success('نجاح');
            this.voucherJournal = result;
            this.voucherJournal.journalVoucherDetails.forEach(element => {
              element.costCenter = element.costCenter ? element.costCenter :{};
              element.costCenterId = element.costCenterId ? element.costCenterId :undefined;
            });
            this.voucherJournalGetAll();

            this.isUpdate = true;      
        },  error => console.error(error));
      }
      else{             
        this.service.voucherJournalUpdate(this.voucherJournal).
        subscribe(result => {
          this.alertify.success('نجاح');
          this.voucherJournal = result;
          this.voucherJournalGetAll();     
          
          this.isUpdate = true;
          
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

  addItemDetail() {         
    this.newVoucherJournalDetail.journalVoucherId = this.voucherJournal.id;
    if (this.voucherJournal.journalVoucherDetails === null) {
      this.voucherJournal.journalVoucherDetails = [];
    }
    this.voucherJournal.journalVoucherDetails.push(this.newVoucherJournalDetail);
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

  setFocus(t:any,inputElemet:any,index?:number) {  

    // Auto Focus when closing the modals
    if(index){      
      var tbodyRows = t.childNodes[1].children.length;
      t.childNodes[1].children[tbodyRows - 1].childNodes[index].childNodes[0].focus();
    }
    else{
      this.utilityService.setFocus(t, inputElemet, this.itemDetailOld, this.voucherJournalRows);  
    }
     this.itemDetailOld = {};   
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
 

// UI Valiadtion When Submit
isDetailsEmpty = false;
Validate(myForm:NgForm) {
  this.isDetailsEmpty = false;

  if(!myForm.valid){
    this.alertify.error('يجب اختيار الحقول الالزامية');
      return false;
  }

  if(this.voucherJournal.journalVoucherDetails == null || this.voucherJournal.journalVoucherDetails.length < 1)
  {     
    this.isDetailsEmpty = true;
    this.alertify.error('على الاقل ادخل بيانات واحدة فى التفاصيل !');
    return false;
  }
  
  
  if(this.totalDifference != 0){
    this.alertify.error('يجب ان يكون الاجمالى صفر');
    return false;
  }

  
      
 return true;
}

accountIndex:number = -1;
addAccountItem(id:number){  
  var account = this.accountService.accountGetById(id).subscribe(result=>{
    //Old
    if(this.accountIndex != -1)    
    {
      this.voucherJournal.journalVoucherDetails[this.accountIndex].accountId = result.id;
      this.voucherJournal.journalVoucherDetails[this.accountIndex].accountNo = result.accountNo;
      var tempJournalVoucherDetailsAccount = this.voucherJournal.journalVoucherDetails[this.accountIndex].account;
      if(tempJournalVoucherDetailsAccount){
        tempJournalVoucherDetailsAccount.nameL1 = result.nameL1;
        tempJournalVoucherDetailsAccount.nameL2 = result.nameL2;
      }
    
      this.voucherJournal.journalVoucherDetails[this.accountIndex].currencyId = result.currencyId;
      this.voucherJournal.journalVoucherDetails[this.accountIndex].currencyExchange = result.currency?.currencyExchange;
      var tempJournalVoucherDetailsCurrency = this.voucherJournal.journalVoucherDetails[this.accountIndex].currency;
      if(tempJournalVoucherDetailsCurrency){
        tempJournalVoucherDetailsCurrency.nameL1 = result.currency?.nameL1;
        tempJournalVoucherDetailsCurrency.nameL2 = result.currency?.nameL2;
     }

     this.voucherJournal.journalVoucherDetails[this.accountIndex].costCenterId = undefined;
     var tempJournalVoucherDetailsCostCenter = this.voucherJournal.journalVoucherDetails[this.accountIndex].costCenter;
     if(tempJournalVoucherDetailsCostCenter){
      tempJournalVoucherDetailsCostCenter.nameL1 = '';
      tempJournalVoucherDetailsCostCenter.nameL2 = '';
     }
     
    }
    // new 
    else {
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

      this.newVoucherJournalDetail.costCenterId = undefined;      
      if(this.newVoucherJournalDetail.costCenter){
        this.newVoucherJournalDetail.costCenter.nameL1 = '';
        this.newVoucherJournalDetail.costCenter.nameL2 = '';
      }
  }
  
  this.accountIndex = -1;
  });  


}

costCenterIndex:number = -1;
addCostCenterItem(id:number){
  var costCenter = this.costCenterService.costCenterById(id).subscribe(result=>{
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
      this.alertify.error('no cost center for this account');
    });
  }

  CostCenterOpenPopup(accountId:number ,i?: number): void {     
    if(accountId && accountId != 0 )
       this.costCenterGetByAccountId(accountId);       
    else
       this.alertify.error('select an account first');                    
    
     if(i != undefined)
        this.costCenterIndex = i;    
  }


  CostCenterClosePopup(): void {
    this.displayCostCenterStyle = "none";    
  }


}
