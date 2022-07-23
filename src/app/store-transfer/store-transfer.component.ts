import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { ItemDto } from '../Dto/ItemDto';
import { ItemUnitDto } from '../Dto/ItemUnitDto';
import { lookupDetailsDto } from '../Dto/LookupDetailsDto';
import { LookupDetails } from '../interfaces/lookup.interface';
import { AlertifyService } from '../services/alertify.service';
import { ItemService } from '../services/item.service';
import { LookupService } from '../services/lookup.service';

@Component({
  selector: 'app-store-transfer',
  templateUrl: './store-transfer.component.html',
  styleUrls: ['./store-transfer.component.css']
})
export class StoreTransferComponent implements OnInit {
  sourceStoreItems: lookupDetailsDto = new lookupDetailsDto();
  storeItems: lookupDetailsDto = new lookupDetailsDto();
  ItemUnitDetails: lookupDetailsDto = new lookupDetailsDto();
  itemId: number = 0;
  index: number = 0;
  rowIndex: number = 0;
  modalRef!: BsModalRef;
  lookupDetailsList: LookupDetails[] = [];
  form: FormGroup;
  itemUnitList: ItemUnitDto[] = [];
  ItemUnits: LookupDetails[] = [];
  AllItemList: ItemDto[] = [];
  pageName: string;
  textFilterModel: string = '';

  constructor(
    private modalService: BsModalService,
    private lookupServ: LookupService,
    private alertify: AlertifyService,
    private itemServ: ItemService,
    private fb: FormBuilder,
  ){
    this.pageName="التحويل المخزني";
    this.form = new FormGroup({
      branchId: new FormControl(1),
      companyId: new FormControl(1),
      storeConversionCode: new FormControl(null),
      sourceStoreId: new FormControl(null),
      storeId: new FormControl(null),
      storeConversionDate: new FormControl(this.formatDate(new Date())),
      storeConversionIsActive: new FormControl(true),
      isRecieved: new FormControl(false),
      isDeleted: new FormControl(false),
      createdOn: new FormControl(null),
      notes: new FormControl(null),
      orderNumber: new FormControl(null),
    });
    forkJoin([
      this.lookupServ.lookupDetailsGetById(117).subscribe(
        (res) => {
          this.lookupDetailsList = res;
        },
        (err) => console.log(err)
      ),

      this.itemServ.itemGetAll().subscribe(
        (res) => (this.AllItemList = res),
        (err) => console.log(err)
      ),

    ]);
  }

  ngOnInit() {
  }
  private formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  openModal(template: TemplateRef<any>, type?: number, index?: number) {
    this.rowIndex = index == undefined ? 0 : index;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-dialog-scrollable modal-lg',
    });
  }



  getItem(item: any, type: number, col?: number) {
    debugger;
    this.itemId = item.id;
    switch (type) {
      case 1:
        this.sourceStoreItems = item;
        // this.form.get("categoryId")?.setValue(item.id);
        break;
        case 2:
        this.storeItems = item;
        // this.form.get("categoryId")?.setValue(item.id);
        break;
      case 3:
        var found = false;
        this.itemUnitList.forEach((element) => {
          if (item.id == element.unitId) {
            found = true;
          }
        });
        if (found) {
          this.alertify.error('لا يمكن اختيار تلك الوحده');
          break;
        } else {
          if (this.itemUnitList[this.rowIndex].unitParentId == item.id) {
            this.alertify.error(
              'لا يمكن ان تكون الوحده مساوية للوحده الرئيسيه'
            );
          } else {
            this.itemUnitList[this.rowIndex].unit = item;
            this.itemUnitList[this.rowIndex].unitId = item.id;
            this.itemUnitList[this.rowIndex].unitItemCode = item.code;
            this.itemUnitList[this.rowIndex].unitName = item.nameL1;

            if (this.rowIndex < this.itemUnitList.length - 1) {
              this.itemUnitList[this.rowIndex + 1].unitParentId = item.id;
              this.itemUnitList[this.rowIndex + 1].unitParentCode = item.code;
              this.itemUnitList[this.rowIndex + 1].unitParentName = item.nameL1;
            }
          }
        }
        break;
      case 4:
        this.itemUnitList[this.rowIndex].unitParent = item;
        this.itemUnitList[this.rowIndex].unitParentId = item.id;
        this.itemUnitList[this.rowIndex].unitParentCode = item.code;
        this.itemUnitList[this.rowIndex].unitParentName = item.nameL1;
        break;
      case 5:
        this.itemUnitList[this.rowIndex].currency = item;
        this.itemUnitList[this.rowIndex].currencyId = item.id;
        this.itemUnitList[this.rowIndex].currencyCode = item.code;
        this.itemUnitList[this.rowIndex].currencyName = item.nameL1;
        break;

      default:
        console.log('No such type exists!');
        break;
    }
  }

  lookupDetailsGetBylookupId(code: any, index?: number) {
    this.index = index != undefined ? index : 0;
    debugger;
    let item = this.lookupDetailsList.find((s) => s.code == code);
    if (item != null) {
      this.sourceStoreItems.id = item.id;
      this.sourceStoreItems.code = item.code;
      this.sourceStoreItems.nameL1 = item.nameL1;
    } else {
      this.alertify.error('لا يوجد فئة بذلك الكود');
    }
  }
  save(){
    this.form.get('createdOn')?.setValue(new Date())
    console.log(this.form.value)
  }
}
