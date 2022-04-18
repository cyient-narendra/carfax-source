import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthserviceService } from '../_services/authservice.service';
import { ExcelService } from '../_services/excel.service';

@Component({
  selector: 'app-user-accountbility',
  templateUrl: './user-accountbility.component.html',
  styleUrls: ['./user-accountbility.component.css']
})
export class UserAccountbilityComponent implements OnInit {
  from:string;to:string;date:string;
  popupDisplay:string='none';
  stateSearch:string;
  time:number;
  userId:string;
  userName:string;
  showGrid:boolean=false;
  userAccData:any=[];
  timeByUserData:any=[];
  filterTerm!: string;
  Step:string;
  gridpnl:boolean=true;
  editpnl:boolean=false;
  editform:any={Date:'',UName:'',State:'',Map:'',Step:'',Time:''}
  ID:string;Isdisable:boolean=false;wsml:String;
  constructor(private authService:AuthserviceService, private excelService:ExcelService) { }

  ngOnInit(): void {
    this.userId=sessionStorage.getItem('usernumber');
    this.userName=sessionStorage.getItem('userid');
    this.wsml=sessionStorage.getItem('wsml');
    console.log('userid', this.userId);
    console.log('wsm', this.wsml);
    
  }
  Getdata(){
    this.userAccData=[];
    if(this.wsml=="true"){
    this.authService.getUserAccountbility(this.from,this.to,'ALL').subscribe(data => {
      console.log('ac',data);
       this.userAccData= data.recordset;
       this.showGrid=true;
        })
      }
      else if(this.wsml=="false"){
        this.authService.getUserAccountbility(this.from,this.to,this.userId).subscribe(data => {
          console.log('ac',data);
           this.userAccData= data.recordset;
           this.showGrid=true;
            })
      }
  }
  GettimeUser(type: string) {
    this.Step=type;
    this.authService.getTimeByUser(type, this.from,this.to, this.userName,'').subscribe(data => {
      console.log('time', data);
      this.timeByUserData = data.recordset;
      this.popupDisplay = 'block';
      if( this.timeByUserData.length>0)
      this.Isdisable=false;
      else
      this.Isdisable=true;
    })
  }
  Searchbystate(){
    if(this.stateSearch=='' || this.stateSearch==undefined){
      Swal.fire({text:"Please Enter State" , icon: 'warning'});
   
  }
  else{
    this.authService.getTimeByUser(this.Step, this.from,this.to,this.userName,this.stateSearch).subscribe(data => {
      console.log('ser_time', data);
      this.popupDisplay = 'block';
      this.timeByUserData = data.recordset;
      if( this.timeByUserData.length>0)
      this.Isdisable=false;
      else
      this.Isdisable=true;
    })
  }
  }
  UpadteAll() {
    if (this.time == 0 || this.time == undefined) {
      Swal.fire({ text: "Please Enter The Time", icon: 'warning' });
    }
    else {
      let allIds = []; let Ids = ''; let arrylen = 0; let textval = 0; let timeResult = 0; let totalids = 0
      for (var x = 0; x < this.timeByUserData.length; x++) {
        allIds.push(this.timeByUserData[x].UID);
      }
      Ids = allIds.toString();
      console.log('ids', Ids);
      console.log('ids', totalids);
      arrylen = this.timeByUserData.length;
      textval = this.time;
      timeResult = textval / arrylen;
      // console.log('divide',timeResult);
      this.authService.UpdateAllByUser(Ids, timeResult.toString(), this.Step).subscribe(data => {
        if (data.rowsAffected.length > 0) {
          Swal.fire({ text: 'Updated Successfully', icon: 'success' })
          this.GettimeUser(this.Step);
        }
        else {
          Swal.fire({ text: 'Updation Failed', icon: 'error' });
        }
      })
    }
  }
  update(){
    if(this.editform.Time=="" ||this.editform==undefined){
      Swal.fire({text:"Please Enter The Time" , icon: 'warning'});
    }
    else{
    this.authService.UpdateAllByUser(this.ID,this.editform.Time,this.Step).subscribe(data => {
      console.log('singleupdated', data);
     if (data.rowsAffected.length > 0) {
          Swal.fire({ text: 'Updated Successfully', icon: 'success' })
      this.GettimeUser(this.Step);
      this.ID='0';
      this.gridpnl=true;
      this.editpnl=false;
     }
     else{
      Swal.fire({ text: 'Updation Failed', icon: 'error' });
     }
    })
  }
  }
  editrecord(data:any){
   this.gridpnl=false;
   this.editpnl=true;
   console.log(data);
   this.ID=data.UID.toString();
   this.editform.Date=data.Date;
   this.editform.UName=data.UName;
   this.editform.State=data.State;
   this.editform.Map=data.Map;
   this.editform.Step=data.Step;
   this.editform.Time=data.Time;
  }
  openpopup(){
   this.popupDisplay='block';
  }
  closePopup(){
   this.popupDisplay='none';
   this.Step='';
   this.stateSearch='';
   this.timeByUserData=[];
   this.gridpnl=true;
   this.editpnl=false;
  }
  exportAsXLSX(): void {
    if(this.userAccData .length>0){
      this.excelService.exportAsExcelFile(this.userAccData , 'UserAccoutibility');
      Swal.fire({ text: 'Download Successfully', icon: 'success' })
      }
      else
      Swal.fire({ text: 'No Data Found', icon: 'error' });
    
  }
  exportAsXLSXForTimeSheet(): void {
    if(this.timeByUserData .length>0){
      this.excelService.exportAsExcelFile(this.timeByUserData, 'TimeSheet');
      Swal.fire({ text: 'Download Successfully', icon: 'success' })
      }
      else
      Swal.fire({ text: 'No Data Found', icon: 'error' });
    
  }
  checkDates() {
    
    let from:Date = new Date (this.from);
    let to:Date = new Date (this.to);
    if( from > to) {
      Swal.fire({ text: 'From date must be greater than To date', icon: 'warning' });
      this.to="";
    }
 }
}
