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

@Component({
  selector: 'app-account-category',
  templateUrl: './account-category.component.html',
  styleUrls: ['./account-category.component.css'],
})
export class AccountCategoryComponent implements OnInit {
  //#region declare properities here
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
  currencyItem:CurrencyDto=new CurrencyDto();
  accountList: Account[]=[];
  accountItem1: AccountDto=new AccountDto();
  accountItem2: AccountDto=new AccountDto();
  accountItem3: AccountDto=new AccountDto();
  accountItem4: AccountDto=new AccountDto();
  accountItem5: AccountDto=new AccountDto();
  typeId: number=0;
  //#endregion
  constructor(
    private lookupServ: LookupService,
    private modalService: BsModalService,
    private alertify: AlertifyService,
    private currencyServ: CurrencyService,
    private accountServ:AccountService,
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.lookupServ.lookupDetailsGetById(114).subscribe(
        (res) => {
          (this.lookupDetailsList = res), console.log(res);
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
  invoiceCreateUpdate(x: any) {}
  invoiceDelete(id: any) {}
  //#endregion
  openModal(template: TemplateRef<any>,type?:number) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-dialog-scrollable',
    });
    if(type!==undefined){
      this.typeId=type;
    }
    this.textFilterModel = '';
    this.isDateFilter = false;
  }
  lookupDetailsGetBylookupId(code: any) {
    debugger;
    let item = this.lookupDetailsList.find((s) => s.code == code);
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
  getItem(item: any,type:number,col?:number) {
    debugger
    switch(type){
      case 1:
        this.lookupItemDetails = item;
        break;
      case 2:
        this.currencyItem=item;
        break;
        case 3:
          if(this.typeId==1){
            this.accountItem1=item;
          }else if(this.typeId==2){
            this.accountItem2=item;
          }else if(this.typeId==3){
            this.accountItem3=item;
          }else if(this.typeId==4){
            this.accountItem4=item;
          }else if(this.typeId==5){
            this.accountItem5=item;
          }

          break;
      default:
        console.log("No such day exists!");
        break;
    }

  }
  addNewRoow(){
    
  }
}
