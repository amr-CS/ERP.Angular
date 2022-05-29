//#region
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Lookup, LookupDetails } from '../interfaces/lookup.interface';
import { LookupService } from '../services/lookup.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { lookupDto } from '../Dto/LookupDto';
import { lookupDetailsDto } from '../Dto/LookupDetailsDto';
import { AlertifyService } from '../services/alertify.service';
import { CurrencyService } from '../services/currency.service';
import { forkJoin } from 'rxjs';
import { Currency } from '../interfaces/currency.interface.';
import { CurrencyDto } from '../Dto/CurrencyDto';
import { AccountService } from '../services/account.service';
import { Account } from '../interfaces/account.interface';
import { AccountDto } from '../Dto/AccountDto';
import { AddEditCategoriesAccDto } from '../Dto/AddEditCategoriesAccDto';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CategoriesAccService } from '../services/CategoriesAcc.service';
import { CategoriesAcclistDto } from '../Dto/CategoriesAcclistDto';
import { CategoriesAccListDto } from '../interfaces/CategoriesAccListDto';
//#endregion
@Component({
  selector: 'app-account-category',
  templateUrl: './account-category.component.html',
  styleUrls: ['./account-category.component.css'],
})
export class AccountCategoryComponent implements OnInit {
  //#region declare properities here
  form = new FormGroup({
    compId: new FormControl(0, Validators.required),
    catId: new FormControl(0, Validators.required),
    curId: new FormControl(0, Validators.required),
    branchId: new FormControl(0, Validators.required),
    //catAccId: new FormControl(0, Validators.required),
    catTaxAccId: new FormControl(null),
    catSellAccId: new FormControl(null),
    catBackBuyAccId: new FormControl(null),
    catBackSellAccId: new FormControl(null),
    catCostAccId: new FormControl(null),
    catDiscAccId: new FormControl(null),
    catInDiscAccId: new FormControl(null),
    username: new FormControl(null),
    timestamp: new FormControl(new Date()),
    createdOn: new FormControl(new Date()),
    lastUpdatedOn: new FormControl(null),
    createdBy: new FormControl(null),
    lastUpdatedBy: new FormControl(null),
    vatDebitAccId: new FormControl(null),
    vatCreditAccId: new FormControl(null),
    isDeleted: new FormControl(false),
  });
  addEditCategoriesAcc: AddEditCategoriesAccDto | undefined;
  displayAccountStyle = 'none';
  textFilterModel = '';
  pageName: string = 'فئة الحسابات';
  myForm: any;
  id: any;
  AccountNum: string = '';
  storeCode: number = 0;
  storeName: string = '';
  lookupDetailsList: LookupDetails[] = [];
  modalRef!: BsModalRef;
  isDateFilter = false;
  lookupItem: lookupDto = new lookupDto();
  lookupItemDetails: lookupDetailsDto = new lookupDetailsDto();
  currencyName: string = '';
  currencyList: Currency[] = [];
  currencyItem: CurrencyDto = new CurrencyDto();
  accountList: Account[] = [];
  catAcc: AccountDto = new AccountDto();
  catSellAcc: AccountDto = new AccountDto();
  catBackBuyAcc: AccountDto = new AccountDto();
  catDiscAcc: AccountDto = new AccountDto();
  catInDiscAcc: AccountDto = new AccountDto();
  catTaxAcc: AccountDto = new AccountDto();
  catCostAcc: AccountDto = new AccountDto();
  catBackSellAcc: AccountDto = new AccountDto();
  vatDebitAcc: AccountDto = new AccountDto();
  vatCreditAcc: AccountDto = new AccountDto();
  catGroupAcc:AccountDto=new AccountDto();
  typeId: number = 0;
  list: CategoriesAcclistDto[] = [];
  itemId: number = 0;
  index: number =0;
  //#endregion
  constructor(
    private lookupServ: LookupService,
    private modalService: BsModalService,
    private alertify: AlertifyService,
    private currencyServ: CurrencyService,
    private accountServ: AccountService,
    private categoriesAccServ: CategoriesAccService
  ) {}

  ngOnInit(): void {
   this.addNewRow();
    forkJoin([
      this.lookupServ.lookupDetailsGetById(114).subscribe(
        (res) => {
          this.lookupDetailsList = res;
        },
        (err) => console.log(err)
      ),
      this.currencyServ.currencyGetAll().subscribe(
        (res) => (this.currencyList = res),
        (err) => console.log(err)
      ),
      this.accountServ.accountGetAll().subscribe(
        (res) => (this.accountList = res),
        (err) => console.log(err)
      ),
    ]);
  }
  //#region  using in utilities
  openPopup() {}
  SaveChanges() {
    console.log("heba");
    console.log(this.list);
    this.categoriesAccServ.AddEditCategoriesAcc(this.list).subscribe(
      (res)=>{console.log(res),this.alertify.success(" تم الحفظ بنجاح")},
      (err)=>console.log(err)
    )
  }
  invoiceDelete(id: any) {}
  //#endregion
  openModal(template: TemplateRef<any>, type?: number) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-dialog-scrollable',
    });
    if (type !== undefined) {
      this.typeId = type;
    }
    this.textFilterModel = '';
    this.isDateFilter = false;
  }
  lookupDetailsGetBylookupId(code: any,index?:number) {
    this.index=index!=undefined?index:0;
    debugger;
    let item = this.lookupDetailsList.find((s) => s.code == code);
    console.log(item);
    this.lookupItemDetails.code = item?.code;
    this.lookupItemDetails.nameL1 = item?.nameL1;
    if (item?.id !== null) {
      let itmId = item?.id == null ? 0 : item.id;
      this.lookupItemDetails.id = itmId;
    } else {
      this.alertify.error('لا يوجد فئة بذلك الرقم');
    }
  }

  filterListByDate() {
    this.textFilterModel = '';
    this.isDateFilter = true;
  }
  //1:category 2:currency 3:account
  getItem(item: any, type: number, col?: number) {
    debugger;
    this.itemId = item.id;
    switch (type) {
      case 1:
        this.lookupItemDetails = item;
        //this.addNewRow();
        this.form.get('catId')?.setValue(this.lookupItemDetails.id);
        this.list[this.list.length-1].catId=item.id;
        this.list[this.list.length-1].catCode=item.code;
        this.getCategoriesAccounByCatId();
        break;
      case 2:
        //this.currencyItem = item;
        this.form.get('curId')?.setValue(item.id);
        this.form.get('branchId')?.setValue(1);
        this.form.get('compId')?.setValue(1);
        this.list[this.list.length-1].curCode=item.code;
        this.list[this.list.length-1].curName=item.nameL1;
        this.list[this.list.length-1].curId=item.id;
       // this.list[this.list.length-1].branchId=1;

        break;
      case 3:
        if (this.typeId == 0) {
          this.catAcc = item;
          this.form.get('catId')?.setValue(this.catAcc.id);


        } else if (this.typeId == 1) {
          this.catSellAcc = item;
          this.form.get('catSellAccId')?.setValue(this.catSellAcc.id);
        this.list[this.list.length-1].catSellAccNumber=item.accountNo;
        this.list[this.list.length-1].catSellAccId=item.id;

        } else if (this.typeId == 2) {
          this.catBackBuyAcc = item;
          this.form.get('catBackBuyAccId')?.setValue(this.catBackBuyAcc.id);
        this.list[this.list.length-1].catBackBuyAccNumber=item.accountNo;
        this.list[this.list.length-1].catBackBuyAccId=item.id;

        } else if (this.typeId == 3) {
          this.catDiscAcc = item;
          this.form.get('catDiscAccId')?.setValue(this.catDiscAcc.id);
        this.list[this.list.length-1].catDiscAccNumber=item.accountNo;
        this.list[this.list.length-1].catDiscAccId=item.id;

        } else if (this.typeId == 4) {
          this.catInDiscAcc = item;
          this.form.get('catInDiscAccId')?.setValue(this.catInDiscAcc.id);
        this.list[this.list.length-1].catInDiscAccNumber=item.accountNo;
        this.list[this.list.length-1].catInDiscAccId=item.id;


        } else if (this.typeId == 5) {
          this.catTaxAcc = item;
          this.form.get('catTaxAccId')?.setValue(this.catTaxAcc.id);
        this.list[this.list.length-1].catTaxAccNumber=item.accountNo;
        this.list[this.list.length-1].catTaxAccId=item.id;


        } else if (this.typeId == 10) {
        this.catCostAcc = item;
        this.form.get('catCostAccId')?.setValue(this.catCostAcc.id);
        this.list[this.list.length-1].catCostAccNumber=item.accountNo;
        this.list[this.list.length-1].catCostAccId=item.id;


        } else if (this.typeId == 9) {
          this.catBackSellAcc = item;
          this.form.get('catBackSellAccId')?.setValue(this.catBackSellAcc.id);
        this.list[this.list.length-1].catBackSellAccNumber=item.accountNo;
        this.list[this.list.length-1].catBackSellAccId=item.id;


        } else if (this.typeId == 6) {
          this.vatDebitAcc = item;
          this.form.get('vatDebitAccId')?.setValue(this.vatDebitAcc.id);
        this.list[this.list.length-1].vatDebitAccNumber=item.accountNo ;
        this.list[this.list.length-1].vatDebitAccId=item.id;


        } else if (this.typeId == 7) {
          this.vatCreditAcc = item;
          this.form.get('vatCreditAccId')?.setValue(this.vatCreditAcc.id);
        this.list[this.list.length-1].vatCreditAccNumber=item.accountNo;
        this.list[this.list.length-1].vatCreditAccId=item.id;


        }else if (this.typeId == 8) {
          this.catGroupAcc = item;
          this.form.get('catGroupAccId')?.setValue(this.catGroupAcc.id);
        this.list[this.list.length-1].catGroupAccNumber=this.catGroupAcc.accountNo;
        this.list[this.list.length-1].catGroupAccId=item.id;


        }

        break;
      default:
        console.log('No such day exists!');
        break;
    }
  }
  getCategoriesAccounByCatId() {
    this.categoriesAccServ.GetCategoriesAccountByCatId(this.itemId).subscribe(
      (res) => {
        if(res.length>0){
          this.list = res;
          this.catCostAcc.accountNo=res[0].catCostAccNumber;
          this.catGroupAcc.accountNo=res[0].catGroupAccNumber;
          this.catBackSellAcc.accountNo=res[0].catBackSellAccNumber;
          this.catGroupAcc.id=res[0].catGroupAccId;
          this.catCostAcc.id=res[0].catCostAccId;
          this.catBackSellAcc.id=res[0].catBackSellAccId;
         console.log(res);
        }else{
          this.list=[];
          this.addNewRow();
          // this.addNewRow();
        }

      },
      (err) => console.log(err)
    );  }
  addNewRow() {
   var dto: CategoriesAcclistDto = new CategoriesAcclistDto();
    dto.catAccId = 0;
    dto.branchId=1;
    dto.compId=1;
    dto.catGroupAccId=12;
    //dto.catGroupAccId=this.catGroupAcc.id;
    dto.catCostAccId=this.catCostAcc.id;
    dto.catBackSellAccId=this.catBackSellAcc.id;
    dto.catCostAccNumber=this.catCostAcc.accountNo;
    dto.catGroupAccNumber="1.1.1.7";
    dto.catId=this.lookupItemDetails.id;
    //dto.catGroupAccNumber=this.catGroupAcc.accountNo;

    dto.catBackSellAccNumber=this.catBackSellAcc.accountNo;
      this.list.push(dto);
      console.log(this.list.length)
     // this.list[]


  }
}
