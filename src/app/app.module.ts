import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemographicinfoComponent } from './demographicinfo/demographicinfo.component';
import { DemographicfilterPipe } from './pipes/demographicfilter.pipe';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarModule } from 'ng-sidebar';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';



@NgModule({
  declarations: [				
    AppComponent,
    DemographicinfoComponent,
    DemographicfilterPipe,
      HeaderComponent,
      SidebarComponent,
      HomeComponent,
      DashboardComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SidebarModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatMenuModule,
    MatIconModule,
    MatListModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
