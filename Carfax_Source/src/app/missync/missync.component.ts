import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import { Subscriber } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthserviceService } from '../_services/authservice.service';

@Component({
  selector: 'app-missync',
  templateUrl: './missync.component.html',
  styleUrls: ['./missync.component.css']
})
export class MISsyncComponent implements OnInit {
  dcselctedName: any;
  usertype: string;
  name: any;
  stepSelected: any;
  tlName: any;
  tlSelected: any;
  service: any;
  state: any;
  
  metro:any;
  nonmetro:any;
  form:any={
    recdfromdate:'',recdtodate:'',timehrs:''
  }
  show: boolean;
  qc: boolean;
  qa: boolean;
  user: string;
  userid: string;
  selectedService: any;
  selectedState: any;
  selectedstep: any;
  selectedtype: any;
  dcselected: any;
  qcselected: any;
  qaselected: string;
  misdata: any;
  ng2selectedRows: any;
  showmis: boolean;
  mislength: any;
  userselected: any;
  showuser: boolean;
  showshipment: boolean;
  qcnames: any;
  qanames: any;

  constructor(private authservice:AuthserviceService) { }

  ngOnInit(): void {
    this.getTLNames();
    this.getServiceState();
    this.user=sessionStorage.getItem('username');
    this.userid = sessionStorage.getItem('usernumber');
    this.getDcname();  
  }  
  getDcname(){
    this.authservice.getName().subscribe((data)=>{
      this.name = data['recordsets'][0];
      this.qcnames = data['recordsets'][1];
      this.qanames = data['recordsets'][2];
    });
  }
  selectChange(value:any):void{
    this.stepSelected = value;    
    console.log(this.stepSelected);
    if(this.stepSelected == 'DC' || this.stepSelected == 'Received'){
      this.getDcname();
      this.show=true;
      this.qa=false;
      this.qc=false;
    }
    else if(this.stepSelected == 'QC'){
      this.getDcname();
      this.qc=true;
      this.show=false;
      this.qa=false;
    }
    else if(this.stepSelected == 'QA'){
      this.getDcname();
      this.qa = true;
      this.qc=false;
      this.show=false;
    }
  }
  getTLNames():void{
    this.authservice.getAllTl().subscribe((data) =>{
      this.tlName = data['recordset'];
    })
  }
  ChangeValue(event:any){
    this.tlSelected = event;
    console.log(this.tlSelected);
    
  }
  getServiceState():void{
    this.authservice.getServiceState().subscribe((data) => {
      this.service = data['recordset'];
      this.state = data['recordsets'][1];
      //console.log(this.state);
    })
  }
  onItemChange(type:any){   
    if(this.selectedtype != ''){
      this.selectedtype = type;
      console.log(type);
    }
 } 
 selectStep(step:any){   
  if(this.selectedstep != ''){
    this.selectedstep = step;
    this.showuser = false;
    this.showshipment = false;
    if(this.selectedstep == "Inventory"){
    this.showuser = true;
    this.showshipment = false;
    Swal.fire("Please Select User & Time");}
    if(this.selectedstep == "Shipment"){
    this.showshipment = true;
    this.showuser = false;
    Swal.fire("Please Select Shipmentuser & ShipTime");}
    console.log(step);
  }
}
serviceSelect(type:any){   
  if(this.selectedService != ''){
    this.selectedService = type;
    console.log(this.selectedService);
  }
}
stateSelect(type:any){   
  if(this.selectedState != ''){
    this.selectedState = type;
    console.log(this.selectedState);
  }
}
dcSelect(dcname:any){
  if(this.dcselected != ''){
    this.dcselected = dcname;
    console.log(this.dcselected);
  }
}
qcSelect(qcname:any){
  if(this.qcselected != ''){
    this.qcselected = qcname;
    console.log(this.qcselected);
  }
}
qaSelect(qaname:any){
  if(this.qaselected != ''){
    this.qaselected = qaname;
    console.log(this.qaselected);
  }
}
userSelect(user:any){
  this.userselected = user;  
}
getData():void{
  if(this.form == undefined || this.selectedService == undefined || this.stepSelected == undefined || this.selectedtype == undefined){
    Swal.fire("Please Select Dates,Data Type,Service,Metro Type")
  }  
  else{
  this.authservice.getMISData(this.userid,this.user,this.form,this.stepSelected,this.selectedService,this.selectedState,this.dcselected,this.qcselected,this.qaselected,this.tlSelected,this.selectedtype).subscribe((data) =>{
    console.log(data);
    this.misdata = data['recordset'];
    this.showmis = true;
    this.mislength = this.misdata.length;    
  })
  }
}
onUserRowSelect(event:any) {
  this.ng2selectedRows=event.selected;  
   console.log(this.ng2selectedRows);    
}
misSync():void{  
  if(this.selectedstep != undefined){
  this.authservice.misSync(this.ng2selectedRows,this.selectedstep,this.userselected,this.form).subscribe((data) =>{
    console.log(data);
    if(data['recordsets'] != '' || data['recordsets'] != undefined)
    Swal.fire(data.msg,'!Success','success');
    else{
      Swal.fire(data.err, 'Something went wrong!', 'error');
    }    
    //alert(data.msg);
    //alert(data.error);
  })
}
else{
  Swal.fire("Please select Step")
}
}
public missettings = {
  
  columns: {

    EmpID: {
      title: 'Emp ID',
      filter: false
    },
    Datec: {
      type: 'html',
      title: 'Datec',
      filter: false      
    },
    Process: {
      type: 'html',
      title: 'Process',
      filter: false
    },
    Area: {
      type: 'html',
      title: 'Area',
      filter: false      
    },
    Batch: {
      type: 'html',
      title: 'Batch',
      filter: false      
    },
    Typeofmap:{
      type:'html',
      title: 'Typeofmap',
      filter: false
    },
    Map:{
      type:'html',
      title: 'Map',
      filter: false
    },
    Foldername:{
      type:'html',
      title: 'Foldername',
      filter: false
    },
    Priority:{
      type:'html',
      title: 'Priority',
      filter: false
    },
    Recevdfrom:{
      type:'html',
      title: 'Recevdfrom',
      filter: false
    },
    Recevdby:{  
      type:'html',
      title: 'Recevdby',
      filter: false
    },
    instdate:{
      type:'html',
      title: 'instdate',
      filter: false
    },
    TotalKMS:{
      type:'html',
      title: 'TotalKMS',
      filter: false
    },
    Allotedto:{
      type:'html',
      title: 'Allotedto',
      filter: false
    },
    Scale:{
      type:'html',
      title: 'Scale',
      filter: false
    },
    Propshipdate:{
      type:'html',
      title: 'Propshipdate',
      filter: false
    },
    GL:{
      type:'html',
      title: 'GL',
      filter: false
    },
    Taskmanager:{
      type:'html',
      title: 'Taskmanager',
      filter: false
    },
    DC_name:{
      type:'html',
      title: 'DC_name',
      filter: false
    },
    QC_by:{
      type:'html',
      title: 'QC_by',
      filter: false
    },
    QA_By:{
      type:'html',
      title: 'QA_By',
      filter: false
    },
  },
  pager: {
    display: true,
    perPage: 1200
  },
  hideSubHeader: true,
  selectedRowIndex: -1,
  mode: 'inline',
  actions: false,
  selectMode: 'multi',    
  attr: {
    class: 'table table-bordered table-hover'
  },
  defaultStyle: false
};
}
