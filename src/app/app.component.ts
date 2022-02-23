import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DemoGraphicInfoAngular';


   _opened: boolean = true;

   funtogglesidebar() {
    this._opened = !this._opened;
  }


}
