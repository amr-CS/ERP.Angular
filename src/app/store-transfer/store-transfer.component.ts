import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { ItemDto } from '../Dto/ItemDto';
import { ItemUnitDto } from '../Dto/ItemUnitDto';
import { lookupDetailsDto } from '../Dto/LookupDetailsDto';
import { StoreTransferDto } from '../Dto/StoreTransferDto';
import { StoreTransferDtlDto } from '../Dto/StotreTransferDtlDto';
import { LookupDetails } from '../interfaces/lookup.interface';
import { AlertifyService } from '../services/alertify.service';
import { ItemService } from '../services/item.service';
import { LookupService } from '../services/lookup.service';
import { StoreTransferService } from '../services/store-transfer.service';

@Component({
  selector: 'app-store-transfer',
  templateUrl: './store-transfer.component.html',
  styleUrls: ['./store-transfer.component.css'],
})
export class StoreTransferComponent implements OnInit {
  //#region initialize property
  storeTransferDtl: StoreTransferDtlDto[] = [];
  storeTransferDto: StoreTransferDto = new StoreTransferDto();
  storeTransferDtos: StoreTransferDto[] = [];
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
  itemCard: ItemDto = new ItemDto();
  selectedItem: ItemDto | undefined = new ItemDto();
  unitItemList: ItemUnitDto[]= [];
  AllStoreTransfer: StoreTransferDto[] = [];
  FilterStoreTransfer: StoreTransferDto[] = [];
  SearchFrom: string;
  SearchTo: string;
  selectedItems: Array<number> = [];
  selectedIndex: number = 0;
  CurrentItem: StoreTransferDto = new StoreTransferDto();
  isload: boolean=false;
  //#endregion
  constructor(
    private modalService: BsModalService,
    private lookupServ: LookupService,
    private alertify: AlertifyService,
    private itemServ: ItemService,
    private fb: FormBuilder,
    private storeTransferServ: StoreTransferService
  ) {
    this.SearchFrom = this.formatDate(new Date());
    this.SearchTo = this.formatDate(new Date());
    this.pageName = 'التحويل المخزني';
    this.form = new FormGroup({
      branchId: new FormControl(1),
      companyId: new FormControl(1),
      storeConversionCode: new FormControl(null),
      sourceStoreId: new FormControl(null, Validators.required),
      storeId: new FormControl(null, Validators.required),
      storeConversionDate: new FormControl(this.formatDate(new Date())),
      storeConversionIsActive: new FormControl(true),
      isRecieved: new FormControl(false),
      isDeleted: new FormControl(false),
      createdOn: new FormControl(new Date()),
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

      this.lookupServ.lookupDetailsGetById(108).subscribe(
        (res) => {
          this.ItemUnits = res;
        },
        (err) => console.log(err)
      ),
    ]);
  }
  buildForm(Dto: StoreTransferDto) {
    this.form = this.fb.group({
      id: [Dto.id],
      branchId: [Dto.branchId],
      companyId: [Dto.companyId],
      storeConversionCode: [Dto.storeConversionCode],
      sourceStoreId: [Dto.sourceStoreId],
      storeId: [Dto.storeId],
      storeConversionDate: [this.formatDate(Dto.storeConversionDate)],
      storeConversionIsActive: [Dto.storeConversionIsActive],
      isRecieved: [Dto.isRecieved],
      isDeleted: [Dto.isDeleted],
      createdOn: [Dto.createdOn],
      notes: [Dto.notes],
      createdBy: [Dto.createdBy],
      lastUpdatedBy: [Dto.lastUpdatedBy],
      lastUpdatedOn: [Dto.lastUpdatedOn],
    });

    var store = this.lookupDetailsList.find((x) => x.id == Dto.storeId);
    if (store != null) {
      this.storeItems.nameL1 = store?.nameL1 == undefined ? '' : store?.nameL1;
      this.storeItems.code = store?.code == undefined ? 0 : store?.code;
    }

    var sourceStore = this.lookupDetailsList.find(
      (x) => x.id == Dto.sourceStoreId
    );
    if (sourceStore != null) {
      this.sourceStoreItems.nameL1 =
        sourceStore?.nameL1 == undefined ? '' : sourceStore?.nameL1;
      this.sourceStoreItems.code =
        sourceStore?.code == undefined ? 0 : sourceStore?.code;
    }
    this.buildListOfDetails(Dto);
  }
  buildListOfDetails(dto: StoreTransferDto) {
    dto.tblStoreConversionDtl.forEach((element) => {
      element.expireDate = this.formatDate(element.expireDate);
      let item = this.AllItemList.find((x) => x.id == element.itemId);
      element.itemName = item == undefined ? '' : item.nameL1;
      element.itemCode = item == undefined ? '' : item.code;
      let unit = this.ItemUnits.find((x) => x.id == element.unitId);
      element.unitName = unit?.nameL1 == undefined ? '' : unit.nameL1;
      element.unitCode = unit?.code == undefined ? 0 : unit.code;

    });
    this.storeTransferDtl = dto.tblStoreConversionDtl;
    if(this.storeTransferDtl.length==0){
      this.addNewRow(0);
    }
  }
  ngOnInit() {
    if (this.storeTransferDtl.length == 0) {
      this.addNewRow(0);
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
  openModal(template: TemplateRef<any>, type?: number, index?: number) {
    this.rowIndex = index == undefined ? 0 : index;
    if (type == 2) {
      this.GetAllStoreTransfer();
    }
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
        break;
      case 2:
        this.storeItems = item;
        break;
      case 3:
        if (this.storeTransferDtl[this.rowIndex].itemId == 0) {
          this.itemCard = item;
          console.log(item);
          this.storeTransferDtl[this.rowIndex].itemId = this.itemCard.id;
          this.storeTransferDtl[this.rowIndex].itemName = this.itemCard.nameL1;
          this.storeTransferDtl[this.rowIndex].itemCode = this.itemCard.code;
          this.getItemById(this.storeTransferDtl[this.rowIndex].itemId);
        } else {
          this.itemCard = item;
          console.log(item);
          this.storeTransferDtl[this.rowIndex].itemId = this.itemCard.id;
          this.storeTransferDtl[this.rowIndex].itemName = this.itemCard.nameL1;
          this.storeTransferDtl[this.rowIndex].itemCode = this.itemCard.code;
          this.storeTransferDtl[this.rowIndex].unitId = 0;
          this.storeTransferDtl[this.rowIndex].unitName = '';
          this.storeTransferDtl[this.rowIndex].unitCode = 0;
          this.getItemById(this.storeTransferDtl[this.rowIndex].itemId);
        }

        break;
      case 4:
        this.storeTransferDtl[this.rowIndex].unitId = item.unitId;
        this.storeTransferDtl[this.rowIndex].unitName = item.unitNameL1;
        this.storeTransferDtl[this.rowIndex].unitCode = item.unitCode;
        break;
      case 5:
        this.storeTransferServ.storeTransferGetById(item.id).subscribe(
          (res) => {
            this.buildForm(res);
            if(res.tblStoreConversionDtl.length==0){
              this.addNewRow(0);
            }
            console.log(res);
            this.alertify.success('تم استدعاء البيانات بنجاح');
          },
          (err) => {
            this.alertify.error('حدث خطا ما');
          }
        );
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
    if(index==1){
      if (item != null) {
        this.sourceStoreItems.id = item.id;
        this.sourceStoreItems.code = item.code;
        this.sourceStoreItems.nameL1 = item.nameL1;
      } else {
        this.alertify.error('لا يوجد مخزن بذلك الكود');
      }
    }else if(index==2){
      if (item != null) {
        this.storeItems.id = item.id;
        this.storeItems.code = item.code;
        this.storeItems.nameL1 = item.nameL1;
      } else {
        this.alertify.error('لا يوجد مخزن بذلك الكود');
      }
    }

  }
  save() {
    var validSave=false;
    this.storeTransferDto = this.form.value;

    if (this.storeTransferDto.storeCode == 0 ||
      this.storeTransferDto.storeId == 0 ||
      this.storeTransferDto.sourceStoreCode == '' ||
      this.storeTransferDto.sourceStoreId == 0 ||
      this.storeTransferDto.branchId == 0){
      this.alertify.error('برجاء ملئ البيانات الاساسية باكملها');
      return;
    }
    else {
       var count=0;
      this.storeTransferDtl.forEach((element) => {
        if (element.itemId == 0 ||
          element.itemId == null ||
          element.unitId == 0 ||
          element.unitId == null ||
          element.itemCode == '' ||
          element.itemCode == null ||
          element.unitCode == 0 ||
          element.unitCode == null ||
          element.itemQty == 0 ||
          element.itemQty == null
        ) {
          this.alertify.error(
            'برجاء مراجعه بيانات الجدول وملئ البيانات الاساسيه'
          );
          count++;
          return
        }
      });
      if(count==0){
        this.storeTransferDto.tblStoreConversionDtl=this.storeTransferDtl;
        this.storeTransferServ.AddEditStoreTransfer(this.storeTransferDto).subscribe(
          (res)=>{
            this.alertify.success("تم الحفظ بنجاح");
            this.storeTransferServ.storeTransferGetById(res.id).subscribe(
              (res) => {
                this.buildForm(res);
                if(res.tblStoreConversionDtl.length==0){
                  this.addNewRow(0);
                }
                // console.log(res);
                // this.alertify.success('تم استدعاء البيانات بنجاح');
              },
              (err) => {
                this.alertify.error('حدث خطا ما');
              }
            );
      },
          (err)=>{
            this.alertify.error("حدث خطا ما")
          }
        )
      }
  }
  }
  GetItemByCode(code: any, index: number) {
    let item = this.AllItemList.find((s) => s.code == code);
    if (item != null) {
      this.storeTransferDtl[index].itemId = item.id;
      this.storeTransferDtl[index].itemCode = item.code;
      this.storeTransferDtl[index].itemName = item.nameL1;
    } else {
      this.alertify.error('لا يوجد عنصر بذلك الكود');
      this.storeTransferDtl[index].itemId = 0;
      this.storeTransferDtl[index].itemCode = "";
      this.storeTransferDtl[index].itemName = "";
    }
  }
  GetUnitByCode(code: any, index: number){
    let unit = this.unitItemList.find((s) => s.unitCode == code);
    if (unit != null) {
      this.storeTransferDtl[index].unitId = unit.unitId;
      this.storeTransferDtl[index].unitCode = parseInt(unit.unitCode==undefined?"":unit.unitCode);
      this.storeTransferDtl[index].unitName = unit.unitNameL1;
    } else {
      this.alertify.error('لا يوجد وحدة بذلك الكود');
      this.storeTransferDtl[index].unitId = 0;
      this.storeTransferDtl[index].unitCode = 0;
      this.storeTransferDtl[index].unitName = "";
    }
  }
  addNewRow(index: number) {
    if (this.storeTransferDtl.length > 0) {
      // index=index==undefined?0:index;
      var length = this.storeTransferDtl.length - 1;
      if (
        this.storeTransferDtl[length].itemId != 0 &&
        this.storeTransferDtl[length].unitId != 0 &&
        this.storeTransferDtl[length].itemCode != '' &&
        this.storeTransferDtl[length].unitCode != 0 &&
        this.storeTransferDtl[length].itemQty != 0
      ) {
        var dto: StoreTransferDtlDto = new StoreTransferDtlDto();
        dto.expireDate = this.formatDate(new Date());
        this.storeTransferDtl.push(dto);
      } else {
        this.alertify.error(`من فضلك اكمل البيانات ف الصف رقم ${length + 1}`);
      }
    } else {
      var dto: StoreTransferDtlDto = new StoreTransferDtlDto();
      dto.expireDate = this.formatDate(new Date());
      this.storeTransferDtl.push(dto);
    }
  }
  getItemById(id: number): Observable<ItemDto> {
    this.itemServ.itemGetById(id).subscribe(
      (res) => {
        this.selectedItem = res;
        if (res.tblInvItemUnit.length > 1) {
          res.tblInvItemUnit.forEach((element: ItemUnitDto, index: number) => {
            var unit = this.ItemUnits.find((s) => s.id == element.unitId);
            res.tblInvItemUnit[index].unitId = unit?.id;
            res.tblInvItemUnit[index].unitCode = unit?.code;
            res.tblInvItemUnit[index].unitNameL1 = unit?.nameL1;
          });
        } else {
          var unit = this.ItemUnits.find(
            (s) => s.id == res.tblInvItemUnit[0].unitId
          );
          if (unit != null && unit != undefined) {
            console.log(unit);
            this.storeTransferDtl[this.rowIndex].unitId =
              res.tblInvItemUnit[0].invItemUnitId;
            this.storeTransferDtl[this.rowIndex].unitName =
              unit.nameL1 == undefined ? '' : unit.nameL1;
            this.storeTransferDtl[this.rowIndex].unitCode =
              unit.code == undefined ? 0 : unit.code;
          }
        }
        this.unitItemList = res.tblInvItemUnit;
        console.log(this.unitItemList);
        // this.unitItemList=this.selectedItem?.tblInvItemUnit;
      },
      (err) => {
        this.alertify.error('حدث خطأ ما');
      }
    );
    return of(
      this.selectedItem == undefined ? new ItemDto() : this.selectedItem
    );
  }
  GetAllStoreTransfer() {
    this.storeTransferServ.GetAllStoreTransferBulk().subscribe(
      (res) => {
        this.AllStoreTransfer = res;
        this.AllStoreTransfer.forEach(element => {
          var store=this.lookupDetailsList.find(x=>x.id==element.storeId);
          var sourceStore=this.lookupDetailsList.find(x=>x.id==element.sourceStoreId);
          element.storeName=store?.nameL1;
          element.sourceStoreName=sourceStore?.nameL1;
        });
      },
      (err) => {
        alert('failed');
      }
    );
  }
  deleteRow(index: number) {
    this.alertify.confirm('are you sure you want delete', () => {
      if(this.storeTransferDtl.length==1){
        this.alertify.error("لا يمكن حذف هذا الصف لان لابد ان يوجد صف واحد علي الاقل ");
      }else{
        if (this.storeTransferDtl[index].id != 0) {
          this.storeTransferDtl[index].isDeleted = true;
          this.save();
        } else {
          this.storeTransferDtl.splice(index, 1);
          if (this.storeTransferDtl.length == 0) {
            this.addNewRow(0);
          }
        }
      }

    });
  }
  isSelect(item: any, index: any) {
    var itemIsExist = this.selectedItems.find((x) => x == item.id);

    if (itemIsExist == undefined) {
      this.selectedItems.push(item?.id);
      this.AllStoreTransfer[index].isSelected = true;
    } else {
      this.selectedItems.forEach((element, index) => {
        if (element == item?.id) {
          this.selectedItems.splice(index, 1);
          this.AllStoreTransfer[index].isSelected = false;
        }
      });
    }
    console.log(this.selectedItems);
  }
  getItemBySelectedIds(type: number) {
    var id = 0;
    var length = this.selectedItems.length;
    if (length == 0) {
      this.alertify.error('برجاء تحديد العناصر المراد عرضها');
      return;
    }

    if (length == 0) {
      this.alertify.error('لا يوجد عناصر محددة للعرض');
    } else {
      switch (type) {
        case 1:
          this.selectedIndex = 0;
          id = this.selectedItems[0];
          break;
        case 2:
          this.selectedIndex = length - 1;
          id = this.selectedItems[length - 1];
          break;
        case 3:
          if (this.selectedIndex == length - 1)
            this.alertify.error('لا يوجد عناصر اخري لعرضها');
          if (this.selectedIndex < length - 1) {
            this.selectedIndex = this.selectedIndex + 1;
            id = this.selectedItems[this.selectedIndex];
          }
          break;
        case 4:
          if (this.selectedIndex == 0)
            this.alertify.error('لا يوجد عناصر اخري لعرضها');
          if (this.selectedIndex > 0) {
            this.selectedIndex = this.selectedIndex - 1;
            id = this.selectedItems[this.selectedIndex];
          }
          break;
        case 5:
          id = this.selectedItems[0];
          break;
      }
      if (id != 0) this.getStoreTransferById(id);
    }
    this.modalRef.hide();
  }
  getStoreTransferById(id:number){
    this.storeTransferServ.storeTransferGetById(id).subscribe(
      (res) => {
        this.isload = false;
        this.CurrentItem = res;
        this.buildForm(res);
      },
      (err) => {
        this.alertify.error('حدث خطا ما');
      }
    );
  }
  newStoreTransfer(){
    this.buildForm(new StoreTransferDto());
    this.form.get('branchId')?.setValue(1);
    this.storeTransferDtl=[];
    this.selectedItems=[];
    this.selectedIndex=0;
    this.CurrentItem=new StoreTransferDto();
    this.sourceStoreItems=new lookupDetailsDto();
    this.storeItems=new lookupDetailsDto();
    this.addNewRow(0);
  }
  deleteStoreTransfer(){
    if (this.CurrentItem.id == 0&&this.form.get('id')?.value==0) {
      this.alertify.error('برجاء اختيار العنصر المراد حذفه');
    }
    else if(this.form.get('id')?.value!=0){
      var storeTransfer=this.AllStoreTransfer.find(s=>s.id==this.form.get('id')?.value);
      if(storeTransfer!=null||storeTransfer!=undefined){
        Swal.fire({
          title: `هل تريد حذف العنصر ذو كود  : ${storeTransfer?.storeConversionCode} `,
          // text: "You won't be able to revert this!",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'نعم',
          cancelButtonText: 'لا',
        }).then((result) => {
          if(result.isConfirmed){
            this.CurrentItem.tblStoreConversionDtl.forEach((element, index) => {
              if (element.id == 0) {
                this.CurrentItem.tblStoreConversionDtl.splice(index, 1);
              } else {
                element.isDeleted = true;
              }
            });
            this.CurrentItem.isDeleted = true;
            console.log(this.CurrentItem);
            this.storeTransferServ.AddEditStoreTransfer(this.CurrentItem).subscribe(
              (res) => {
                Swal.fire(
                  'تم الحذف بنجاح',
                  ``,
                  'success'
                );
                this.newStoreTransfer();
                this.storeTransferServ.GetAllStoreTransferBulk().subscribe(
                  (res) => (this.AllStoreTransfer = res),
                  (err) => console.log(err)
                );
              },
              (err) => {
                Swal.fire(
                  'فشل ف حذف العنصر ','',
                  'error'
                );
              }
            );
          }

        });
      }

    }

    else {
      Swal.fire({
        title: `هل تريد حذف العنصر ذو كود  : ${this.CurrentItem.sourceStoreCode} `,
        // text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم',
        cancelButtonText: 'لا',
      }).then((result) => {
        if(result.isConfirmed){
          this.CurrentItem.tblStoreConversionDtl.forEach((element, index) => {
            if (element.id == 0) {
              this.CurrentItem.tblStoreConversionDtl.splice(index, 1);
            } else {
              element.isDeleted = true;
            }
          });
          this.CurrentItem.isDeleted = true;
          console.log(this.CurrentItem);
          this.storeTransferServ.AddEditStoreTransfer(this.CurrentItem).subscribe(
            (res) => {
              Swal.fire(
                'تم الحذف بنجاح','',
                'success'
              );
              this.newStoreTransfer();
              this.storeTransferServ.GetAllStoreTransferBulk().subscribe(
                (res) => (this.AllStoreTransfer = res),
                (err) => console.log(err)
              );
            },
            (err) => {
              Swal.fire(
                'فشل ف حذف العنصر','',
                'error'
              );
            }
          );
          }

      });
    }
  }
  Search() {
    debugger;
    var FilterList = this.AllStoreTransfer.filter(
      (x) => this.formatDate(x.createdOn) >=this.SearchFrom && this.formatDate(x.createdOn) <= this.SearchTo
    );
    if (FilterList.length != 0) {
      this.AllStoreTransfer = FilterList;
    }
  }
}
