import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthserviceService } from '../_services/authservice.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class deliverycomponent implements OnInit {
  selected: any;
  metrofiles: string;
  nonmetrofiles: string;
  showNonMetro: boolean;
  showMetro: boolean;
  metrolength: number;
  nonmetrolength: number;
  metro:any;
  nonmetro:any;
  files: any;  
  filescount: any;
  selectedRows: any;
  selectDate: any;
  dateofDelivery: any;
  sessionuser: string;
  form:any={
    recdfrom:'',recdto:''
  }
  xmlfile: any;

  constructor(private authservice:AuthserviceService) { }

  ngOnInit(): void {
    this.sessionuser = sessionStorage.getItem('userid');
    //this.getdateofDelivery();
  }
  onItemChange(value:any){
   
    if(this.selected != ''){
      this.selected = value;
      console.log(this.selected);
    }
 }
 onDateChange(value:any){
  this.selectDate = value;  
}
getdateofDelivery():void{
  this.authservice.getDeliveryRecDate().subscribe((data) =>{
    this.dateofDelivery = data['recordset'];
    //console.log(this.dateofDelivery);
  })
}
 
getFiles():void{
  this.authservice.getdeliveryFilesCount(this.selected,this.form).subscribe((data)=>{ 
    this.files = data['recordset'];     
    this.filescount = this.files.length; 
    this.showMetro = true;             
    //console.log(this.files );          
  })
}
onUserRowSelect(event:any) {
  this.selectedRows=event.selected;   
   console.log(this.selectedRows);    
}
xmlexport():void{
  this.authservice.convertXML(this.selectedRows,this.sessionuser).subscribe((data) =>{
    //this.xmlfile = data.msg;
    Swal.fire(data.msg);
  })
}
public settings = {
    
  columns: { 
    // Check:{
    //   title: '',
    //   type: 'html',
    //   valuePrepareFunction: (value:any) => { return this._sanitizer.bypassSecurityTrustHtml(this.input); },
    //   filter: false
    //  },     
    agency_ori: {
      title: 'Agency_Ori',
      filter:false ,   
    },
    // pdf_name: {
    //   type:'html',
    //   title: 'pdf_name',
    //   filter:false 
    // },
    File_org_name: {
      type:'html',
      title: 'File_org_name',
      filter:false       
    },
    // City: {
    //   type:'html',
    //   title: 'City',
    //   filter:false
    // },
    County: {
      type:'html',
      title: 'County',
      filter:false
    }, 
    state: {
      type:'html',
      title: 'State',
      filter:true                       
    }, 
    Receiveddelivery: {
      type:'html',
      title: 'Received_Date',
      filter:false
    }, 
    report_number: {
      type:'html',
      title: 'Report_no',
      filter:false
    },
    report_type: {
      type:'html',
      title: 'Report_Type',
      filter:false
    },      
    File_Status:{
      type:'html',
      title: 'File_Status',
      filter:false
    },
    DC_Name:{
      type:'html',
      title: 'DC_Name',
      filter:false
    },
    QC_By:{
      type:'html',
      title: 'QC_By',
      filter:false
    },
    QA_By:{
      type:'html',
      title: 'QA_By',
      filter:false
    }
         
  },
  pager: {
    display: true,
    perPage: 1000
  },
  hideSubHeader: false,
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
