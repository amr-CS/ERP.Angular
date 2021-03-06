import { Component } from '@angular/core';
import { empty } from 'rxjs';
import { DemographicInfo, DemographicInfoDetails } from '../interfaces/demographicInfo.interface';
import { DemoGraphicService } from '../services/demographic.service';
import { NgForm, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RowCommon } from '../interfaces/rowcommon.interface';
import { UtilityService } from '../services/utility.service';



@Component({
  selector: 'app-demographicinfo',
  templateUrl: './demographicinfo.component.html',
  styleUrls: ['./demographicinfo.component.css']
})
export class DemographicinfoComponent  {

  

  textFilterModel:string;
  dateFromFilterModel:Date;
  dateToFilterModel:Date;
  
  demTypeIdModel:string;
  public demographicColumns : Array<string>;
  public demographicRows : Array<RowCommon>;

  public demographic: DemographicInfo = { demTypeId: 0, typeDescEn: '', typeDescAr: '', demographicTypeDtltbl: []
  ,demTypeDate :''};
  public demoGraphicList: DemographicInfo[] = [];
  public newDemoGraphicDetail: DemographicInfoDetails ={ choicesAr: '', choicesEn: '', weightValue: '', demTypeDtlId: 0, demTypeId: 0 };
  

  constructor(private service: DemoGraphicService, public datePipe:DatePipe, public utilityService: UtilityService){
  
    this.demoGraphicGetAll();
    this.textFilterModel = '';    
    this.dateFromFilterModel = new Date();
    this.dateToFilterModel = new Date();


    this.demTypeIdModel = '';
    // Supported Columns & Rows for dynamic table
    this.demographicColumns = ['answer_description_ar','answer_description_en','weight'];
    this.demographicRows = [
      {propertyName:'choicesAr', isRequired:true, type:"text"},                            
      {propertyName:'choicesEn', isRequired:false, type:"text"},                            
      {propertyName:'weightValue', isRequired:true, type:"number"}
    ];

  }


  demoGraphicGetAll() {
    this.service.demoGraphicGetAll().subscribe(result => {
      this.demoGraphicList = result;
    }, error => console.error(error));
  }

  demoGraphicGetById(id: any) {
    if (id) {
      this.service.demoGraphicGetById(Number(id)).subscribe(result => {
        if (result !== null) {
          this.demographic = result;
          this.demTypeIdModel = String(result.demTypeId); 
          this.demographic.demTypeDate = this.datePipe.transform(this.demographic.demTypeDate,'yyyy-MM-dd') || '';          
        }
      }, error => console.error(error));
    }

  }

  demoGraphicDelete(id: string) {

    var isSuccess = false;
    if (id) {
      if (confirm('are you sure to delete DemoGraphic ' + id)) {
        this.service.demoGraphicDelete(Number(id)).subscribe(result => {
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
      this.service.demoGraphicCreateUpdate(this.demographic).
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
    if(this.demographic.demographicTypeDtltbl == null || this.demographic.demographicTypeDtltbl.length < 1)
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
