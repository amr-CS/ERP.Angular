import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaComponent } from './Area/Area.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DemographicinfoComponent } from './demographicinfo/demographicinfo.component';
import { GlVoucherComponent } from './glvoucher/glvoucher.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guard/auth.guard';


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
             { path: 'glvoucher', component: GlVoucherComponent }
          ]
}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
