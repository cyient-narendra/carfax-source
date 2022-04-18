import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { data } from 'jquery';
import { Row } from 'ng2-smart-table/lib/lib/data-set/row';
import Swal from 'sweetalert2';
import { AuthserviceService } from '../_services/authservice.service';
import {ViewChild} from '@angular/core';
import {Ng2SmartTableComponent} from 'ng2-smart-table';


@Component({
  selector: 'app-workallotment',
  templateUrl: './workallotment.component.html',
  styleUrls: ['./workallotment.component.css']
})
export class WorkallotmentComponent implements OnInit {
  selected: string;popupDisplay:string="none";
  DC: any;
  QC: any;
  QA: any;
  rework: any;
  metro: any;
  nonmetro: any;
  new: any;
  modify: any; dcuser: any; qcuser: any; qauser: any; shipment: any;
  name: any;
  metrofiles: any;
  nonmetrofiles: any;
  showMetro: boolean = false;
  showNonMetro: boolean = false;
  nonmetrolength: number;
  metrolength: number;
  typeSelected: any;
  userSelected: any;
  dcselctedName: any;
  ng2selectedRows: any;
  public input: string = '<input type="checkbox"></input>';
  qcselectedName: any;
  qaselectedName: any;
  usertype: any;
  msg: any;
  dynamicArray: any;
  userall: [];
  selectedRowIds: Set<number> = new Set<number>();
  error: any;
  datePipe: any;
  selectedStep: any;
  selectCommerce: any;
  qcselctedName: any;
  qaselctedName: any;
  show: boolean;
  qa: boolean=true;
  qc: boolean;
  duplicate:string;state:string;agencyOri:string;dCName:string;dCCompDate:string;
  qCName:string;qCCompDate:string;receivedDate:string;
  ddlUserType:string='QA';
  statesdata: any;
  agencyoridata: any;
  receivedDatedata: any;
  stateSelectedValue: any;
  agencySelectedValue: string;
  receivedSelectedValue: any;
  qcnames: any;
  qanames: any;
  dcnamedata: any;
  dcNameSelectedValue: any;
  dcCompDateSelectedValue: any;
  qcNameSelectedValue: any;
  qcCompDateSelectedValue: any;
  dcCompdatedata: any;
  qcNamedata: any;
  qcCompDatedata: any;
  shipmentdata: any;
  shipmenttotal: any;
  showshipment: boolean;
  user:any;
  form:any={
    shipmentdate:'',selectValue:''
  }
  userAllotArray: any;

  constructor(private authservice: AuthserviceService, private _sanitizer: DomSanitizer) { }

  @ViewChild('table') table: Ng2SmartTableComponent;
  

  ngOnInit(): void {
    this.user = sessionStorage.getItem('userid');
    this.getDcname();    
  }
  onClick(value: any) {
    if (this.selectedStep != '') {
      this.selectedStep = value;
      console.log(this.selectedStep);
    }
  }
  onItemChange(value: any) {
    this.selected = value;    
  }
  onTypeChange(select: any) {
    this.typeSelected = select;
    console.log(this.typeSelected);
  }
  onuserChange(user: any) {
    this.userSelected = user;
    console.log(this.userSelected);
    if(this.userSelected == 'DC'){
      this.getDcname();
      this.show=true;
      this.qa=false;
      this.qc=false;
    }
    else if(this.userSelected == 'QC'){
      this.getDcname();
      this.qc=true;
      this.show=false;
      this.qa=false;
    }
    else if(this.userSelected == 'QA'){
      this.getDcname();
      this.qa = true;
      this.qc=false;
      this.show=false;
    }
  }
  changeCommerce(value: any): void {
    if (this.selectCommerce != 'Select') {
      this.selectCommerce = value;
    }
  }
  stateChange(value: any): void {
    if (this.stateSelectedValue != 'Select') {
      this.stateSelectedValue = value;
      console.log(this.stateSelectedValue);
    }
  }
  agencyChange(value: any): void {
    if (this.agencySelectedValue != 'Select') {
      this.agencySelectedValue = value;
      console.log(this.agencySelectedValue);
    }
  }
  receivedDateChange(value: any): void {
    if (this.receivedSelectedValue != 'Select') {
      this.receivedSelectedValue = value;
      console.log(this.receivedSelectedValue);
    }
  }
  dcNameChange(value: any): void {
    if (this.dcNameSelectedValue != 'Select') {
      this.dcNameSelectedValue = value;
      console.log(this.dcNameSelectedValue);
    }
  }
  dcCompDateChange(value: any): void {
    if (this.dcCompDateSelectedValue != 'Select') {
      this.dcCompDateSelectedValue = value;
      console.log(this.dcCompDateSelectedValue);
    }
  }
  qcNameChange(value: any): void {
    if (this.qcNameSelectedValue != 'Select') {
      this.qcNameSelectedValue = value;
      console.log(this.qcNameSelectedValue);
    }
  }
  qcCompDateChange(value: any): void {
    if (this.qcCompDateSelectedValue != 'Select') {
      this.qcCompDateSelectedValue = value;
      console.log(this.qcCompDateSelectedValue);
    }
  }
  getDcname() {
    this.authservice.getName().subscribe((data) => {
      this.name = data['recordsets'][0];
      this.qcnames = data['recordsets'][1];
      this.qanames = data['recordsets'][2];
      //console.log("dcname="+this.name);
    });
  }
  getMetroFiles() {
    this.authservice.getMetro(this.selectedStep, this.selectCommerce,this.stateSelectedValue,this.agencySelectedValue,this.receivedSelectedValue,this.selected,this.dcNameSelectedValue,this.dcCompDateSelectedValue,this.qcNameSelectedValue,this.qcCompDateSelectedValue).subscribe((data) => {
      this.metrofiles = data['recordset'];
      this.showMetro = true;
      this.metrolength = this.metrofiles.length;
      Swal.fire(data.msg);
    });
  }
  getNonmetroFiles() {
    this.authservice.getNonMetro(this.selectedStep, this.selectCommerce,this.stateSelectedValue,this.agencySelectedValue,this.receivedSelectedValue).subscribe((data) => {
      this.nonmetrofiles = data['recordset'];
      this.showNonMetro = true;
      this.nonmetrolength = this.nonmetrofiles.length;
    });
  }
  getStates() {
    this.authservice.getSates(this.selectedStep, this.selectCommerce,this.selected).subscribe((data) => {
      console.log('Statesdata',data);
      this.statesdata = data['recordset'];
    });
  }
  getAgencyori() {
    this.authservice.getAgencyori(this.selectedStep, this.selectCommerce,this.selected,this.stateSelectedValue).subscribe((data) => {
      console.log('AgencyOridata',data);
      this.agencyoridata = data['recordset'];
    });
  }
  getRecedDate() {
    this.authservice.getRecedDate(this.selectedStep, this.selectCommerce,this.selected,this.stateSelectedValue,this.agencySelectedValue).subscribe((data) => {
      console.log('RecdDatedata',data);
      this.receivedDatedata = data['recordset'];
    });
  }
  getdcNamework() {
    this.authservice.getdcNamework(this.selectedStep, this.selectCommerce,this.selected,this.stateSelectedValue,this.agencySelectedValue).subscribe((data) => {
      console.log('DcNamedata',data);
      this.dcnamedata = data['recordset'];
    });
  }
  getdcCompdatework() {
    this.authservice.getdcCompdatework(this.selectedStep, this.selectCommerce,this.selected,this.stateSelectedValue,this.agencySelectedValue).subscribe((data) => {
      console.log('data',data);
      this.dcCompdatedata = data['recordset'];
    });
  }
  getQcNamework() {
    this.authservice.getQcNamework(this.selectedStep, this.selectCommerce,this.selected,this.stateSelectedValue,this.agencySelectedValue).subscribe((data) => {
      console.log('data',data);
      this.qcNamedata = data['recordset'];
    });
  }
  getQcCompdatework(){
    this.authservice.getQcCompdatework(this.selectedStep, this.selectCommerce,this.selected,this.stateSelectedValue,this.agencySelectedValue).subscribe((data) => {
      console.log('data',data);
      this.qcCompDatedata = data['recordset'];
    });
  }
  getShipmentData(){
    this.authservice.getShipmentData(this.selectedStep, this.selectCommerce,this.selected,this.stateSelectedValue,this.agencySelectedValue,this.receivedSelectedValue,this.dcNameSelectedValue,this.dcCompDateSelectedValue,this.qcNameSelectedValue,this.qcCompDateSelectedValue).subscribe((data) => {
      console.log('data',data);
      this.shipmentdata = data['recordset'];
      this.shipmenttotal = this.shipmentdata.length;
      this.showshipment = true;
    });
  }
  //  dcUserChange(user:any,type:any){  
  //    if(this.dcselctedName == undefined || this.dcselctedName =='0' && this.usertype == 'dcuser'){
  //     this.dcselctedName = user;
  //     this.usertype = type;
  //     console.log("type="+this.usertype);
  //     console.log(this.dcselctedName);    
  //    }else{    
  //       if(this.usertype == 'qcuser' && this.dcselctedName == undefined || this.dcselctedName =='0'){
  //         this.dcselctedName = '';
  //         console.log(this.dcselctedName); 
  //       }
  //       else if(this.usertype =='qauser' && this.dcselctedName == undefined || this.dcselctedName =='0'){
  //         this.dcselctedName = '';
  //         console.log(this.dcselctedName); 
  //       }

  //    } 
  //  } 
  dcUserChange(user: any) {
    this.dcselctedName = user;
    console.log(this.dcselctedName);
  }
  qcUserChange(user: any) {
    this.qcselctedName = user;
    console.log(this.qcselctedName);
  }
  qaUserChange(user: any) {
    this.qaselctedName = user;
    console.log(this.qaselctedName);
  }
  getData(){
    // this.metrofiles = '';
    // this.nonmetrofiles = '';
    console.log(" Value is : ", this.selected);
    if (this.selectedStep == undefined || this.selectCommerce == undefined || this.selected == undefined) {
      Swal.fire("pLEASE sELECT rEQUIRED fIELDS");
    }
    else{
    this.getStates();
    this.getAgencyori();
    this.getRecedDate();
    this.getdcNamework();
    this.getdcCompdatework();
    if (this.selected == 'METRO') {
      //console.log("Hi");      
      this.showNonMetro = false;
   this.getMetroFiles();
    } else  {
      this.showMetro = false; 
      this.getMetroFiles();
    }
  }
    
  }

  onAllot() {
    try {
      if (this.selected == '' || this.userSelected == undefined || this.dcselctedName == '') {
        Swal.fire("pLEASE sELECT rEQUIRED fIELDS");
      }
      else if (this.userSelected != undefined || this.userSelected != 0 || this.dcselctedName != '') {
        this.authservice.allotmentMetro(this.selected, this.ng2selectedRows, this.typeSelected, this.userSelected, this.dcselctedName,this.qcselctedName,this.qaselectedName).subscribe((data) => {
          console.log(data);          
          Swal.fire(data.msg);          
        })
      }
    } catch (err) {
      console.log(err);

      Swal.fire(err);
    }
  }
  multiAllot() {
    try {
      if (this.userSelected == undefined || this.dcselctedName == '') {
        Swal.fire("pLEASE sELECT rEQUIRED fIELDS");
      }
      else if (this.dcselctedName != '') {
        this.authservice.multiAllot(this.userAllotArray, this.userSelected, this.dcselctedName,this.qcselctedName,this.qaselectedName).subscribe((data) => {
          console.log(data);          
          Swal.fire(data.msg);          
        })
      }
    } catch (err) {
      console.log(err);

      Swal.fire(err);
    }
  }
  onUserRowSelect(event: any) {
    this.ng2selectedRows = event.selected;
    console.log(this.ng2selectedRows);
  }
  reload(): void {
    window.location.reload();
  }

shipmentUpdate(){
  this.authservice.shipmentUpdate(this.ng2selectedRows,this.form,this.user).subscribe(data =>{
    console.log('data',data);
    Swal.fire(data.msg);
  })
}
myFunction() {
this.popupDisplay="block";
let size = this.form.selectValue;
let selectArrays = [];
for (let i=0; i< this.metrofiles.length; i+=size) {
  selectArrays.push(this.metrofiles.slice(i,i+size));
}
this.userAllotArray = selectArrays[0];
console.log(selectArrays);
console.log(this.userAllotArray);
//console.log(this.metrofiles);
  // this.table.grid.getRows().forEach((row) => {
  //     //this.table.grid.selectRow(row);
  //     //or :      
  //     this.table.grid.multipleSelectRow(row);

  // });
}
closePopup(){
  this.popupDisplay='none';  
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
        filter: false,
      },
      // pdf_name: {
      //   type:'html',
      //   title: 'pdf_name',
      //   filter:false 
      // },
      File_org_name: {
        type: 'html',
        title: 'File_org_name',
        filter: false
      },
      // City: {
      //   type:'html',
      //   title: 'City',
      //   filter:false
      // },
      County: {
        type: 'html',
        title: 'County',
        filter: false
      },
      state: {
        type: 'html',
        title: 'State',
        filter: true
      },
      ReceivedDate: {
        type: 'html',
        title: 'Received_Date',
        filter: false
      },
      DC_Name: {
        type: 'html',
        title: 'DC_Name',
        filter: false
      },
      DC_Status: {
        type: 'html',
        title: 'DC_Status',
        filter: false
      },
      QC_By: {
        type: 'html',
        title: 'QC_By',
        filter: false
      },
      QC_Status: {
        type: 'html',
        title: 'QC_Status',
        filter: false
      },
      QA_By: {
        type: 'html',
        title: 'QA_By',
        filter: false
      },
      QA_Status: {
        type: 'html',
        title: 'QA_Status',
        filter: false
      }

    },
    pager: {
      display: true,
      perPage: 2000
    },
    hideSubHeader: false,
    selectedRowIndex: -1,
    mode: "external",
    selectMode: 'multi',
    actions: false,
    attr: {
      class: 'table table-bordered'
    },
    defaultStyle: false
  };
}