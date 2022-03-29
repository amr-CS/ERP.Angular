import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('detailsBody') detailsBody!: ElementRef;

  textFilterModel:string;

  public bank: Bank = {
    id: 0, isActive: true, bankAccount: [], isInserted: false, isUpdated: false, isDeleted: false,
    isSelected: false
  };
  public newBank: Bank = {
    id: 0, isActive: true, bankAccount: [], isInserted: true, isUpdated: false, isDeleted: false,
    isSelected: false
  };
  public banks: Bank[] = [];
  public banksOriginal: Bank[]=[];
  public bankAccountList: BankAccount[] = [];
  public newBankAccount: BankAccount = { id: 0, bankId: 0, accountId: 0, isActive: true };

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
      this.banksOriginal = result;
      this.bankAccountsSelect(result[0]) 
      
      if(this.banks && this.banks.length == 0)
          this.addItem();

      
    }, error => { console.error(error);this.addItem();})
  };

  accountGetAll()
  {
    this.accountService.accountGetAll().subscribe(result=>{
      this.accountList = result;
    });
  }

  undefineObjectProperties() {
     this.banks.forEach(eBanks => {
      eBanks.bankAccount.forEach(e => {
         e.account = undefined;                
       });      
    });    
  }

  banksCreateUpdate(myForm: NgForm) {
    myForm.form.markAllAsTouched();
    if (this.Validate(myForm)) {
      this.undefineObjectProperties();
      this.banks = this.banks.filter(b=>b.isInserted || b.isUpdated || b.isDeleted); 
      this.service.bankAddEdit(this.banks).subscribe(result=>{
        var temp = this.banks;        
        this.banks = result;
        this.banksOriginal = result;
        this.alertify.success('نجاح');
        this.isUpdate = true; 
        
        
        temp.forEach(eTemp => {
          this.banks.forEach(eBank => {
            if (eTemp.id == eBank.id) {
              eTemp.bankAccount = eBank.bankAccount;
              return;
            }
          });
        });

        temp.filter(x => x.id == 0).forEach(eTemp => {
          this.banks.forEach(eBank => {
            if (eTemp.nameL1 == eBank.nameL1 && eTemp.nameL2 == eBank.nameL2
              && eTemp.isActive == eBank.isActive
              && eTemp.bankAccount.length == eBank.bankAccount.length) {
              var isChildMatch = false;
              eTemp.bankAccount.forEach(eTempSub => {
                eBank.bankAccount.forEach(eBankSub => {
                  isChildMatch = false;
                  if (eTempSub.accountId == eBankSub.accountId &&
                    eTempSub.nameL1 == eBankSub.nameL1 && eTempSub.nameL2 == eBankSub.nameL2 &&
                    eTempSub.isActive == eBankSub.isActive) {
                    isChildMatch = true;
                    return;
                  }
                });
              });

              if (isChildMatch) {
                eTemp.id = eBank.id;
                eTemp.code = eBank.code;
                eTemp.bankAccount = eBank.bankAccount;
                return;
              }
            }
          });
        });

        if (temp.length > 0) {
          this.banks = temp;
          this.bankAccountsSelect(this.banks[0]);
        }

      });
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

  addItem(i?: number) {
    if (this.banks === null) {
      this.banks = [];
    }
    
    if (i == undefined) {
      this.banks.push(this.newBank);
    }
    else {
      this.banks.splice(i + 1, 0, this.newBank);
    }

    this.newBank = { id: 0, isActive: true, bankAccount: [], isInserted: true, isUpdated: false, isDeleted: false, 
    isSelected : false};
  }

  displayDetails = '';
  removeItem(i: number, item: Bank) {    
    this.updateBankIsChanged(item);
    if(item.isInserted == undefined || !item.isInserted)
    {    
      item.isDeleted = true;
    }
    else{
      this.banks.splice(i, 1);
    }

    this.displayDetails = 'none';
  }


  addItemDetails(i?: number, focusIndex?:number) {
    this.newBankAccount.bankId = this.bank.id;
    if (this.bank.bankAccount === null) {
      this.bank.bankAccount = [];
    }

    if (i == undefined) {
      this.bank.bankAccount.push(this.newBankAccount);
      if(focusIndex != undefined)
        this.setFocusDetails(focusIndex);
      
    }
    else {
      this.bank.bankAccount.splice(i + 1, 0, this.newBankAccount);
    }
    this.newBankAccount = { id: 0, bankId: 0, accountId: 0, isActive: true };
    this.bank.isUpdated = true;
  }

  removeItemDetails(i: number) {
    this.bank.bankAccount.splice(i, 1);
    this.bank.isUpdated = true;
  }

  bankAccountsSelect(bank: Bank) {
    this.displayDetails = '';
    this.bank = bank;
    if (bank) {
      this.bankAccountList = bank.bankAccount;
      if (this.bankAccountList.length > 0) {
        this.bankAccountList.forEach(e => {
          if (!e.accountCode)
            e.accountCode = e.account?.accountNo;
          if (!e.accountName)
            e.accountName = e.account?.nameL1;
        });
      }
    }
  }

  updateBankIsChanged(item: any, isDetails?:boolean) {   
    if(isDetails == undefined || !isDetails){
      item.isUpdated = true;
    }
    else
    {
      this.bank.isUpdated = true;
    }

    
  }


  
  Validate(myForm: NgForm) {
    if (!myForm.valid) {
      this.alertify.error('يجب ملء الحقول الالزامية');
      return false;
    }       


    var isValidBankAccounts = true;

    var filterdBanks =  this.banks.filter(b=>b.isUpdated || b.isInserted);    
    filterdBanks.forEach(eBank => {
      if (eBank.bankAccount.length <= 0) {
        this.alertify.error('على الاقل ادخل بيانات واحدة فى تفاصيل بنك !' + eBank.nameL1);
        isValidBankAccounts = false;
      }
    });

    if (!isValidBankAccounts) return false;    
    else {
      filterdBanks.forEach(eBank => {
        eBank.bankAccount.forEach(e => {
          if ((!e.nameL1 || e.accountId <= 0) && isValidBankAccounts) {
            this.alertify.error('ادخل البيانات المفقوده فى ' + eBank.nameL1);
            isValidBankAccounts = false;
          }
        });
      });
    }

    if(!isValidBankAccounts) return false;

    return true;
  }


  printReportJV(i: number)
  {

  }

  setFocusDetails(i: number) {
    setTimeout(() => {
      var t = this.detailsBody.nativeElement;
      var length = t.children.length;
      var element = t.childNodes[length - 1].childNodes[i].childNodes[0];
      element.focus();
    }, 0);
  }


  // <--------------------------------------------------Modal------------------------------------->

  displayStyle = "none";  
  openPopup(): void {
    this.banks = this.banksOriginal;
    this.displayStyle = "block";
    this.textFilterModel = '';    
  }

  closePopup(bank?: Bank): void {
    this.displayStyle = "none";
    if (bank) {
      if (this.checkedList.length > 0) {
        this.bankAddFromModal(bank);
      }
    }
  }

  bankAddFromModal(bank: Bank) {

    if (!this.checkedList || this.checkedList.length == 0) {
      this.banks = this.banks.filter(b => b.id == bank.id);
    }
    else {
      var temp = [];
      for (var i = 0; i < this.banks.length; i++) {
        if (this.banks[i].isSelected)
          temp.push(this.banks[i]);
      }
      this.banks = temp;
      bank = this.banks[0];
    }
    this.bankAccountsSelect(bank);
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

      this.addItemDetails(undefined,5);                 
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
            this.addItemDetails(undefined,5);                         
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

//checkbox
masterSelected: boolean = false;
checkedList: any ;


 // The master checkbox will check/ uncheck all items
 checkUncheckAll() {
  for (var i = 0; i < this.banks.length; i++) {
    this.banks[i].isSelected = this.masterSelected;
  }
  this.getCheckedItemList();
}

// Check All Checkbox Checked
isAllSelected() {
  this.masterSelected = this.banks.every(function(item:any) {
      return item.isSelected == true;
    })

  this.getCheckedItemList();
}

// Get List of Checked Items
getCheckedItemList(){
  this.checkedList = [];
  for (var i = 0; i < this.banks.length; i++) {
    if(this.banks[i].isSelected)
    this.checkedList.push(this.banks[i].id);
  }
}


GetNextIndex(){


}

GetPrevIndex(){

}

GetLast(){

}

GetFirst(){
  
}










}






