import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemographicinfoComponent } from './demographicinfo/demographicinfo.component';
import { DemographicfilterPipe } from './pipes/demographicfilter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DemographicinfoComponent,
    DemographicfilterPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
