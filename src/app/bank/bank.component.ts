import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Account } from '../interfaces/account.interface';
import { Bank, BankAccount } from '../interfaces/bank.interface';
import { AccountService } from '../services/account.service';
import { AlertifyService } from '../services/alertify.service';
import { BankAccountService } from '../services/bankaccount.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent {

  textFilterModel:string;

  public bank: Bank = { id: 0, isActive: false, bankAccount: [], isChanged: false };
  public newBank: Bank = { id: 0, isActive: false, bankAccount: [], isChanged: false };
  public banks: Bank[] = [];
  public bankAccountList: BankAccount[] = [];
  public newBankAccount: BankAccount = { id: 0, bankId: 0, accountId: 0, isActive: false };

  public accountList:Account[] = [];
  
  constructor(private service: BankAccountService, private alertify: AlertifyService,public utilityService: UtilityService
    ,private accountService: AccountService) {
    this.bankGetAll();
    this.accountGetAll();
    this.textFilterModel = '';
  }

  bankGetAll() {
    this.service.bankGetAll().subscribe(result => {
      this.banks = result;
      this.bankAccountsSelect(result[0])
      console.log(this.banks);
    }, error => console.error(error))
  };

  accountGetAll()
  {
    this.accountService.accountGetAll().subscribe(result=>{
      this.accountList = result;
    });
  }

  // bankAccountsGetById(id: number) {
  //   this.service.bankAccountsGetById(id).subscribe(result => {
  //     this.bankAccountList = result;
  //   }, error => console.error(error))
  // };

  banksCreateUpdate(myForm: NgForm) {
    myForm.form.markAllAsTouched();
    if (this.Validate(myForm)) {
      this.service.bankAddEdit(this.banks);
    }
  }

  banksJournalDelete(id: number) {    
    var isSuccess = false;
    if (id) {
      this.alertify.confirm('هل تريد حذف هذا البنك  ' + id,()=>{
        this.service.bankDelete(id).subscribe(result => {
          isSuccess = result;
          this.utilityService.reloadComponent();
          this.alertify.success('تم الحذف');
        }, error => alert('Not Found'));
        
      });
      
    }
    return isSuccess;
  }

  public pageName = "البنوك";
  public isUpdate = false;
  bankIsUpdateableToggle() {
    this.isUpdate = !this.isUpdate;
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  addItem(i: number) {
    if (this.banks === null) {
      this.banks = [];
    }

    if (i == undefined) {
      this.banks.push(this.newBank);
    }
    else {
      this.banks.splice(i + 1, 0, this.newBank);
    }

    this.newBank = { id: 0, isActive: false, bankAccount: [], isChanged: false };
  }

  removeItem(i: number) {
    this.updateBankIsChanged();
    this.banks.splice(i, 1);
  }


  addItemDetails(i?: number) {
    this.newBankAccount.bankId = this.bank.id;
    if (this.bank.bankAccount === null) {
      this.bank.bankAccount = [];
    }

    if (i == undefined) {
      this.bank.bankAccount.push(this.newBankAccount);
    }
    else {
      this.bank.bankAccount.splice(i + 1, 0, this.newBankAccount);
    }
    this.newBankAccount = { id: 0, bankId: 0, accountId: 0, isActive: false };
  }

  removeItemDetails(i: number) {
    this.bank.bankAccount.splice(i, 1);
  }

  bankAccountsSelect(bank: Bank) {
    this.bank = bank;
    this.bankAccountList = bank.bankAccount;
  }

  updateBankIsChanged() {
    var currentBank = this.banks.filter(b => b.id == this.bank.id);
    currentBank[0].isChanged = true;
    console.log(currentBank[0].isChanged);
  }


  
  


  Validate(myForm: NgForm) {
    if (!myForm.valid) {
      this.alertify.error('يجب ملء الحقول الالزامية');
      return false;
    }    
    // if(this.banks.bankAccount == null || this.banks.bankAccount.length < 1)
    // {     

    //   this.alertify.error('على الاقل ادخل بيانات واحدة فى التفاصيل !');
    //   return false;
    // }

    return true;
  }


  printReportJV(i: number)
  {

  }

  GetNextIndex(){


  }

  GetPrevIndex(){

  }

  GetLast(){

  }

  GetFirst(){
    
  }


  // <--------------------------------------------------Modal------------------------------------->

  displayStyle = "none";  
  openPopup(): void {
    this.displayStyle = "block";
    this.textFilterModel = '';    
  }

  closePopup(): void {
    this.displayStyle = "none";       
  }

  bankAddFromModal(bank:Bank){

    
  }

  // <-------------------------------------------------- Account modal --------------------------->
  displayAccountStyle = "none";
  AccountOpenPopup(i?: number): void {
    this.textFilterModel = '';    
    this.displayAccountStyle = "block"; 
     if(i != undefined)
        this.accountIndex = i;
    
  }

  AccountClosePopup(): void {
    this.displayAccountStyle = "none"; 
      
  }

  accountIndex:number = -1;

  addAccountItem(acc : any)
  {
    if(this.accountIndex != -1)    
    {
      this.bank.bankAccount[this.accountIndex].accountId = acc.id;
      this.bank.bankAccount[this.accountIndex].accountCode = acc.accountNo;
      this.bank.bankAccount[this.accountIndex].accountName = acc.nameL1;
      
    }
    else {      
      this.newBankAccount.accountId = acc.id ;
      this.newBankAccount.accountCode = acc.accountNo ;
      this.newBankAccount.accountName = acc.nameL1 ;

      this.addItemDetails();                 
    }   
    this.accountIndex = -1;
  }

  addAccountItemByAccountNo(accountNo:string, i?:number){  
 
    this.accountService.accountGetByAccountNo(accountNo).subscribe(result=>{        
        if(result){        
          if(i !== undefined)    
          {               
            this.bank.bankAccount[i].accountId = result.id;
            this.bank.bankAccount[i].accountCode = result.accountNo;
            this.bank.bankAccount[i].accountName = result.nameL1;            
          }      
          else {
            this.newBankAccount.accountId = result.id ;
            this.newBankAccount.accountCode = result.accountNo ;
            this.newBankAccount.accountName = result.nameL1 ;                   
            this.addItemDetails();                         
        }
      }
      else if(i !== undefined)
      {     
        this.bank.bankAccount[i].accountId = 0; 
        this.bank.bankAccount[i].accountCode = '';
        this.bank.bankAccount[i].accountName = '' ;           
      }
      else
      {
        this.newBankAccount.accountCode = '';
      }
    
    });  
  
  
  }
}



