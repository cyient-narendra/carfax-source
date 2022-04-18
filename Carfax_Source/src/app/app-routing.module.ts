import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminboardComponent } from './adminboard/adminboard.component';
import { BulkAllotmentComponent } from './bulk-allotment/bulk-allotment.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { DataentryComponent } from './dataentry/dataentry.component';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { HomeComponent } from './home/home.component';
import { HyperdataentryComponent } from './hyperdataentry/hyperdataentry.component';
import { LoadComponent } from './load/load.component';
import { LoginComponent } from './login/login.component';
import { deliverycomponent } from './delivery/delivery.component';
import { SourcecopyComponent } from './sourcecopy/sourcecopy.component';
import { UploaddataComponent } from './uploaddata/uploaddata.component';
import { UserboardComponent } from './userboard/userboard.component';
import { WorkallotmentComponent } from './workallotment/workallotment.component';
import { DirectAccessGuard } from './_services/AuthGuard.service';
import { MISsyncComponent } from './missync/missync.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MultiplereportsComponent } from './multiplereports/multiplereports.component';
import { BulkmovingqaComponent } from './bulkmovingqa/bulkmovingqa.component';
import { HyperdashboardComponent } from './hyperdashboard/hyperdashboard.component';
import { SelfAllotmentComponent } from './self-allotment/self-allotment.component';
import { UserAccountbilityComponent } from './user-accountbility/user-accountbility.component';
import { ViewAndDeliveryComponent } from './view-and-delivery/view-and-delivery.component';


const routes: Routes = [
  {path:'home',component:HomeComponent,children:[
    {path:'uploaddata',component:UploaddataComponent},
    {path:'workallotment',component:WorkallotmentComponent},
    {path:'dataentry',component:DataentryComponent},
    {path:'hyperdata',component:HyperdataentryComponent},
    {path:'dialogbox',component:DialogBoxComponent},
    {path:'load',component:LoadComponent},
    {path:'sourcecopy',component:SourcecopyComponent},
    {path:'delivery',component:deliverycomponent},
    {path:'adminboard',component:AdminboardComponent},
    {path:'userboard',component:UserboardComponent},
    {path:'changepassword',component:ChangepasswordComponent},
    {path:'bulkallotment',component:BulkAllotmentComponent},
    {path:'missync',component:MISsyncComponent},
    {path:'dashboard',component:DashboardComponent},
    {path:'multiple',component:MultiplereportsComponent},
    {path:'bulkmovingqa',component:BulkmovingqaComponent},
    {path :'hyperdashboard',component:HyperdashboardComponent} ,         
    {path :'SelfAllotment',component:SelfAllotmentComponent} ,
    {path :'ViewAndDelivery',component:ViewAndDeliveryComponent} ,          
    {path :'UserAccountbility',component:UserAccountbilityComponent} ,         
  ]},  
  {path:'login',component:LoginComponent},  
  {path:'',redirectTo:'login',pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
