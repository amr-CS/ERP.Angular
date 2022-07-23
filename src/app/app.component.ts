import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { LoaderService } from './Loader/loader.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isLoading: Subject<boolean> = this.loader.isLoading;
  title = 'DemoGraphicInfoAngular';
  public pageDirection :any ;
  helper = new JwtHelperService();
  token:any;
  constructor(
    private loader: LoaderService,
    private translateService:TranslateService,private authService:AuthService) {
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
  ngOnInit(): void {
    console.log(localStorage.getItem('token'))
       this.token =localStorage.getItem('token')
      if(this.token){
      this.authService.decodedToken=this.helper.decodeToken(this.token)
      }
    }

   _opened: boolean = true;

   funtogglesidebar() {
    this._opened = !this._opened;
  }


}
