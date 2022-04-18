import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UploaddataComponent } from './uploaddata/uploaddata.component';
import { WorkallotmentComponent } from './workallotment/workallotment.component';
import { DataentryComponent } from './dataentry/dataentry.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoadComponent } from './load/load.component';
import { SourcecopyComponent } from './sourcecopy/sourcecopy.component';
import { deliverycomponent } from './delivery/delivery.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthserviceService } from './_services/authservice.service';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { ToastrModule } from 'ngx-toastr';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgbdSortableHeader } from './sortable.directive';
import { DirectAccessGuard } from './_services/AuthGuard.service';
import { HyperdataentryComponent } from './hyperdataentry/hyperdataentry.component';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { AdminboardComponent } from './adminboard/adminboard.component';
import { UserboardComponent } from './userboard/userboard.component';
import { HttpErrorInterceptor } from './_services/http-error.interceptor';
import { BulkAllotmentComponent } from './bulk-allotment/bulk-allotment.component';
import { SharingService } from './_services/sharing.service';
import { MISsyncComponent } from './missync/missync.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MultiplereportsComponent } from './multiplereports/multiplereports.component';
import { BulkmovingqaComponent } from './bulkmovingqa/bulkmovingqa.component';
import { HyperdashboardComponent } from './hyperdashboard/hyperdashboard.component';
import { GlobalErrorHandler } from './_services/global-error-handler';
import { SelfAllotmentComponent } from './self-allotment/self-allotment.component';
import { UserAccountbilityComponent } from './user-accountbility/user-accountbility.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ViewAndDeliveryComponent } from './view-and-delivery/view-and-delivery.component';
import { ExcelService } from './_services/excel.service';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UploaddataComponent,
    WorkallotmentComponent,
    DataentryComponent,
    LoadComponent,
    SourcecopyComponent,
    deliverycomponent,
    LoginComponent,
    ChangepasswordComponent,
    NgbdSortableHeader,
    HyperdataentryComponent,
    DialogBoxComponent,
    AdminboardComponent,
    UserboardComponent,
    BulkAllotmentComponent,
    MISsyncComponent,
    DashboardComponent,
    MultiplereportsComponent,
    BulkmovingqaComponent,
    HyperdashboardComponent,
    SelfAllotmentComponent,
    UserAccountbilityComponent,
    ViewAndDeliveryComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2SmartTableModule,
    MatFormFieldModule,
    MatTableModule,  
    Ng2SearchPipeModule,      
    ToastrModule.forRoot()
  ],
  providers: [UploaddataComponent,AuthserviceService,LoginComponent,DirectAccessGuard,SharingService, ExcelService,
    {provide: HTTP_INTERCEPTORS,useClass: HttpErrorInterceptor,multi: true},GlobalErrorHandler],
  bootstrap: [AppComponent]  
})
export class AppModule { }
