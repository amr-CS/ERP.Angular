import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-Area',
  templateUrl: './Area.component.html',
  styleUrls: ['./Area.component.css']
})
export class AreaComponent {

 title = 'DemoGraphicInfoAngular';
  public pageDirection :any ;
  helper = new JwtHelperService();
  constructor(private translateService:TranslateService) {  
    this.pageDirection ="rtl";   
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) =>
    {
      if(event.lang == 'ar-AR')
      {
        this.pageDirection = 'rtl';
      } 
      else
      {
        this.pageDirection = 'ltr';
      }
    });
  }
  
   _opened: boolean = true;

   funtogglesidebar() {
    this._opened = !this._opened;
  }

}
