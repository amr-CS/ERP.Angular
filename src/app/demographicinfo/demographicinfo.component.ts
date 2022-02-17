import { Component } from '@angular/core';
import { empty } from 'rxjs';
import { Router } from '@angular/router';
import { DemographicInfo, DemographicInfoDetails } from '../interfaces/demographicInfo.interface';
import { DemoGraphicService } from '../services/demographic.service';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-demographicinfo',
  templateUrl: './demographicinfo.component.html',
  styleUrls: ['./demographicinfo.component.css']
})
export class DemographicinfoComponent {
  service: DemoGraphicService;
  router: Router;
  filterModel:string;
  demTypeIdModel:string;

  public demographic: DemographicInfo = { demTypeId: 0, typeDescEn: '', typeDescAr: '', demographicTypeDtltbl: [] };
  public demoGraphicList: DemographicInfo[] = [];
  public newDemoGraphicDetail: DemographicInfoDetails ={ choicesAr: '', choicesEn: '', weightValue: 0, demTypeDtlId: 0, demTypeId: 0 };


  constructor(service: DemoGraphicService, router: Router) {
    this.service = service;
    this.router = router;
    this.demoGraphicGetAll();
    this.filterModel = '';
    this.demTypeIdModel = '';
  }


  demoGraphicGetAll() {
    this.service.demoGraphicGetAll().subscribe(result => {
      this.demoGraphicList = result;
      console.log(result);
    }, error => console.error(error));
  }

  demoGraphicGetById(id: any) {
    if (id) {
      this.service.demoGraphicGetById(Number(id)).subscribe(result => {
        if (result !== null) {
          this.demographic = result;
          this.demTypeIdModel = String(result.demTypeId);
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
          this.reloadPage();
        }, error => alert('Not Found'));
      }
    }
    return isSuccess;

  }

  demoGraphicCreateUpdate() {
    //if (this.Validate()) {
      console.log(this.demographic);
      this.service.demoGraphicCreateUpdate(this.demographic).
        subscribe(result => {
          alert('Success');
          this.reloadPage();
        }, error => console.error(error));
    //}


  }

  reloadPage() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }


  removeDemoGraphicDetail(index:number) {
    this.demographic.demographicTypeDtltbl.splice(index, 1);
  }

  addDemoGraphicDetail() {
    this.newDemoGraphicDetail.demTypeId = this.demographic.demTypeId;
    if (this.demographic.demographicTypeDtltbl === null) {
      this.demographic.demographicTypeDtltbl = [];
    }
    this.demographic.demographicTypeDtltbl.push(this.newDemoGraphicDetail);
    this.newDemoGraphicDetail = { choicesAr: '', choicesEn: '', weightValue: 0, demTypeDtlId: 0, demTypeId: 0 };
  }  

  //Validate() {

  //  if (!this.demographic.typeDescAr) {
  //    return false;
  //  }
    

  //  return true;
  //}

// <----- modal ----->
  displayStyle = "none";  
  openPopup(): void {
    this.displayStyle = "block";
  }
  closePopup(): void {
    this.displayStyle = "none";
  }

}
