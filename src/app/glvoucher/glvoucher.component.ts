import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GlVoucher, GlVoucherDetails } from '../interfaces/glvoucher.interface';
import { RowCommon } from '../interfaces/rowcommon.interface';
import { GlVoucherService } from '../services/glvoucher.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-glvoucher',
  templateUrl: './glvoucher.component.html',
  styleUrls: ['./glvoucher.component.css']
})
export class GlVoucherComponent implements OnInit {
  textFilterModel:string;
  dateFromFilterModel:Date;
  dateToFilterModel:Date;

  glVoucherIdModel:string;
  public glVoucherColumns : Array<string>;
  public glVoucherRows : Array<RowCommon>;

  public glVoucher: GlVoucher = { demTypeId: 0, typeDescEn: '', typeDescAr: '', demographicTypeDtltbl: []
  ,demTypeDate :''};
  public glVoucherList: GlVoucher[] = [];
  public newGlVoucherDetail: GlVoucherDetails ={ choicesAr: '', choicesEn: '', weightValue: '', demTypeDtlId: 0, demTypeId: 0 };


  
  constructor(private service: GlVoucherService, public datePipe:DatePipe, public utilityService: UtilityService) {


    this.glVoucherGetAll();

    this.textFilterModel = '';
    this.dateFromFilterModel = new Date();
    this.dateToFilterModel = new Date();

    this.glVoucherIdModel = '';
    // Supported Columns & Rows for dynamic table
    this.glVoucherColumns = ['answer_description_ar','answer_description_en','weight'];
    this.glVoucherRows = [
      {propertyName:'choicesAr', isRequired:true, type:"text"},                            
      {propertyName:'choicesEn', isRequired:false, type:"text"},                            
      {propertyName:'weightValue', isRequired:true, type:"number"}];

    
   }

  ngOnInit(): void {
  }

  glVoucherGetAll() {
    this.service.glVoucherGetAll().subscribe(result => {
      this.glVoucherList = result;
    }, error => console.error(error));
  }

  demoGraphicGetById(id: any) {
    if (id) {
      this.service.glVoucherGetById(Number(id)).subscribe(result => {
        if (result !== null) {
          this.glVoucher = result;
          this.glVoucherIdModel = String(result.demTypeId); 
          this.glVoucher.demTypeDate = this.datePipe.transform(this.glVoucher.demTypeDate,'yyyy-MM-dd') || '';          
        }
      }, error => console.error(error));
    }

  }

  demoGraphicDelete(id: string) {

    var isSuccess = false;
    if (id) {
      if (confirm('are you sure to delete DemoGraphic ' + id)) {
        this.service.glVoucherDelete(Number(id)).subscribe(result => {
          isSuccess = result;
          this.utilityService.reloadComponent();
        }, error => alert('Not Found'));
      }
    }
    return isSuccess;

  }

  demoGraphicCreateUpdate(myForm:NgForm) {
    // force the UI validation to appear
    myForm.form.markAllAsTouched();
    
    if (this.Validate(myForm)) {
      this.service.glVoucherCreateUpdate(this.glVoucher).
        subscribe(result => {
          alert('Success');
          this.utilityService.reloadComponent();
        }, error => console.error(error));
    }    
  }

  // Date Filter
  isDateFilter = false;
  filterDemoGraphicListByDate(){   
    this.textFilterModel = '';
    this.isDateFilter = true;      
  }

  modalSearchKeyUp(){
    this.isDateFilter = false;   
  }
 

// UI Valiadtion When Submit
isDetailsEmpty = false;
Validate(myForm:NgForm) {
  this.isDetailsEmpty = false;
  if(this.glVoucher.demographicTypeDtltbl == null || this.glVoucher.demographicTypeDtltbl.length < 1)
  {     
    this.isDetailsEmpty = true;
    return false;
  }   
  if(!myForm.valid){
      return false;
  }
      
 return true;
}


  // <----- modal ----->
  displayStyle = "none";  
  openPopup(): void {
    this.displayStyle = "block";
    this.textFilterModel = '';
    this.dateFromFilterModel = new Date();
    this.dateToFilterModel =new Date();
    this.isDateFilter = false;
  }
  closePopup(): void {
    this.displayStyle = "none";
  }
}
