import { Component } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DemoGraphicInfoAngular';
  public pageDirection :any ;

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
