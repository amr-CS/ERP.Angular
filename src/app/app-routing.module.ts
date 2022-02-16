import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemographicinfoComponent } from './demographicinfo/demographicinfo.component';

const routes: Routes = [
  { path: '', component: DemographicinfoComponent },
  { path: 'demographicinfo', component: DemographicinfoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
