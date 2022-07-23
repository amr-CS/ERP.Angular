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
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CategoriesAcclistDto } from '../Dto/CategoriesAcclistDto';
import { CategoriesAccService } from '../services/CategoriesAcc.service';
import { AddEditCategoriesAccDto } from '../Dto/AddEditCategoriesAccDto';
import Swal from 'sweetalert2';

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
    catGroupAccId: new FormControl(null),
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
  catGroupAcc: AccountDto = new AccountDto();
  typeId: number = 0;
  list: CategoriesAcclistDto[] = [];
  itemId: number = 0;
  index: number = 0;
  rowIndex: number | undefined;
  //#endregion
  constructor(
    private modalService: BsModalService,
    private lookupServ: LookupService,
    private alertify: AlertifyService,
    private currencyServ: CurrencyService,
    private accountServ: AccountService,
    private categoriesAccServ: CategoriesAccService,
  ) {}

  ngOnInit(): void {
    this.addNewRow();
    forkJoin([
      this.lookupServ.lookupDetailsGetById(122).subscribe(
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
    debugger
    if (this.list.length==1&&this.list[0].catId==0&&this.list[0].curId==0) {
      this.alertify.error('برجاء اضافة عنصر واحد علي الاقل');
    }else if(this.list.length==1&&this.list[0].catId!==0&&this.list[0].curId==0){
      this.alertify.error('برجاء اضافة عنصر واحد علي الاقل');

    } else {
      this.list.forEach((element) => {
        if (element.catAccId == 0) {
          element.createdOn = new Date(Date.now());
        }
      });
      this.categoriesAccServ.AddEditCategoriesAcc(this.list).subscribe(
        (res) => {
          console.log(res),
            this.categoriesAccServ
              .GetCategoriesAccountByCatId(this.lookupItemDetails.id)
              .subscribe(
                (res) => {this.list = res;
                  if(res.length==0){
                    this.addNewRow();
                  }
                },
                (err) => console.log(err)
              );
          console.log(this.list);
          this.alertify.success(' تم الحفظ بنجاح');
        },
        (err) => console.log(err)
      );
    }
  }
x(){
  Swal.fire({
    title: 'جاري الحفظ...',
    html: 'برجاء الانتظار حتي يتم حفظ البيانات',
    allowEscapeKey: false,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    }
  });
  setTimeout(() => {
    Swal.close();
  }, 2000);
}

  CategoryAccountDelete() {
  if(this.lookupItemDetails.nameL1==undefined){
    this.alertify.error("برجاء اختيار الفئة المراد حذفها")
  }else{
    Swal.fire({
      title:`هل تريد حذف الحسابات المربوطه بفئة : ${this.lookupItemDetails.nameL1} `,
     // text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم',
      cancelButtonText: 'لا',
    }).then((result) => {
      if(this.list.length==1&&this.list[0].curId==0){
        this.alertify.error("لا يوجد حسابات ليتم حذفها");
      }else{
        this.list.forEach(element => {
          element.isDeleted=true;
        });
        this.list.forEach((element,index) => {
          if(element.catAccId==0){
            this.list.splice(index,1)
          }
        });
        this.categoriesAccServ.AddEditCategoriesAcc(this.list).subscribe(
          (res) => {
            console.log(res),
              this.categoriesAccServ
                .GetCategoriesAccountByCatId(this.lookupItemDetails.id)
                .subscribe(
                  (res) => {this.list = res;
                    if(res.length==0){
                      this.addNewRow();
                    }
                  },
                );
          },
        );
        this.catGroupAcc.accountNo='';
        this.catBackSellAcc.accountNo='';
        this.catCostAcc.accountNo='';
        Swal.fire(
              'تم الحذف بنجاح',
              `تم حذف جميع الحسابات الخاصة بفئة :${this.lookupItemDetails.nameL1}`,
              'success',
            )
      }
    })
  }

  }
  openModal(template: TemplateRef<any>, type?: number, index?: number) {
    this.rowIndex = index == undefined ? 0 : index;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-dialog-scrollable',
    });
    if (type !== undefined) {
      this.typeId = type;
    }
    this.textFilterModel = '';
    this.isDateFilter = false;
  }
  lookupDetailsGetBylookupId(code: any, index?: number) {
    this.index = index != undefined ? index : 0;
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
        this.list[this.rowIndex == undefined ? 0 : this.rowIndex].catId =
          item.id;
        this.list[this.rowIndex == undefined ? 0 : this.rowIndex].catCode =
          item.code;
        this.getCategoriesAccounByCatId();
        break;
      case 2:
        //this.currencyItem = item;
        this.form.get('curId')?.setValue(item.id);
        this.form.get('branchId')?.setValue(1);
        this.form.get('compId')?.setValue(1);
        this.list[this.rowIndex == undefined ? 0 : this.rowIndex].curCode =
          item.code;
        this.list[this.rowIndex == undefined ? 0 : this.rowIndex].curName =
          item.nameL1;
        this.list[this.rowIndex == undefined ? 0 : this.rowIndex].curId =
          item.id;
        // this.list[this.list.length-1].branchId=1;

        break;
      case 3:
        if (this.typeId == 0) {
          this.catAcc = item;
          this.form.get('catId')?.setValue(this.catAcc.id);
        } else if (this.typeId == 1) {
          this.catSellAcc = item;
          this.form.get('catSellAccId')?.setValue(this.catSellAcc.id);
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].catSellAccNumber = item.accountNo;
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].catSellAccId = item.id;
        } else if (this.typeId == 2) {
          this.catBackBuyAcc = item;
          this.form.get('catBackBuyAccId')?.setValue(this.catBackBuyAcc.id);
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].catBackBuyAccNumber = item.accountNo;
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].catBackBuyAccId = item.id;
        } else if (this.typeId == 3) {
          this.catDiscAcc = item;
          this.form.get('catDiscAccId')?.setValue(this.catDiscAcc.id);
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].catDiscAccNumber = item.accountNo;
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].catDiscAccId = item.id;
        } else if (this.typeId == 4) {
          this.catInDiscAcc = item;
          this.form.get('catInDiscAccId')?.setValue(this.catInDiscAcc.id);
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].catInDiscAccNumber = item.accountNo;
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].catInDiscAccId = item.id;
        } else if (this.typeId == 5) {
          this.catTaxAcc = item;
          this.form.get('catTaxAccId')?.setValue(this.catTaxAcc.id);
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].catTaxAccNumber = item.accountNo;
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].catTaxAccId = item.id;
        } else if (this.typeId == 10) {
          this.catCostAcc = item;
          this.form.get('catCostAccId')?.setValue(this.catCostAcc.id);
          this.list[this.list.length - 1].catCostAccNumber = item.accountNo;
          this.list[this.list.length - 1].catCostAccId = item.id;
        } else if (this.typeId == 9) {
          this.catBackSellAcc = item;
          this.form.get('catBackSellAccId')?.setValue(this.catBackSellAcc.id);
          this.list[this.list.length - 1].catBackSellAccNumber = item.accountNo;
          this.list[this.list.length - 1].catBackSellAccId = item.id;
        } else if (this.typeId == 6) {
          this.vatDebitAcc = item;
          this.form.get('vatDebitAccId')?.setValue(this.vatDebitAcc.id);
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].vatDebitAccNumber = item.accountNo;
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].vatDebitAccId = item.id;
        } else if (this.typeId == 7) {
          this.vatCreditAcc = item;
          this.form.get('vatCreditAccId')?.setValue(this.vatCreditAcc.id);
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].vatCreditAccNumber = item.accountNo;
          this.list[
            this.rowIndex == undefined ? 0 : this.rowIndex
          ].vatCreditAccId = item.id;
        } else if (this.typeId == 8) {
          this.catGroupAcc = item;
          if(this.catGroupAcc.id!=0){
            this.form.get('catGroupAccId')?.setValue(this.catGroupAcc.id);
            this.list[this.list.length - 1].catGroupAccNumber =
              this.catGroupAcc.accountNo;
            this.list[this.list.length - 1].catGroupAccId = item.id;
          }else{
            this.form.get('catGroupAccId')?.setValue(null );
            this.list[this.list.length - 1].catGroupAccNumber =
              this.catGroupAcc.accountNo;
            this.list[this.list.length - 1].catGroupAccId = item.id;
          }

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
        if (res.length > 0) {
          this.list = res;
          this.catCostAcc.accountNo = res[0].catCostAccNumber;
          this.catGroupAcc.accountNo = res[0].catGroupAccNumber;
          this.catBackSellAcc.accountNo = res[0].catBackSellAccNumber;
          this.catGroupAcc.id = res[0].catGroupAccId;
          this.catCostAcc.id = res[0].catCostAccId;
          this.catBackSellAcc.id = res[0].catBackSellAccId;
          console.log(res);
        } else {
          this.list = [];
          this.addNewRow();
          this.catCostAcc.accountNo = '';
          this.catGroupAcc.accountNo = '';
          this.catBackSellAcc.accountNo = '';
          this.catGroupAcc.id = 0;
          this.catCostAcc.id = 0;
          this.catBackSellAcc.id = 0;
          // this.addNewRow();
        }
      },
      (err) => console.log(err)
    );
  }
  addNewRow() {
    var dto: CategoriesAcclistDto = new CategoriesAcclistDto();
    dto.catAccId = 0;
    dto.branchId = 1;
    dto.compId = 1;
    dto.catGroupAccId = this.catGroupAcc.id;
    dto.catCostAccId = this.catCostAcc.id;
    dto.catBackSellAccId = this.catBackSellAcc.id;
    dto.catCostAccNumber = this.catCostAcc.accountNo;
    dto.catGroupAccNumber = this.catGroupAcc.accountNo;
    dto.catId = this.lookupItemDetails.id;
    dto.catBackSellAccNumber = this.catBackSellAcc.accountNo;
    this.list.push(dto);
    console.log(this.list.length);
  }
  DeleteRow(id: number, index: number) {
    if (id) {
      this.alertify.confirm('هل تريد حذف حساب رقم : ' + index, () => {
        this.categoriesAccServ.deleteCategoiesAccount(id).subscribe(
          (result) => {
            this.categoriesAccServ
              .GetCategoriesAccountByCatId(this.lookupItemDetails.id)
              .subscribe(
                (res) => {
                  this.list = res;
                  if(res.length==0){
                    this.addNewRow();
                  }
                },
                (err) => console.log(err)
              );
            this.alertify.success('تم الحذف');
          },
          (error) => alert('Not Found')
        );
      });
    } else {
      this.list.splice(index,1);
      if(this.list.length==0){
        this.addNewRow();
      }
      this.alertify.success('تم الحذف');
    }
  }

  CheckValidation(list:any){
    // list.forEach(element => {
    //   if(element){}
    //  }
    // );
  }
}
