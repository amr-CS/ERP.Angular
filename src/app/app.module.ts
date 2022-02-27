import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TableDetailsComponent } from './shared/table-details/table-details.component';
import { GlVoucherComponent } from './glvoucher/glvoucher.component';
import { GlVoucherFilterPipe } from './pipes/glvoucherfilter.pipe';

export function HttpLoaderFactory(http:HttpClient){
  return new TranslateHttpLoader(http,'./assets/i18n/','.json');
}


@NgModule({
  declarations: [				
    AppComponent,
    DemographicinfoComponent,
    DemographicfilterPipe,
      HeaderComponent,
      SidebarComponent,
      HomeComponent,
      DashboardComponent,
      TableDetailsComponent,
      GlVoucherComponent,
      GlVoucherFilterPipe
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
    MatListModule,

    TranslateModule.forRoot({
      defaultLanguage:'ar-AR',
      loader:{
        provide:TranslateLoader,
        useFactory:HttpLoaderFactory,
        deps:[HttpClient]
      }
    })
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
