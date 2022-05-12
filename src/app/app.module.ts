import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
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
import { VoucherJournalComponent } from './voucherjournal/voucherjournal.component';
import { VoucherJournalFilterPipe } from './pipes/voucherjournalfilter.pipe';
import { LoginComponent } from './login/login.component';
import { AreaComponent } from './Area/Area.component';
import { AuthGuard } from './_guard/auth.guard';
import {MaterialExampleModule} from './material.module';
import {MatNativeDateModule} from '@angular/material/core';
import { ChartOfAccountComponent } from './chartOfAccount/chartOfAccount.component';
import { TreeComponentComponent } from './tree-component/tree-component.component';
import {MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import {A11yModule} from '@angular/cdk/a11y';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {OverlayModule} from '@angular/cdk/overlay';
import { TableDynamicArrayDataExampleComponent } from './TableDynamicArrayDataExample/TableDynamicArrayDataExample.component';
import { AccountfilterPipe } from './pipes/accountfilter.pipe';
import { CostcenterfilterPipe } from './pipes/costcenterfilter.pipe';
import { VoucherReceiptComponent } from './voucherreceipt/voucherreceipt.component';
import { NameCommonfilterPipe } from './pipes/namecommonfilter.pipe';
import { CurrencyfilterPipe } from './pipes/currencyfilter.pipe';
import { SecurityGradePipe } from './pipes/securityGrade.pipe';
import { UtilitiesComponent } from './utilities/utilities.component';
import { VoucherPaymentComponent } from './voucherpayment/voucherpayment.component';
import { VoucherJournalForCustomerComponent } from './voucherJournalForCustomer/voucherJournalForCustomer.component';
import { BranchsettingComponent } from './branchsetting/branchsetting.component';
import { BankComponent } from './bank/bank.component';
import { BankfilterPipe } from './pipes/bankfilter.pipe';
import { LookupComponent } from './lookup/lookup.component';
import { LookupfilterPipe } from './pipes/lookupfilter.pipe';
import { InvoicePipe } from './pipes/invoice.pipe';

import { InvoicePaymentOrderComponent } from './InvoicePaymentOrder/InvoicePaymentOrder.component';
import { InvoiceReceiptComponent } from './InvoiceReceipt/InvoiceReceipt.component';




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
      VoucherJournalComponent,
      VoucherJournalFilterPipe,
      LoginComponent,
      AreaComponent,
      ChartOfAccountComponent,
      TreeComponentComponent,
      TableDynamicArrayDataExampleComponent,
      AccountfilterPipe,
      CostcenterfilterPipe,
      VoucherReceiptComponent,
      NameCommonfilterPipe,       
      CurrencyfilterPipe,
      SecurityGradePipe,
      UtilitiesComponent,
      VoucherPaymentComponent,
      VoucherJournalForCustomerComponent,
      BranchsettingComponent,
      BankComponent,
      BankfilterPipe,
      LookupComponent,
      LookupfilterPipe,
      InvoicePipe,
      InvoicePaymentOrderComponent,
      InvoiceReceiptComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SidebarModule,
    BrowserAnimationsModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,

    TranslateModule.forRoot({
      defaultLanguage:'ar-AR',
      loader:{
        provide:TranslateLoader,
        useFactory:HttpLoaderFactory,
        deps:[HttpClient]
      }
    })
  ],
  providers: [DatePipe,
    AuthGuard,
  
  ],
  bootstrap: [
    AppComponent,
    //TreeComponent,

  ]
})
export class AppModule { }
