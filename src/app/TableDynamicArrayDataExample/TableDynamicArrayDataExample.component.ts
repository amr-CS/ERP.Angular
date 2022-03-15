
import { Component, Input, ViewChild,OnChanges, SimpleChanges, OnInit,DoCheck, ElementRef} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource, _MatTableDataSource} from '@angular/material/table';
import { AlertifyService } from '../services/alertify.service';
import { TreeService } from '../services/tree.service';
import { AccountMain, AccountDetail } from '../interfaces/accountMain.interface';
import { NgForm } from '@angular/forms';
import { Constants } from '../services/constants';
import { Currency } from '../interfaces/currency.interface.';
import { UtilityService } from '../services/utility.service';
import { NameCommon } from '../interfaces/namecommon.interface';
import { AccountService } from '../services/account.service';
@Component({
  selector: 'app-TableDynamicArrayDataExample',
  templateUrl: './TableDynamicArrayDataExample.component.html',
  styleUrls: ['./TableDynamicArrayDataExample.component.css']
})
export class TableDynamicArrayDataExampleComponent implements OnChanges  {
  mainAccountNo:any;
  mainAccountNameL1:any;
  mainAccountId:any;

  dataSource!: MatTableDataSource<any>;
  public AccountRows!: Array<string>;
  textFilterModel!: string;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild('table') detailsTable!: ElementRef;
  @Input() parentData: any;
  @Input() accountFromParent: any;

  
  public currencyList:Currency[] = [];
  public securityGradeList:NameCommon[] = [];
  public AccountTypeList:NameCommon[] = [];
  public AccountReportList:NameCommon[] = [];



  public accountMain: AccountMain = {    
    accountDetail: []
  };
 newAccountDetail: AccountDetail ={
    id: 0,
    code:0,
    nameL1: '',
    nameL2: '',
    accountNo: '',
    currencyId: 0,
    currencyName: '',
    isCumulative:0,
    isCostCenter:0,
    accountReportId:0,
    accountReportName:'',
    securityGradeId:0,
    securityGradeName:'',
    companyId: 0,
    parentId: 0,
    accountLevel: 0,
    accountTypeId: 0,
    accountTypeName:'',
    accountCategoryId: 0,
    currencyFactorId: 0,
    accountIsDebit: 0,
    cashFlowTypeId: 0,
    isActive: 1,
    isDeleted: 0,
    createdBy: 1,
    createdOn: new Date(),
    lastUpdatedBy:1,
    lastUpdatedOn: '',
    //currency:{}
  };

  trackByIndex(index: number, obj: any): any {
    return index;
  }
  
  
 public  newAccountDetailOld: AccountDetail ={
  id: 0,
  code:0,

  nameL1: '',
  nameL2: '',
  accountNo: '',
  currencyId: 0,
  currencyName: '',
  isCumulative:0,
  isCostCenter:0,
  accountReportId:0,
  accountReportName:'',
  securityGradeId:0,
  securityGradeName:'',
  companyId: 0,
  parentId: 0,
  accountLevel: 0,
  accountTypeId: 0,
  accountTypeName:'',
  accountCategoryId: 0,
  currencyFactorId: 0,
  accountIsDebit: 0,
  cashFlowTypeId: 0,
  isActive: 1,
  isDeleted: 0,
  createdBy: 1,
 createdOn: new Date(),
  lastUpdatedBy:1,
  lastUpdatedOn: '',
  //currency:{}
    //accountCostCenter: []
   
  };

  
  @Input()
  buttonTrigger!: boolean;
  buttonToggle: boolean = false;
id:number=0


  public Account={
  accountNo:null,
  nameL1:'',

  };

 



  ngOnChanges(changes: SimpleChanges) {
    if(this.parentData!=0){
      this.mainAccountId= this.accountFromParent.id
      this.mainAccountNo= this.accountFromParent.accountNo
      this.mainAccountNameL1=this.accountFromParent.nameL1
      this.tree.AccountTree(this.parentData).subscribe(result => {
        this.accountMain.accountDetail = result;         
        if (result.length > 0) {
        }else{
          for (let index = 0; index < Constants.inputsCount; index++) {      
            this.addItemDetail();
          }
        }
      }, error => console.error(error));
    }
    else{
      this.tree.AccountTreeNull().subscribe(result => {
        if (result !== null) {
          this.accountMain.accountDetail = result;         
        }
       }, error => console.error(error));
    }

  }

  GetChildsByParent(id:any,no:any,name:any){
    this.mainAccountId= id;
    this.mainAccountNo= no;
    this.mainAccountNameL1=name;
    this.tree.AccountTree(id).subscribe(result => {
      this.accountMain.accountDetail = result;         
      if (result.length > 0) {
      }else{
        for (let index = 0; index < Constants.inputsCount; index++) {      
          this.addItemDetail();
        }
      }
    }, error => console.error(error));
  }

  GetParent(id:any){
    this.tree.GetParent(id).subscribe((result)=>{
      
    console.log(result)
    if(result){
      
      this.mainAccountId= result.id;
    this.mainAccountNo= result.accountNo;
    this.mainAccountNameL1=result.nameL1;
    this.tree.AccountTree(result.id).subscribe(result => {
      this.accountMain.accountDetail = result;         
      if (result.length > 0) {
      }else{
        for (let index = 0; index < Constants.inputsCount; index++) {      
          this.addItemDetail();
        }
      }
    }, error => console.error(error));}
    else{
      this.mainAccountId= 0;
      this.mainAccountNo= '';
      this.mainAccountNameL1='';
      this.tree.AccountTreeNull().subscribe(result => {
        if (result !== null) {
          this.accountMain.accountDetail = result;         
        }
       }, error => console.error(error));
    }
    })
  }
  
  accountGetByAccountNo(AccountNo:any){
    if(AccountNo!=''){
    this.tree.GetAccountByCode(AccountNo).subscribe((result)=>{
      this.mainAccountId= result.id;
    this.mainAccountNo= result.accountNo;
    this.mainAccountNameL1=result.nameL1;
    this.tree.AccountTree(result.id).subscribe(result => {
      this.accountMain.accountDetail = result;         
      if (result.length > 0) {
      }else{
        for (let index = 0; index < Constants.inputsCount; index++) {      
          this.addItemDetail();
        }
      }
    }, error => console.error(error));
    }
    
    )}else{
      this.mainAccountId= 0;
    this.mainAccountNo= '';
    this.mainAccountNameL1='';
      this.tree.AccountTreeNull().subscribe(result => {
        if (result !== null) {
          this.accountMain.accountDetail = result;         
        }
       }, error => console.error(error));


    }
  }
  


  AccountGetById(id: any) {
    if (id) {
      
      this.tree.AccountTree(this.parentData).subscribe(result => {
        if (result !== null) {
         
       ///   this.accountMain.AccountMain = result;         
                 // to remove null console errors
        }
      }, error => console.error(error));
    }

  }


  removeItemDetail(index:number) {
    this.accountMain.accountDetail.splice(index, 1);
  }
  constructor(private tree:TreeService,private accService:AccountService,private alertify:AlertifyService, public utilityService: UtilityService) {
    this.textFilterModel = '';
  this.AccountRows= ['accountNo', 'nameL1','currencyName','accountTypeName','accountReportName','isCumulative','isCostCenter'];
  this.GetCurrency();
  this.GetsecurityGrade();
  this.GetAccountType();
  this.GetAccountReport();


   }


   AccountCreateUpdate(myForm:NgForm) {
    // force the UI validation to appear
    //myForm.form.markAllAsTouched();
    
    
    

    //if (this.Validate(myForm)) {
     // this.undefineObjectProperties();

      //if(this.voucherJournal.id == 0){         
      this.tree.CreateAccount(this.accountMain.accountDetail).
          subscribe(result => {

          this.alertify.success('تم الحفظ بنجاح')
          this.tree.AccountTree(this.parentData).subscribe(result => {
            this.accountMain.accountDetail = result;         
            if (result.length > 0) {
            }else{
              for (let index = 0; index < Constants.inputsCount; index++) {      
                this.addItemDetail();
              }
            }
          }, error => console.error(error));
        },  error => console.error(error));

      }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 
  addItemDetail(i?:number) {    
    this.newAccountDetail.parentId=this.parentData;
    this.newAccountDetail.currencyId=this.accountFromParent.currencyId;
    this.newAccountDetail.currencyName=this.accountFromParent.currencyName;
    this.newAccountDetail.securityGradeId=this.accountFromParent.securityGradeId;
    this.newAccountDetail.securityGradeName=this.accountFromParent.securityGradeName;
    this.newAccountDetail.accountReportId=this.accountFromParent.accountReportId;
    this.newAccountDetail.accountReportName=this.accountFromParent.accountReportName;
    this.newAccountDetail.accountTypeId=this.accountFromParent.accountTypeId;
    this.newAccountDetail.accountTypeName=this.accountFromParent.accountTypeName;



    if(i == undefined)
    {     
      this.accountMain.accountDetail.push(this.newAccountDetail);
    }
    else{      
      this.accountMain.accountDetail.splice(i + 1, 0, this.newAccountDetail);     
    }
    
    this.newAccountDetailOld = this.newAccountDetail;   
    this.newAccountDetail = {
      id: 0,
    code:0,

      nameL1: '',
      nameL2: '',
      accountNo: '',
      currencyId: 0,
      currencyName: '',
      isCumulative:0,
      isCostCenter:0,
      accountReportId:0,
      accountReportName:'',
      securityGradeId:0,
      securityGradeName:'',
      companyId: 0,
      parentId: 0,
      accountLevel: 0,
      accountTypeId: 0,
      accountTypeName: '',
      accountCategoryId: 0,
      currencyFactorId: 0,
      accountIsDebit: 0,
      cashFlowTypeId: 0,
      isActive: 1,
      isDeleted: 0,
      createdBy: 1,
      createdOn: new Date(),
      lastUpdatedBy:1,
      lastUpdatedOn: '',
     // currency:{}
    };

   
  }

  removeData(id:any,index:any) {
   
    this.alertify.confirm('هل انت متأكد من مسح هذا الحساب',() =>{
      this.Delete(id,index)
    })
 
  }
   Delete(id:any,index:any){
    if(id!=0){
      this.alertify.confirm('هل انت متأكد من مسح هذا الحساب',() =>{
        this.tree.DeleteAccount(id).subscribe(result => {
          this.accountMain.accountDetail.splice(index, 1);
         }, error => console.error(error));
      })
    }
    else{
      this.accountMain.accountDetail.splice(index, 1);
    }
  }


  // <----- currency modal ----->

  currencyIndex:number = -1;

setFocusCurrencyNo(t:any,index:number){
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
      this.utilityService.setFocus(t, inputElemet, this.newAccountDetailOld, this.AccountRows);  
    }
     this.newAccountDetailOld ={
      id: 0,
    code:0,

      nameL1: '',
      nameL2: '',
      accountNo: '',
      currencyId: 0,
      currencyName: '',
      isCumulative:0,
      isCostCenter:0,
      accountReportId:0,
      accountReportName:'',
      securityGradeId:0,
      securityGradeName:'',
      companyId: 0,
      parentId: 0,
      accountLevel: 0,
      accountTypeId: 0,
      accountTypeName:'',
      accountCategoryId: 0,
      currencyFactorId: 0,
      accountIsDebit: 0,
      cashFlowTypeId: 0,
      isActive: 1,
      isDeleted: 0,
      createdBy: 1,
      createdOn: new Date(),
      lastUpdatedBy:1,
      lastUpdatedOn: '',
      //currency:{}
    }   
}
  CurrencyIndex:number = -1;
  addCurrencyItem(id:number,currency:any){
      if(this.CurrencyIndex != -1)    
      {
        this.accountMain.accountDetail[this.CurrencyIndex].currencyId = currency.id;
        this.accountMain.accountDetail[this.CurrencyIndex].currencyName = currency.nameL1;
      }
    this.CurrencyIndex = -1;
  }
  


  displayCurrencyStyle = "none";

  GetCurrency()
  {    
    this.tree.currency().subscribe(result=>{
      this.currencyList = result;
      /*if(this.currencyList.length > 0)
      this.displayCurrencyStyle = "block";     */
    });
  }


 
  CurrencyOpenPopup(i?: number): void {
    this.displayCurrencyStyle = "block"; 
     if(i != undefined)
        this.CurrencyIndex = i;
    
  }

  CurrencyClosePopup(): void {
    this.displayCurrencyStyle = "none";    
  }
// <----- securityGrade modal ----->

securityGradeIndex:number = -1;

  addSecurityGradeItem(id:number,securityGrade:any){
      if(this.securityGradeIndex != -1)    
      {
        this.accountMain.accountDetail[this.securityGradeIndex].securityGradeId = securityGrade.id;
        this.accountMain.accountDetail[this.securityGradeIndex].securityGradeName = securityGrade.nameL1;
      }
    this.securityGradeIndex = -1;
  }
  


  displaysecurityGradeStyle = "none";

  GetsecurityGrade()
  {    
    this.tree.securityGrade().subscribe(result=>{
      console.log(1)
      this.securityGradeList = result;
      /*if(this.currencyList.length > 0)
      this.displayCurrencyStyle = "block";     */
    });
  }

  securityGradeOpenPopup(i?: number): void {
    this.displaysecurityGradeStyle = "block"; 
     if(i != undefined)
        this.securityGradeIndex = i;
  }

  securityGradeClosePopup(): void {
    this.displaysecurityGradeStyle = "none";    
  }
  // <----- AccountType modal ----->

  AccountTypeIndex:number = -1;

addAccountTypeItem(id:number,AccountType:any){
    if(this.AccountTypeIndex != -1)    
    {
      this.accountMain.accountDetail[this.AccountTypeIndex].accountTypeId = AccountType.id;
      this.accountMain.accountDetail[this.AccountTypeIndex].accountTypeName = AccountType.nameL1;
    }
  this.AccountTypeIndex = -1;
}



displayAccountTypeStyle = "none";

GetAccountType()
{    
  this.tree.AccountType().subscribe(result=>{
    console.log(result)
    this.AccountTypeList = result;
    /*if(this.currencyList.length > 0)
    this.displayCurrencyStyle = "block";     */
  });
}

AccountTypeOpenPopup(i?: number): void {
  this.displayAccountTypeStyle = "block"; 
   if(i != undefined)
      this.AccountTypeIndex = i;
}

AccountTypeClosePopup(): void {
  this.displayAccountTypeStyle = "none";    
}
// <----- AccountReport modal ----->

AccountReportIndex:number = -1;

addAccountReportItem(id:number,AccountReport:any){
    if(this.AccountReportIndex != -1)    
    {
      this.accountMain.accountDetail[this.AccountReportIndex].accountReportId = AccountReport.id;
      this.accountMain.accountDetail[this.AccountReportIndex].accountReportName = AccountReport.nameL1;
    }
  this.AccountReportIndex = -1;
}



displayAccountReportStyle = "none";

GetAccountReport()
{    
  this.tree.AccountReport().subscribe(result=>{
    console.log(result)
    this.AccountReportList = result;
    /*if(this.currencyList.length > 0)
    this.displayCurrencyStyle = "block";     */
  });
}

AccountReportOpenPopup(i?: number): void {
  this.displayAccountReportStyle = "block"; 
   if(i != undefined)
      this.AccountReportIndex = i;
}

AccountReportClosePopup(): void {
  this.displayAccountReportStyle = "none";    
}



}


