import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthserviceService } from '../_services/authservice.service';

@Component({
  selector: 'app-bulk-allotment',
  templateUrl: './bulk-allotment.component.html',
  styleUrls: ['./bulk-allotment.component.css']
})
export class BulkAllotmentComponent implements OnInit {
  tlName: any;
  tlSelected: any;
  usernames: any;
  form:any={recfromdate:'',rectodate:'',count:''}
  file: any;
  selectmetro: any;
  step: any;
  selectedRows: any;
  countRow: any;
  files: any;
  filescount: any;  
  shift: any;
  values: string;
  filesvalue: any;
  receivedDate: any;
  selectDate: any;
  selectCommerce: string;

  constructor(private authservice:AuthserviceService) { }

  ngOnInit(): void {
    this. getTl();
    this.getReceivedDates();   
  }
  getTl():void{
    this.authservice.getAllTl().subscribe((data) =>{
      this.tlName = data['recordset'];         
    })
  }
  getReceivedDates():void{
    this.authservice.getRecdDates().subscribe((data) =>{
      this.receivedDate = data['recordset'];
      //console.log("recddates="+this.receivedDate);
    })
  }
  ChangeValue(event:any){
    this.tlSelected = event;
    console.log(this.tlSelected);
    this.getUsers();
  }
  getUsers():void{
    this.authservice.getUsers(this.tlSelected).subscribe((data)=>{
      console.log(data);
      this.usernames = data['recordset'];
    })
  }
  getFiles():void{
    this.authservice.getFilesCount(this.selectDate).subscribe((data)=>{ 
      this.files = data['recordset'];     
      this.filescount = this.files.length;              
      //console.log(this.files );          
    })
  }
  onDateChange(value:any){
    this.selectDate = value;
    this.getFiles();
  }
  onChange(value:any){
    this.selectmetro = value;
    console.log(this.selectmetro);
  }
  stepChange(selectStep:any){
    this.step = selectStep;
    console.log(this.step);
  }
  shiftChange(shiftSelect:any){
    this.shift = shiftSelect;
  }
  onKey(event: any) { // without type info
    this.values = event.target.value;
    console.log("values="+this.values);
    this.filesvalue = +this.values * this.countRow ;      
  }
  onUserRowSelect(event:any) {
    this.selectedRows=event.selected;
    this.countRow = this.selectedRows.length;  
     console.log(this.selectedRows); 
              
 }
 changeCommerce(value:any):void{
  if(this.selectCommerce !='Select'){
    this.selectCommerce = value;
  }
}
 reloadpage(): void {
  window.location.reload();
}
  bulkAllot(){
    this.authservice.bulkAllot(this.selectedRows,this.selectmetro,this.step,this.form,this.shift,this.selectCommerce,this.selectDate).subscribe((data) =>{
      console.log(data);
      Swal.fire(data.msg);
      Swal.fire(data.err);
    })
    this.getFiles();
  }

  public settings = {
    
    columns: { 

      Username: {
        title: 'User Name',
        filter:false ,
        width: '110px',
        height:'20px'  
      },      
      Full_Name: {
        type:'html',
        title: 'Full Name',
        filter:false,
        width: '110px'            
      },      
      TL: {
        type:'html',
        title: 'TL',
        width: '110px',
        filter:false
      }           
    },
    pager: {
      display: true,
      perPage: 20
    },
    hideSubHeader: true,
    selectedRowIndex: -1,
    mode:"external",
    selectMode: 'multi',
    actions: false,      
    attr: {
      class: 'table table-bordered'
    },
    defaultStyle: false
  };
}
