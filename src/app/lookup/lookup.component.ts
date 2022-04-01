import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Account } from '../interfaces/account.interface';
import { Lookup, LookupDetails } from '../interfaces/lookup.interface';
import { NameCommon } from '../interfaces/namecommon.interface';
import { AccountService } from '../services/account.service';
import { AlertifyService } from '../services/alertify.service';
import { LookupService } from '../services/lookup.service';
import { MenuService } from '../services/menu.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})
export class LookupComponent {
  @ViewChild('detailsBody') detailsBody!: ElementRef;
  textFilterModel:string;

  public lookup: Lookup = {
    id: 0, isActive: true, lookupDetails: [], isInserted: false, isUpdated: false, isDeleted: false,
    isSelected: false
  };
  public newLookup: Lookup = {
    id: 0, isActive: true, lookupDetails: [], isInserted: true, isUpdated: false, isDeleted: false,
    isSelected: false
  };
  public lookups: Lookup[] = [];
  public lookupsOriginal: Lookup[]=[];
  public lookupDetailsList: LookupDetails[] = [];
  public newLookupAccount: LookupDetails = { id: 0, lookupId: 0, valLink: 0, isActive: true, isDefault: false };

  public accountList:Account[] = [];
  public menuList:NameCommon[] = [];
  public menuDetailsList:NameCommon[] = [];


  constructor(private service: LookupService, private alertify: AlertifyService,public utilityService: UtilityService
    ,private accountService : AccountService,private menuService : MenuService) { 
    this.lookupGetAll();
    this.accountGetAll();
    this.menuGetAll();
    this.menuDetailsGetAll();
    this.textFilterModel = '';
  }

  

  lookupGetAll() {
    this.service.lookupGetAll().subscribe(result => {
      this.lookups = result;
      this.lookupsOriginal = result;
      this.lookupDetailsSelect(result[0]) 
      
      if(this.lookups && this.lookups.length == 0)
          this.addItem();

      
    }, error => { console.error(error);this.addItem();})
  };

  accountGetAll()
  {
    this.accountService.accountGetAll().subscribe(result=>{
      this.accountList = result;
    });
  }

  menuGetAll()
  {
    // this.menuService.menuGetAll().subscribe(result=>{
    //   this.menuList = result;
    // });
    this.menuList = this.menuService.menuGetAll();

  }
  
  menuDetailsGetAll()
  {
    //  this.menuService.menuGetAll().subscribe(result=>{
    //   this.menuDetailsList = result;
    // });
    this.menuDetailsList = this.menuService.menuGetAll();
  }

  undefineObjectProperties() {
    this.lookups.forEach(elookups => {
      elookups.lookupDetails.forEach(e => {
        e.account = undefined;
        e.accountId2Navigation = undefined;
      });
    });
  }

  lookupsCreateUpdate(myForm: NgForm) {
    myForm.form.markAllAsTouched();
    if (this.Validate(myForm)) {
      this.undefineObjectProperties();
      this.lookups = this.lookups.filter(b=>b.isInserted || b.isUpdated || b.isDeleted); 
      this.service.lookupAddEdit(this.lookups).subscribe(result=>{
        var temp = this.lookups;        
        this.lookups = result;
        this.lookupsOriginal = result;
        this.alertify.success('نجاح');
        this.isUpdate = true; 
        
        
        temp.forEach(eTemp => {
          this.lookups.forEach(elookup => {
            if (eTemp.id == elookup.id) {
              eTemp.lookupDetails = elookup.lookupDetails;
              return;
            }
          });
        });

        temp.filter(x => x.id == 0).forEach(eTemp => {
          this.lookups.forEach(elookup => {
            if (eTemp.nameL1 == elookup.nameL1 && eTemp.nameL2 == elookup.nameL2
              && eTemp.isActive == elookup.isActive
              && eTemp.lookupDetails.length == elookup.lookupDetails.length) {
              var isChildMatch = false;
              eTemp.lookupDetails.forEach(eTempSub => {
                elookup.lookupDetails.forEach(elookupSub => {
                  isChildMatch = false;
                  if (eTempSub.accountId == elookupSub.accountId &&
                    eTempSub.nameL1 == elookupSub.nameL1 && eTempSub.nameL2 == elookupSub.nameL2 &&
                    eTempSub.isActive == elookupSub.isActive) {
                    isChildMatch = true;
                    return;
                  }
                });
              });

              if (isChildMatch) {
                eTemp.id = elookup.id;
                eTemp.code = elookup.code;
                eTemp.lookupDetails = elookup.lookupDetails;
                return;
              }
            }
          });
        });

        if (temp.length > 0) {
          this.lookups = temp;
          this.lookupDetailsSelect(this.lookups[0]);
        }

      });
    }
  }

  lookupsJournalDelete(id: number) {    
    var isSuccess = false;
    if (id) {
      this.alertify.confirm('هل تريد حذف هذا البنك  ' + id,()=>{
        this.service.lookupDelete(id).subscribe(result => {
          isSuccess = result;
          this.utilityService.reloadComponent();
          this.alertify.success('تم الحذف');
        }, error => alert('Not Found'));
        
      });
      
    }
    return isSuccess;
  }

  public pageName = "بيانات الترميز";
  public isUpdate = false;
  lookupIsUpdateableToggle() {
    this.isUpdate = !this.isUpdate;
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  addItem(i?: number) {
    if (this.lookups === null) {
      this.lookups = [];
    }
    
    if (i == undefined) {
      this.lookups.push(this.newLookup);
    }
    else {
      this.lookups.splice(i + 1, 0, this.newLookup);
    }

    this.newLookup = { id: 0, isActive: true, lookupDetails: [], isInserted: true, isUpdated: false, isDeleted: false, 
    isSelected : false};
  }

  displayDetails = '';
  removeItem(i: number, item: Lookup) {    
    this.updatelookupIsChanged(item);
    if(item.isInserted == undefined || !item.isInserted)
    {    
      item.isDeleted = true;
    }
    else{
      this.lookups.splice(i, 1);
    }

    this.displayDetails = 'none';
  }


  addItemDetails(i?: number, focusIndex?:number) {
    this.newLookupAccount.lookupId = this.lookup.id;
    if (this.lookup.lookupDetails === null) {
      this.lookup.lookupDetails = [];
    }

    if (i == undefined) {
      this.lookup.lookupDetails.push(this.newLookupAccount);
      if(focusIndex != undefined)
        this.setFocusDetails(focusIndex);
      
    }
    else {
      this.lookup.lookupDetails.splice(i + 1, 0, this.newLookupAccount);
    }
    this.newLookupAccount = { id: 0, lookupId: 0, valLink: 0, isActive: true, isDefault: false };
    this.lookup.isUpdated = true;
  }

  removeItemDetails(i: number) {
    this.lookup.lookupDetails.splice(i, 1);
    this.lookup.isUpdated = true;
  }

  lookupDetailsSelect(lookup: Lookup) {
    this.displayDetails = '';
    this.lookup = lookup;
    if (lookup) {
      this.lookupDetailsList = lookup.lookupDetails;
      if (this.lookupDetailsList.length > 0) {
        this.lookupDetailsList.forEach(e => {
          if (!e.accountCode)
            e.accountCode = e.account?.accountNo;
          if (!e.accountCode2)
            e.accountCode2 = e.accountId2Navigation?.accountNo;       
        });
      }
    }
  }

  updatelookupIsChanged(item: any, isDetails?:boolean) {   
    if(isDetails == undefined || !isDetails){
      item.isUpdated = true;
    }
    else
    {
      this.lookup.isUpdated = true;
    } 
  }

  Validate(myForm: NgForm) {
    if (!myForm.valid) {
      this.alertify.error('يجب ملء الحقول الالزامية');
      return false;
    }       


    var isValidLookupDetails = true;

    var filterdlookups =  this.lookups.filter(b=>b.isUpdated || b.isInserted);    
    filterdlookups.forEach(elookup => {
      if (elookup.lookupDetails.length <= 0) {
        this.alertify.error('على الاقل ادخل بيانات واحدة فى تفاصيل بيانات الترميز !' + elookup.nameL1);
        isValidLookupDetails = false;
      }
    });

    if (!isValidLookupDetails) return false;    
    else {
      filterdlookups.forEach(elookup => {
        elookup.lookupDetails.forEach(e => {
          if ((!e.nameL1 || (e.valLink <= 0)) && isValidLookupDetails) {
            this.alertify.error('ادخل البيانات المفقوده فى ' + elookup.nameL1);
            isValidLookupDetails = false;
          }
        });
      });
    }

    if(!isValidLookupDetails) return false;

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
      if (element.hasChildNodes()) {
        element = element.childNodes[0];
        if (element.hasChildNodes())
          element = element.childNodes[0];
      }
      element.focus();
    }, 0);
  }


  // <--------------------------------------------------Modal------------------------------------->

  displayStyle = "none";  
  openPopup(): void {
    this.lookups = this.lookupsOriginal;
    this.displayStyle = "block";
    this.textFilterModel = '';    
  }

  closePopup(lookup?: Lookup): void {
    this.displayStyle = "none";
    if (lookup) {
      if (this.checkedList.length > 0) {
        this.lookupAddFromModal(lookup);
      }
    }
  }

  lookupAddFromModal(lookup: Lookup) {

    if (!this.checkedList || this.checkedList.length == 0) {
      this.lookups = this.lookups.filter(b => b.id == lookup.id);
    }
    else {
      var temp = [];
      for (var i = 0; i < this.lookups.length; i++) {
        if (this.lookups[i].isSelected)
          temp.push(this.lookups[i]);
      }
      this.lookups = temp;
      lookup = this.lookups[0];
    }
    this.lookupDetailsSelect(lookup);
  }

  // <-------------------------------------------------- Account modal --------------------------->
  displayAccountStyle = "none";
  AccountOpenPopup(i?: number, isAccount2?: boolean): void {
    this.textFilterModel = '';
    this.displayAccountStyle = "block";
    if (i != undefined)
      this.accountIndex = i;
    
    if(isAccount2)
      this.isAccount2 = true;
    else
      this.isAccount2 = false;
  }

  AccountClosePopup(): void {
    this.displayAccountStyle = "none";
  }

  accountIndex: number = -1;
  isAccount2?: boolean;
  addAccountItem(acc: any) {
    if (this.accountIndex != -1) {
      if (this.isAccount2) {
        this.lookup.lookupDetails[this.accountIndex].accountId2 = acc.id;
        this.lookup.lookupDetails[this.accountIndex].accountCode2 = acc.accountNo;

      } else {
        this.lookup.lookupDetails[this.accountIndex].accountId = acc.id;
        this.lookup.lookupDetails[this.accountIndex].accountCode = acc.accountNo;

      }
    }
    else {
      if (this.isAccount2) {
        this.newLookupAccount.accountId2 = acc.id;
        this.newLookupAccount.accountCode2 = acc.accountNo;
      } else {
        this.newLookupAccount.accountId = acc.id;
        this.newLookupAccount.accountCode = acc.accountNo;
      }
      var indexToFocus = (this.isAccount2)? 12 : 11;
      this.addItemDetails(undefined, indexToFocus);
    }
    this.accountIndex = -1;
  }

  addAccountItemByAccountNo(accountNo: string, i?: number, isAccount2?: boolean) {

    this.accountService.accountGetByAccountNo(accountNo).subscribe(result => {
      if (result) {
        if (i !== undefined) {
          if (isAccount2) {
            this.lookup.lookupDetails[i].accountId2 = result.id;
            this.lookup.lookupDetails[i].accountCode2 = result.accountNo;
          }
          else {
            this.lookup.lookupDetails[i].accountId = result.id;
            this.lookup.lookupDetails[i].accountCode = result.accountNo;
          }

        }
        else {
          if (isAccount2) {
            this.newLookupAccount.accountId2 = result.id;
            this.newLookupAccount.accountCode2 = result.accountNo;
          }
          else {
            this.newLookupAccount.accountId = result.id;
            this.newLookupAccount.accountCode = result.accountNo;
          }
          var indexToFocus = (isAccount2)? 12 : 11;
          this.addItemDetails(undefined, indexToFocus);
        }
      }
      else if (i !== undefined) {
        if (isAccount2) {
          this.lookup.lookupDetails[i].accountId2 = undefined;
          this.lookup.lookupDetails[i].accountCode2 = '';
        }
        else {
          this.lookup.lookupDetails[i].accountId = undefined;
          this.lookup.lookupDetails[i].accountCode = '';
        }

      }
      else {
        if (isAccount2) {
          this.newLookupAccount.accountCode2 = '';
        }
        else {
          this.newLookupAccount.accountCode = '';
        }
      }

    });


  }



  // <-------------------------------------------------- Menu modal --------------------------->
  displayMenuStyle = "none";
  MenuOpenPopup(i?: number, isMenuInDtl?: boolean): void {
    this.textFilterModel = '';
    this.displayMenuStyle = "block";
    if (i != undefined)
      this.menuIndex = i;
    
    if(isMenuInDtl)
      this.isMenuInDtl = true;
    else
      this.isMenuInDtl = false;
  }

  MenuClosePopup(): void {
    this.displayMenuStyle = "none";
  }

  menuIndex: number = -1;
  isMenuInDtl?: boolean;
  addMenuItem(item: any) {
    if (this.menuIndex != -1) {
      if (this.isMenuInDtl) {
        this.lookup.lookupDetails[this.menuIndex].valLink = item.id;
        this.lookup.lookupDetails[this.menuIndex].valLinkCode = item.code;
        this.lookup.lookupDetails[this.menuIndex].valLinkName = item.nameL1;

      } else {
        this.lookups[this.menuIndex].parentId = item.id;
        this.lookups[this.menuIndex].parentCode = item.code;
        this.lookups[this.menuIndex].parentName = item.nameL1;

      }
    }
    else {
      if (this.isMenuInDtl) {
        this.newLookupAccount.valLink = item.id;
        this.newLookupAccount.valLinkCode = item.code;
        this.newLookupAccount.valLinkName = item.nameL1;  
      } 

      this.addItemDetails(undefined, 6);
    }
    this.menuIndex = -1;
  }

  addMenuItemByMenuNo(code: string, i?: number, isMenuInDtl?: boolean) {

    // this.accountService.accountGetByAccountNo(accountNo).subscribe(result => {
      var result = this.menuService.menuGetByCode(code);  
      if (result && result.length > 0) {
        if (i !== undefined) {
          if (isMenuInDtl) {
            this.lookup.lookupDetails[i].valLink = result[0].id;
            this.lookup.lookupDetails[i].valLinkCode = result[0].code;
            this.lookup.lookupDetails[i].valLinkName = result[0].nameL1;            
          }
          else {           
            this.lookups[i].parentId =  result[0].id;
            this.lookups[i].parentCode =  result[0].code;
            this.lookups[i].parentName =  result[0].nameL1;
          }

        }
        else {
          if (isMenuInDtl) {
            this.newLookupAccount.valLink = result[0].id;
            this.newLookupAccount.valLinkCode = result[0].code;
            this.newLookupAccount.valLinkName = result[0].nameL1;
          }          
          this.addItemDetails(undefined, 6);
        }
      }
      else if (i !== undefined) {
        if (isMenuInDtl) {
          this.lookup.lookupDetails[i].valLink = 0;
          this.lookup.lookupDetails[i].valLinkCode = undefined;
          this.lookup.lookupDetails[i].valLinkName = undefined;
        }
        else {
          this.lookups[i].parentId = undefined;
          this.lookups[i].parentCode = undefined;
          this.lookups[i].parentName = '';
        }

      }
      else {
        if (isMenuInDtl) {
          this.newLookupAccount.valLinkCode = undefined;
        }        
      }

    // });


  }



  // <-------------------------------------------------- Menu Details modal --------------------------->
  displayMenuDetailsStyle = "none";
  MenuDetailsOpenPopup(i?: number): void {
    this.textFilterModel = '';
    this.displayMenuDetailsStyle = "block";
    if (i != undefined)
      this.menuDetailsIndex = i;       
  }

  MenuDetailsClosePopup(): void {
    this.displayMenuDetailsStyle = "none";
  }

  menuDetailsIndex: number = -1;
  MenuDetailsItem(item: any) {
    if (this.menuDetailsIndex != -1) {
      this.lookups[this.menuDetailsIndex].parentIdDtl = item.id;
      this.lookups[this.menuDetailsIndex].parentCodeDtl = item.code;
      this.lookups[this.menuDetailsIndex].parentNameDtl = item.nameL1;
    }    

    this.menuDetailsIndex = -1;
  }

  addMenuDetailsItemByMenuDetailsNo(code: string, i?: number) {

    // this.menuService.menuGetByCode(code).subscribe(result => {
    var result = this.menuService.menuGetByCode(code);
      if (result && result.length > 0) {
        if (i !== undefined) {  
          this.lookups[i].parentIdDtl = result[0].id;
          this.lookups[i].parentCodeDtl = result[0].code;
          this.lookups[i].parentNameDtl = result[0].nameL1;
        }        
      }
      else if (i !== undefined) {        
        this.lookups[i].parentIdDtl = undefined;
        this.lookups[i].parentCodeDtl = undefined;
        this.lookups[i].parentNameDtl = '';
      }
      else{
        this.newLookup.parentCodeDtl = undefined;
      }
    // });
  }



//checkbox
masterSelected: boolean = false;
checkedList: any ;


 // The master checkbox will check/ uncheck all items
 checkUncheckAll() {
  for (var i = 0; i < this.lookups.length; i++) {
    this.lookups[i].isSelected = this.masterSelected;
  }
  this.getCheckedItemList();
}

// Check All Checkbox Checked
isAllSelected() {
  this.masterSelected = this.lookups.every(function(item:any) {
      return item.isSelected == true;
    })

  this.getCheckedItemList();
}

// Get List of Checked Items
getCheckedItemList(){
  this.checkedList = [];
  for (var i = 0; i < this.lookups.length; i++) {
    if(this.lookups[i].isSelected)
    this.checkedList.push(this.lookups[i].id);
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
