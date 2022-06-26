import { IfStmt } from '@angular/compiler';
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
  barcodeList: any[]=[];
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
      itemMinQty:new FormControl(null),
      itemMaxQty:new FormControl(null),
    });

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
      this.itemServ.UnitBarcodeList().subscribe(
        (res) => (this.barcodeList = res),
        (err) => console.log(err)
      ),
    ]);

    for (let i = 1; i <= 5; i++) {
      this.addNewRow(i);
    }
  }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>, type?: number, index?: number) {
    this.rowIndex = index == undefined ? 0 : index;
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
      itemMinQty:[Item?.itemMinQty],
      itemMaxQty:[Item?.itemMaxQty],
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
      element.unitItemCode = unit==null?0:unit.code;
      element.unitName = unit==null?"":unit.nameL1;

      });
      Item.tblInvItemUnit.forEach((element) => {
        let unitParent = this.ItemUnits.find((x) => x.id == element.unitParentId);
        element.unitParentCode = unitParent==null?0:unitParent.code;
        element.unitParentName = unitParent==null?"":unitParent.nameL1;
        });
      Item.tblInvItemUnit.forEach((element) => {
        let currency = this.currencyList.find((x) => x.id == element.currencyId);
        element.currencyCode = currency==null?0:currency.code;
        element.currencyName = currency==null?"":currency.nameL1;
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
      this.addNewRow(1);
    }
    if (Item.tblInvItemEquipment.length == 0) {
      this.addNewRow(3);
    }
    if (Item.tblInvItemReplace.length == 0) {
      this.addNewRow(4);
    }
    if (Item.tblInvItemsUnitsPrices.length == 0) {
      this.addNewRow(5);
    }
  }
  save() {
    let item: ItemDto = new ItemDto();
    item = this.form.value;
    if(this.itemUnitList.length>1){
      this.itemUnitList.forEach((element,index) => {
        if (
          element.unitId == 0
        ) {
          this.itemUnitList.splice(index,1);
        }
      });
    }

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

    if(item.categoryId!=0&&item.nameL1!=""&&item.nameL2!=""&&item.tblInvItemUnit[0].unitId!=0){
      this.itemServ.AddEditItem(item).subscribe(
        (res) => {
          console.log(res);
           this.getItemById(res.id);
          this.alertify.success('تمت العمليه بنجاح');
        },
        (err) => console.log(err)
      );

      }else{
          this.alertify.error("برجاء ملء البيانات المطلوبه واضافه عنصر علي الاقل ف جدول وحدات الاصناف")
      }
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
    if(item!=null){
      this.lookupItemDetails.id = item.id;
      this.lookupItemDetails.code = item.code;
      this.lookupItemDetails.nameL1 = item.nameL1;
    }else{
      this.alertify.error('لا يوجد فئة بذلك الكود');
    }
  }
  currencyByCode(code: any) {
    debugger;
    let item = this.currencyList.find((s) => s.code == code);
    if(item!=null){
      this.currencyItem.id = item.id;
      this.currencyItem.code = item.code;
      this.currencyItem.nameL1 = item.nameL1;
    }else{
      this.alertify.error('لا يوجد عمله بذلك الكود');
    }
  }
  itemUnitByCode(code:any,index:number){
    let item = this.ItemUnits.find((s) => s.code == code);
    if(item!=null){
      this.itemUnitList[index].unitId = item.id;
      this.itemUnitList[index].unitItemCode = item.code;
      this.itemUnitList[index].unitName = item.nameL1;
    }else{
      this.alertify.error('لا يوجد وحدة بذلك الكود');
    }
  }
  currencyUnitByCode(code:any,index:number){
    let item = this.currencyList.find((s) => s.code == code);
    if(item!=null){
      this.itemUnitList[index].currencyId = item.id;
      this.itemUnitList[index].currencyCode = item.code;
      this.itemUnitList[index].currencyName = item.nameL1;
    }else{
      this.alertify.error('لا يوجد وحدة بذلك الكود');
    }
  }
  EquipByCode(code:any,index:number){
    let item = this.EquipList.find((s) => s.code == code);
    if(item!=null){
      this.invItemEquipmentList[index].equipmentId = item.id;
      this.invItemEquipmentList[index].invItemEquipmentCode = item.code;
      this.invItemEquipmentList[index].equipName = item.nameL1;
    }else{
      this.alertify.error('لا يوجد معدات بذلك الكود');
    }
  }
  ReplaceItemByCode(code:any,index:number){
    let item = this.AllItemList.find((s) => s.code == code);
    if(item!=null){
      this.tblInvItemReplaceList[index].invItemReplaceId = item.id;
      this.tblInvItemReplaceList[index].invItemReplaceCode = item.code;
      this.tblInvItemReplaceList[index].invItemReplaceName = item.nameL1;
    }else{
      this.alertify.error('لا يوجد عنصر بذلك الكود');
    }
  }
  priceItemByCode(code:any,index:number){
    let item = this.ItemUnitPriceList.find((s) => s.code == code);
    if(item!=null){
      this.itemsUnitsPricesList[index].sellCostType = item.id;
      this.itemsUnitsPricesList[index].priceCode = item.code;
      this.itemsUnitsPricesList[index].priceName = item.nameL1;
    }else{
      this.alertify.error('لا يوجد سعر بذلك الكود');
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
  addNewRow(type:number,index?:number) {
    debugger
    switch(type){
      case 1:
        if(index!=null){
          if(this.itemUnitList[index].unitId!=0){
            var itemUnitDto: ItemUnitDto = new ItemUnitDto();
            if(index!=null||index!=undefined){
           itemUnitDto.unitParentId=this.itemUnitList[index].unitId;
           itemUnitDto.unitParentCode=this.itemUnitList[index].unitItemCode;
           itemUnitDto.unitParentName=this.itemUnitList[index].unitName;
            }
            this.itemUnitList.push(itemUnitDto);
          }else{
            this.alertify.error("برجاء ادخال الوحدة ")
          }
        }else{
          var itemUnitDto: ItemUnitDto = new ItemUnitDto();
          this.itemUnitList.push(itemUnitDto);
        }


        break;
      case 2:
        if(index!=null){
            var result=this.barcodeList.find(x=>x.barcode==this.itemUnitBarcodeList[index].barcode)
              if(result==null){
                var itemUnitBarcodeDto: ItemUnitBarcodeDto = new ItemUnitBarcodeDto();
                this.itemUnitBarcodeList.push(itemUnitBarcodeDto);
                }else{
                  this.alertify.error("عفوا..الباركود مستخدم من قبل")
                }
        }else{
          var itemUnitBarcodeDto: ItemUnitBarcodeDto = new ItemUnitBarcodeDto();
                this.itemUnitBarcodeList.push(itemUnitBarcodeDto);
        }
        break;
      case 3:
        var invItemEquipmentDto: InvItemEquipmentDto = new InvItemEquipmentDto();
        this.invItemEquipmentList.push(invItemEquipmentDto);
        break;
      case 4:
        var tblInvItemReplaceDto: TblInvItemReplaceDto = new TblInvItemReplaceDto();
        this.tblInvItemReplaceList.push(tblInvItemReplaceDto);
        break;
      case 5:
        var itemsUnitsPricesDto: ItemsUnitsPricesDto = new ItemsUnitsPricesDto();
        this.itemsUnitsPricesList.push(itemsUnitsPricesDto);
        break;
    }

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
        var found=false;
        this.itemUnitList.forEach(element => {
          if(item.id==element.unitId){
            found=true;
          }
        });
        if(found){
          this.alertify.error("لا يمكن اختيار تلك الوحده");
          break;
        }else{
          if(this.itemUnitList[this.rowIndex].unitParentId==item.id){
            this.alertify.error("لا يمكن ان تكون الوحده مساوية للوحده الرئيسيه");
          }else{
            this.itemUnitList[this.rowIndex].unit = item;
            this.itemUnitList[this.rowIndex].unitId = item.id;
            this.itemUnitList[this.rowIndex].unitItemCode = item.code;
            this.itemUnitList[this.rowIndex].unitName = item.nameL1;

            if(this.rowIndex<this.itemUnitList.length-1){
              this.itemUnitList[this.rowIndex+1].unitParentId = item.id;
              this.itemUnitList[this.rowIndex+1].unitParentCode = item.code;
              this.itemUnitList[this.rowIndex+1].unitParentName = item.nameL1;
            }
          }
        }
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
        break;
      default:
        console.log('No such type exists!');
        break;
    }
  }

  getItemById(id: number) {
    this.isload = true;
    this.itemServ.itemGetById(id).subscribe(
      (res) => {
        this.isload = false;
        this.buildForm(res);
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
      this.addNewRow(2);
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

  DeleteRow(index:any,type:number){
    debugger
  switch(type){
    case 1:
        if(this.itemUnitList[index].id!=0){
          this.alertify.confirm("are you sure you want delete",()=>{
            this.itemUnitList[index].isDeleted=true;
            //this.itemUnitList.splice(index,1);
            this.save();
          });
        }else{
          this.itemUnitList.splice(index,1);
          if(this.itemUnitList.length==0){
            this.addNewRow(1);
          }
        }

      break;
    case 2:
        this.alertify.confirm("are you sure you want delete",()=>{
          if(this.invItemEquipmentList[index].invItemEquipmentId!=0){
            this.invItemEquipmentList[index].isDeleted=true;
            this.save();
            this.getItemById(this.invItemEquipmentList[index].itemId);
            //this.invItemEquipmentList.splice(index,1);
          }else{
            this.invItemEquipmentList.splice(index,1);
            if(this.invItemEquipmentList.length==0){
              this.addNewRow(3);
            }
          }
        });
      break;
    case 3:
        this.alertify.confirm("are you sure you want delete",()=>{
          if(this.tblInvItemReplaceList[index].invItemReplaceId!=0){
            this.tblInvItemReplaceList[index].isDeleted=true;
            this.save();
            this.getItemById(this.tblInvItemReplaceList[index].itemId);
            //this.tblInvItemReplaceList.splice(index,1);
          }else{
            this.tblInvItemReplaceList.splice(index,1);
            if(this.tblInvItemReplaceList.length==0){
              this.addNewRow(4);
            }
          }
        });
      break;
    case 4:
        this.alertify.confirm("are you sure you want delete",()=>{
          if(this.itemsUnitsPricesList[index].sellCostType!=0){
            this.itemsUnitsPricesList[index].isDeleted=true;
            this.save();
            this.getItemById(this.itemsUnitsPricesList[index].itemId);

            //this.itemsUnitsPricesList.splice(index,1);
          }else{
            this.itemsUnitsPricesList.splice(index,1);
            if(this.itemsUnitsPricesList.length==0){
              this.addNewRow(5);
            }
          }

        });
      break;
    default:
          console.log('No such type exists!');
          break;
  }
  }
}
