import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 @Output() togglesidebare:EventEmitter<any>=new EventEmitter();

  lang:string;
  constructor(private translateService:TranslateService) {
    this.lang = 'ar-AR';
  }

  ngOnInit() {

  }
  toggleSidebar() {
    this.togglesidebare.emit();
  }
  
  changeLang(lang:string){    
    this.translateService.use(lang);    
  }

}
