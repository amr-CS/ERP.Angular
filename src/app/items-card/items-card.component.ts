import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { CurrencyDto } from '../Dto/CurrencyDto';
import { InvItemEquipmentDto } from '../Dto/InvItemEquipmentDto';
import { ItemDto } from '../Dto/ItemDto';
import { ItemsUnitsPricesDto } from '../Dto/ItemsUnitsPricesDto';
import { ItemUnitBarcodeDto } from '../Dto/ItemUnitBarcodeDto';
import { ItemUnitDto } from '../Dto/ItemUnitDto';
import { lookupDetailsDto } from '../Dto/LookupDetailsDto';
import { TblInvItemReplaceDto } from '../Dto/TblInvItemReplaceDto';
import { Currency } from '../interfaces/currency.interface.';
import { LookupDetails } from '../interfaces/lookup.interface';
import { TblInvItemReplace } from '../interfaces/TblInvItemReplace';
import { AccountService } from '../services/account.service';
import { AlertifyService } from '../services/alertify.service';
import { CurrencyService } from '../services/currency.service';
import { ItemService } from '../services/item.service';
import { LookupService } from '../services/lookup.service';

@Component({
  selector: 'app-items-card',
  templateUrl: './items-card.component.html',
  styleUrls: ['./items-card.component.css'],
})
export class ItemsCardComponent implements OnInit {
  isload: boolean = false;
  SearchFrom: Date = new Date();
  SearchTo: Date = new Date();
  pageName: string = 'بطاقة الاصناف';
  lookupItemDetails: lookupDetailsDto = new lookupDetailsDto();
  currencyItem: CurrencyDto = new CurrencyDto();
  ItemUnitDetails: lookupDetailsDto = new lookupDetailsDto();
  ItemUnitMain: lookupDetailsDto = new lookupDetailsDto();
  fileToUpload: any;
  imageUrl: any;
  itemId: number = 0;
  index: number = 0;
  rowIndex: number = 0;
  modalRef!: BsModalRef;
  typeId: number = 0;
  textFilterModel: string = '';
  ItemCode: string = '';
  isDateFilter: boolean = false;
  lookupDetailsList: LookupDetails[] = [];
  currencyList: Currency[] = [];
  accountList: any[] = [];
  form: FormGroup;
  itemUnitList: ItemUnitDto[] = [];
  invItemEquipmentList: InvItemEquipmentDto[] = [];
  tblInvItemReplaceList: TblInvItemReplaceDto[] = [];
  itemsUnitsPricesList: ItemsUnitsPricesDto[] = [];
  itemUnitBarcodeList: ItemUnitBarcodeDto[] = [];
  ItemUnits: LookupDetails[] = [];
  currencyUnitItem: CurrencyDto = new CurrencyDto();
  EquipList: LookupDetails[] = [];
  invItemEquipment: lookupDetailsDto = new lookupDetailsDto();
  AllItemList: ItemDto[] = [];
  ItemUnitPriceList: LookupDetails[] = [];
  ItemUnitId: number = 0;
  RowNumberInItemUnitList: any;
  constructor(
    private modalService: BsModalService,
    private lookupServ: LookupService,
    private alertify: AlertifyService,
    private currencyServ: CurrencyService,
    private accountServ: AccountService,
    private itemServ: ItemService,
    private fb: FormBuilder
  ) {
    this.SearchFrom = new Date(this.formatDate(new Date()));
    this.SearchTo = new Date(this.formatDate(new Date()));
    this.form = new FormGroup({
      branchId: new FormControl(1),
      code: new FormControl(null),
      itemNo: new FormControl(null),
      categoryId: new FormControl(null),
      barcode: new FormControl(null),
      nameL1: new FormControl(null),
      nameL2: new FormControl(null),
      factoryId: new FormControl(null),
      orderLimit: new FormControl(null),
      symbol: new FormControl(null),
      currencyId: new FormControl(null),
      measurements: new FormControl(null),
      lastCost: new FormControl(null),
      productDate: new FormControl(this.formatDate(new Date())),
      madeIn: new FormControl(null),
      hasExpiryDate: new FormControl(false),
      isVat: new FormControl(false),
      isSelling: new FormControl(false),
      isCompound: new FormControl(false),
      isProduct: new FormControl(false),
      isService: new FormControl(false),
      bonusLimit: new FormControl(null),
      bonusAmount: new FormControl(null),
      discountLimit: new FormControl(null),
      discountPercentage: new FormControl(null),
      discountMaxQuantity: new FormControl(null),
      discountMinQuantity: new FormControl(null),
      lastBuy: new FormControl(null),
      lastSell: new FormControl(null),
      notes: new FormControl(null),
      image: new FormControl(null),
      isDeleted: new FormControl(false),
      isActive: new FormControl(false),
      orderNo: new FormControl(null),
      warehouseId: new FormControl(null),
      itemTypeId: new FormControl(null),
      isDetailsGroup: new FormControl(null),
      itemGroupId: new FormControl(null),
    });
  }
  ngOnInit(): void {
    this.addNewRow();
    this.addNewEquipRow();
    this.addNewReplaceRow();
    this.addNewUnitPriceRow();
    this.addNewBarcodeRow();
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
      this.lookupServ.lookupDetailsGetById(108).subscribe(
        (res) => {
          this.ItemUnits = res;
        },
        (err) => console.log(err)
      ),
      this.lookupServ.lookupDetailsGetById(130).subscribe(
        (res) => {
          console.log(res);
          this.EquipList = res;
        },
        (err) => console.log(err)
      ),
      this.lookupServ.lookupDetailsGetById(36).subscribe(
        (res) => {
          console.log(res);
          this.ItemUnitPriceList = res;
        },
        (err) => console.log(err)
      ),
      this.itemServ.itemGetAll().subscribe(
        (res) => (this.AllItemList = res),
        (err) => console.log(err)
      ),
    ]);
  }
  openModal(template: TemplateRef<any>, type?: number, index?: number) {
    this.rowIndex = index == undefined ? 0 : index;
    // console.log(this.rowIndex);
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-dialog-scrollable modal-lg',
    });
    if (type !== undefined) {
      this.typeId = type;
    }
    this.textFilterModel = '';
    this.isDateFilter = false;
  }
  GetItemByCode(code: any) {
    this.itemServ.itemGetByBarcodeofUnit(code).subscribe(
      (res) => {
        if (res == null) {
          this.alertify.error('لا يوجد عنصر بهذا الباركود');
        } else {
          console.log(res);
          this.buildForm(res);
        }
      },
      (err) => console.log(err)
    );
  }
  buildForm(Item: ItemDto) {
    debugger;
    this.form = this.fb.group({
      id:[Item.id],
      code: [Item?.code],
      itemNo: [Item?.itemNo],
      categoryId: [Item?.categoryId],
      barcode: [Item?.barcode],
      nameL1: [Item?.nameL1],
      nameL2: [Item?.nameL2],
      factoryId: [Item?.factoryId],
      orderLimit: [Item?.orderLimit],
      symbol: [Item?.symbol],
      currencyId: [Item?.currencyId],
      measurements: [Item?.measurements],
      lastCost: [Item?.lastCost],
      productDate: [Item?.productDate],
      madeIn: [Item?.madeIn],
      hasExpiryDate: [Item?.hasExpiryDate],
      isVat: [Item?.isVat],
      isSelling: [Item?.isSelling],
      isCompound: [Item?.isCompound],
      isProduct: [Item?.isProduct],
      isService: [Item?.isService],
      bonusLimit: [Item?.bonusLimit],
      bonusAmount: [Item?.bonusAmount],
      discountLimit: [Item?.discountLimit],
      discountPercentage: [Item?.discountPercentage],
      discountMaxQuantity: [Item?.discountMaxQuantity],
      discountMinQuantity: [Item?.discountMinQuantity],
      lastBuy: [Item?.lastBuy],
      lastSell: [Item?.lastSell],
      notes: [Item?.notes],
      image: [Item?.image],
      isDeleted: [Item?.isDeleted],
      isActive: [Item?.isActive],
      orderNo: [Item?.orderNo],
      warehouseId: [Item?.warehouseId],
      itemTypeId: [Item?.itemTypeId],
      isDetailsGroup: [Item?.isDetailsGroup],
      itemGroupId: [Item?.itemGroupId],
    });
    if (Item.categoryId != null) {
      var category = this.lookupDetailsList.find(
        (x) => x.id == Item.categoryId
      );
      this.lookupItemDetails.code = category?.code;
      this.lookupItemDetails.nameL1 =
        category?.nameL1 == undefined ? '' : category?.nameL1;
    }
    if (Item.currencyId != null) {
      var curency = this.currencyList.find((x) => x.id == Item.currencyId);

      this.currencyItem.code = curency?.code;
      this.currencyItem.nameL1 = curency?.nameL1;
    } else {
      this.currencyItem.code = 0;
      this.currencyItem.nameL1 = '';
    }

    if (Item.tblInvItemUnit.length != 0) {
      Item.tblInvItemUnit.forEach((element) => {
      let unit = this.ItemUnits.find((x) => x.id == element.unitId);
      element.unitItemCode = unit?.code;
      element.unitName = unit?.nameL1;
      });
      Item.tblInvItemUnit.forEach((element) => {
        let unitParent = this.ItemUnits.find((x) => x.id == element.unitParentId);
        element.unitParentCode = unitParent?.code;
        element.unitParentName = unitParent?.nameL1;
        });
      Item.tblInvItemUnit.forEach((element) => {
        let currency = this.currencyList.find((x) => x.id == element.currencyId);
        element.currencyCode = currency?.code;
        element.currencyName = currency?.nameL1;
        });

        Item.tblInvItemUnit.forEach(element => {
          var x=element.itemUnitBarcode.find(x=>x.barcode==this.ItemCode);
          let itemunit=Item.tblInvItemUnit.find(s=>s.invItemUnitId==x?.itemUnitId);
          if(itemunit!=null){
            this.itemUnitBarcodeList=itemunit.itemUnitBarcode;
          }
        });


    }

    this.itemUnitList = Item.tblInvItemUnit;
    this.invItemEquipmentList = Item.tblInvItemEquipment;
    Item.tblInvItemEquipment.forEach((element, index) => {
      let equip = this.EquipList.find((x) => x.id == element.equipmentId);
      element.invItemEquipmentCode = equip?.code;
      element.equipName = equip?.nameL1;
    });
    this.tblInvItemReplaceList = Item.tblInvItemReplace;
    Item.tblInvItemReplace.forEach((element, index) => {
      let item = this.AllItemList.find((x) => x.id == element.replaceItemId);
      element.invItemReplaceCode = item?.code;
      element.invItemReplaceName = item?.nameL1;
    });
    this.itemsUnitsPricesList = Item.tblInvItemsUnitsPrices;
    Item.tblInvItemsUnitsPrices.forEach((element, index) => {
      let item = this.ItemUnitPriceList.find(
        (x) => x.id == element.sellCostType
      );
      element.priceCode = item?.code;
      element.priceName = item?.nameL1;
    });

    if (Item.tblInvItemUnit.length == 0) {
      this.addNewRow();
    }
    if (Item.tblInvItemEquipment.length == 0) {
      this.addNewEquipRow();
    }
    if (Item.tblInvItemReplace.length == 0) {
      this.addNewReplaceRow();
    }
    if (Item.tblInvItemsUnitsPrices.length == 0) {
      this.addNewUnitPriceRow();
    }
  }
  save() {
    let item: ItemDto = new ItemDto();
    item = this.form.value;
    this.itemUnitList.forEach((element,index) => {
      if (
        element.unitId == 0 ||
        element.unitParentId == 0
      ) {
        this.itemUnitList.splice(index,1);
      }
    });
    this.tblInvItemReplaceList.forEach((element,index) => {
      if (element.replaceItemId == 0) {
        this.tblInvItemReplaceList.splice(index,1);
      }
    });
    this.invItemEquipmentList.forEach((element,index) => {
      if (element.equipmentId == 0) {
        this.invItemEquipmentList.splice(index,1);
      }
    });
    this.itemsUnitsPricesList.forEach((element,index) => {
      if (element.sellCostType == 0) {
        this.itemsUnitsPricesList.splice(index,1);
      }
    });

    item.tblInvItemUnit = this.itemUnitList;
    item.tblInvItemReplace = this.tblInvItemReplaceList;
    item.tblInvItemEquipment = this.invItemEquipmentList;
    item.tblInvItemsUnitsPrices = this.itemsUnitsPricesList;
    // let ListOfItems: ItemDto[] = [];
    // ListOfItems.push(item);
    // console.log(ListOfItems);
    this.itemServ.AddEditItem(item).subscribe(
      (res) => {
        this.buildForm(res);
        this.alertify.success('تم الحفظ بنجاح');
      },
      (err) => console.log(err)
    );
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
  handleFileInput(event: any) {
    let file: FileList;
    file = event.target.files;
    this.fileToUpload = file.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
  }
  lookupDetailsGetBylookupId(code: any, index?: number) {
    this.index = index != undefined ? index : 0;
    debugger;
    let item = this.lookupDetailsList.find((s) => s.code == code);
    //console.log(item);
    this.lookupItemDetails.code = item?.code;
    this.lookupItemDetails.nameL1 = item?.nameL1;
    if (item?.id !== null) {
      let itmId = item?.id == null ? 0 : item.id;
      this.lookupItemDetails.id = itmId;
    } else {
      this.alertify.error('لا يوجد فئة بذلك الرقم');
    }
  }
  currencyByCode(code: any) {
    debugger;
    let item = this.currencyList.find((s) => s.code == code);
    //console.log(item);
    this.currencyItem.code = item?.code;
    this.currencyItem.nameL1 == undefined ? null : item?.nameL1;
    if (item?.id !== null) {
      let itmId = item?.id == null ? 0 : item.id;
      this.currencyItem.id = itmId;
    } else {
      this.alertify.error('لا يوجد عمله بذلك الرقم');
    }
  }
  UnitByCode(code: any) {
    debugger;
    let item = this.ItemUnits.find((s) => s.code == code);
    // console.log(item);
    this.ItemUnitDetails.code = item?.code;
    this.ItemUnitDetails.nameL1 == undefined ? null : item?.nameL1;
    if (item?.id !== null) {
      let itmId = item?.id == null ? 0 : item.id;
      this.ItemUnitDetails.id = itmId;
    } else {
      this.alertify.error('لا يوجد صنف بذلك الرقم');
    }
  }
  addNewRow() {
    var dto: ItemUnitDto = new ItemUnitDto();
    this.ItemUnitMain = new lookupDetailsDto();
    this.ItemUnitDetails = new lookupDetailsDto();
    this.currencyUnitItem = new CurrencyDto();
    this.itemUnitList.push(dto);
  }
  addNewEquipRow() {
    var dto: InvItemEquipmentDto = new InvItemEquipmentDto();
    this.invItemEquipmentList.push(dto);
  }
  addNewReplaceRow() {
    var dto: TblInvItemReplaceDto = new TblInvItemReplaceDto();
    this.tblInvItemReplaceList.push(dto);
  }
  addNewUnitPriceRow() {
    var dto: ItemsUnitsPricesDto = new ItemsUnitsPricesDto();
    this.itemsUnitsPricesList.push(dto);
  }
  addNewBarcodeRow() {
    var dto: ItemUnitBarcodeDto = new ItemUnitBarcodeDto();
    dto.itemUnitId = 50;
    //dto.itemUnitId=this.ItemUnitId;
    this.itemUnitBarcodeList.push(dto);
  }
  getItem(item: any, type: number, col?: number) {
    debugger;
    this.itemId = item.id;
    switch (type) {
      case 1:
        this.lookupItemDetails = item;
        // this.form.get("categoryId")?.setValue(item.id);
        break;
      case 2:
        this.currencyItem = item;
        break;
      case 3:
        this.itemUnitList[this.rowIndex].unit = item;
        this.itemUnitList[this.rowIndex].unitId = item.id;
        this.itemUnitList[this.rowIndex].unitItemCode = item.code;
        this.itemUnitList[this.rowIndex].unitName = item.nameL1;
        break;
      case 4:
        this.itemUnitList[this.rowIndex].unitParent=item;
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
      case 6:
        this.invItemEquipmentList[this.rowIndex].equipmentId = item.id;
        this.invItemEquipmentList[this.rowIndex].invItemEquipmentCode =
          item.code;
        this.invItemEquipmentList[this.rowIndex].equipName = item.nameL1;
        this.invItemEquipmentList[this.rowIndex].itemId = 10;
        break;
      case 7:
        this.tblInvItemReplaceList[this.rowIndex].replaceItemId = item.id;
        this.tblInvItemReplaceList[this.rowIndex].invItemReplaceCode =
          item.code;
        this.tblInvItemReplaceList[this.rowIndex].invItemReplaceName =
          item.nameL1;
        this.tblInvItemReplaceList[this.rowIndex].itemId = 10;
        break;
      case 8:
        this.itemsUnitsPricesList[this.rowIndex].sellCostType = item.id;
        this.itemsUnitsPricesList[this.rowIndex].priceCode = item.code;
        this.itemsUnitsPricesList[this.rowIndex].priceName = item.nameL1;
        this.itemsUnitsPricesList[this.rowIndex].itemId = 10;
        break;
      case 9:
        this.getItemById(item.id);
        //this.itemServ.itemGetById(item.id).subscribe()
        //this.GetItemByCode(item.barcode);
        break;
    }
  }
  getItemById(id: number) {
    this.isload = true;
    this.itemServ.itemGetById(id).subscribe(
      (res) => {
        this.isload = false;
        this.buildForm(res);
        this.alertify.success('تم استدعاء البيانات بنجاح');
      },
      (err) => {
        this.alertify.error('حدث خطأ ما');
      }
    );
  }
  tableRowClicked(no: any) {
    this.RowNumberInItemUnitList = no;
    this.itemUnitBarcodeList =
      this.itemUnitList[this.RowNumberInItemUnitList].itemUnitBarcode;
    if (
      this.itemUnitList[this.RowNumberInItemUnitList].itemUnitBarcode.length ==
      0
    ) {
      this.addNewBarcodeRow();
    }
    this.ItemUnitId = this.itemUnitList[no].id;
    // console.log(no);
  }

  Search() {
    debugger;
    var FilterList = this.AllItemList.filter(
      (x) => x.createdOn >= this.SearchFrom && x.createdOn <= this.SearchTo
    );
    if (FilterList.length != 0) {
      this.AllItemList = FilterList;
    }
  }

  DeleteRow(index:any){
    this.alertify.confirm("are you sure you want delete",()=>{
      this.itemUnitList[index].isDeleted=true;
      this.itemUnitList.splice(index,1);
    }
   );
    ;
  }
}
