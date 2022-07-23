import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaComponent } from './Area/Area.component';
import { ChartOfAccountComponent } from './chartOfAccount/chartOfAccount.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DemographicinfoComponent } from './demographicinfo/demographicinfo.component';
import { VoucherJournalComponent } from './voucherjournal/voucherjournal.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guard/auth.guard';
import { VoucherReceiptComponent } from './voucherreceipt/voucherreceipt.component';
import { VoucherPaymentComponent } from './voucherpayment/voucherpayment.component';
import { VoucherJournalForCustomerComponent } from './voucherJournalForCustomer/voucherJournalForCustomer.component';
import { BranchsettingComponent } from './branchsetting/branchsetting.component';
import { BankComponent } from './bank/bank.component';
import { LookupComponent } from './lookup/lookup.component';
import { InvoicePaymentOrderComponent } from './InvoicePaymentOrder/InvoicePaymentOrder.component';
import { InvoiceReceiptComponent } from './InvoiceReceipt/InvoiceReceipt.component';
import { InvoiceOrderComponent } from './invoice-order/invoice-order.component';
import { AccountCategoryComponent } from './account-category/account-category.component';
import { ItemsCardComponent } from './items-card/items-card.component';
import { CustomersComponent } from './Customers/Customers.component';
import { StoreTransferComponent } from './store-transfer/store-transfer.component';



const routes: Routes = [
  /*{ path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'demographicinfo', component: DemographicinfoComponent }*/




  { path: '', component: LoginComponent},
  { path: 'Area', component: AreaComponent,
    canActivate:[AuthGuard],
          children: [
             { path: 'demographicinfo', component: DemographicinfoComponent},
             { path: 'home', component: HomeComponent},
             { path: 'dashboard', component: DashboardComponent},
             { path: 'voucherjournal', component: VoucherJournalComponent },
             { path: 'voucherreceipt', component: VoucherReceiptComponent },
             { path: 'voucherpayment', component: VoucherPaymentComponent },
             { path: 'ChartOfAccount', component: ChartOfAccountComponent},
             { path: 'voucherjournalForCustomer', component: VoucherJournalForCustomerComponent },
             { path: 'branchsetting', component: BranchsettingComponent },
             { path: 'bank', component: BankComponent },
             { path: 'lookup', component: LookupComponent },
             { path: 'AccountCategory', component: AccountCategoryComponent},
             { path: 'ChartOfAccount', component: ChartOfAccountComponent},
             { path: 'InvoicePaymentOrder', component: InvoicePaymentOrderComponent},
             { path: 'InvoiceReceipt', component: InvoiceReceiptComponent},
             { path: 'InvoiceOrder', component: InvoiceOrderComponent},
             { path: 'ItemCard', component: ItemsCardComponent},
             { path: 'Customers', component: CustomersComponent},
             {path:'StoreTransfer',component:StoreTransferComponent}

          ]
}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
