import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../_services/authservice.service';
import { map } from 'rxjs/operators'
import Swal from 'sweetalert2';
import { ExcelService } from '../_services/excel.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

declare let $: any;
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'app-view-and-delivery',
  templateUrl: './view-and-delivery.component.html',
  styleUrls: ['./view-and-delivery.component.css']
})


export class ViewAndDeliveryComponent implements OnInit {
  isMetro:boolean=true;
  isNOnMetro:boolean=false;
  type:string="METRO";
  revFrom:string;
  revTo:string;
  delFrom:string;
  alreadyDelivery:string='N';
  delTo:string;commersType:string="";state:string="";Agency:string="";ReportType:string="";
  QABy:string="";QCBy:string="";StatesData:any=[];AgencyOriData:any=[];AssocitesData:any=[];
  searchResultData:any=[];
  delivery:boolean=false;allchk:any;popupDisplay:string="";
   parties:any;  passingers:any;  vehicles:any;
  sessionuser: string;
  constructor(private authService:AuthserviceService, private excelService:ExcelService) { }

  ngOnInit(): void {
    this.sessionuser = sessionStorage.getItem('userid');
    this.getAssocites();
    // $('#myCheckbox').attr('checked', false);
    // let elm = document.getElementById("myCheckbox");
    
  }
  changeText(text: string) {
    if (text == 'METRO') {
      this.isMetro = true;
      this.isNOnMetro = false;
    }
    else {
      this.isMetro = false;
      this.isNOnMetro = true;
    }
  }
 
  
  resetcommerce(){
    this.commersType="";
    this.state="";
  }
  ddlStatesBind(){
    this.StatesData=[];
    let commerce="";let from ="";let to="";
    commerce=(this.commersType=="All"|| this.commersType=="")?commerce="%":commerce=this.commersType;
    from=(this.revFrom==undefined||this.revFrom=='')?'':this.revFrom;
    to=(this.revTo==undefined||this.revTo=='')?'':this.revTo;
    this.authService.ddlStates(from,to,commerce,this.type).subscribe(data => {
    console.log('ddl',data);
    this.StatesData=data.recordset;
    });
  }
  ddlAgencyOriBind(){
    this.AgencyOriData=[];
    let commerce="";let from ="";let to="";
    commerce=(this.commersType=="All"|| this.commersType=="")?commerce="%":commerce=this.commersType;
    from=(this.revFrom==undefined||this.revFrom=='')?'':this.revFrom;
    to=(this.revTo==undefined||this.revTo=='')?'':this.revTo;
    this.authService.ddlAgencyOri(from,to, commerce,this.state,this.type).subscribe(data => {
    console.log('ddlA',data);
    this.AgencyOriData=data.recordset;
    });
  }
  getAssocites(){
    this.AssocitesData=[];
    this.authService.getAssociates().subscribe(data => {
    console.log('ddlQ',data);
    this.AssocitesData=data.recordset;
    });
  }
  checkDeliveryStatus(event:any) {
    if (event.target.checked == true) {
      this.alreadyDelivery = 'Y';
      this.delivery=true;
    }
    else {
      this.alreadyDelivery= 'N';
      this.delivery=false;

    }
  }
  getSearchData(){
    let commerce="";let from ="";let to="";let d_from="";let d_to="";let state="";let agency="";let reportType="";let QcBy="";let QaBy="";
    if(this.commersType==""|| this.state==""||this.Agency==""){
      Swal.fire({ text: 'Please select All (*) Mandatory fields', icon: 'warning' })
    }
    else{
    
    from=(this.revFrom==undefined||this.revFrom=='')?'':this.revFrom;
    to=(this.revTo==undefined||this.revTo=='')?'':this.revTo;
    d_from=(this.delFrom==undefined||this.delFrom=='')?'':this.delFrom;
    d_to=(this.delTo==undefined||this.delTo=='')?'':this.delTo;
    commerce=(this.commersType=="All"|| this.commersType=="")?commerce="%":commerce=this.commersType;
    state=(this.state=="All"|| this.state=="")?commerce="%":state=this.state;
    agency=(this.Agency=="All"|| this.Agency=="")?agency="%":agency=this.Agency;
    reportType=(this.ReportType=="All"|| this.ReportType=="")?reportType="%":reportType=this.ReportType;
    QcBy=( this.QCBy=="")?QcBy="%":QcBy=this.QCBy;
    QaBy=( this.QABy=="")?QaBy="%":QaBy=this.QABy;
    this.authService.getSearchData(from,to,d_from,d_to,commerce,state,agency,reportType,this.alreadyDelivery, QcBy,QaBy,this.type).subscribe(data => {
    console.log('serach',data);
    this.searchResultData=data.recordset;
    this.popupDisplay='block';
   
    });
  }
  }
  closepopup(){
    this.popupDisplay='none';
    this.searchResultData=[];
  }
  checkitems(event:any){
    console.log('pp', event.target.checked);
     this.searchResultData.map((x: { Selected: boolean; }) => {
      if(event.target.checked){
        x.Selected = true;
      }else{
        x.Selected = false;
      }
    }
     )
   
     console.log('tfinal',  this.searchResultData);
  }
  CheckSingle(e:any){
    if(e.target.checked == false){
      this.allchk = false;
    }else{
      this.searchResultData.map((x: { Selected: boolean; }) => {
        if(x.Selected === true){
          this.allchk = true;
        }else{
          this.allchk = false;
        }
      });
    }
    console.log('fbfinal2',  this.searchResultData);
  }
  exportAsXLSXForSearchData(): void {
    let obj_arry=[]; let obj_arry1=[]; let Ids='';
  
    if(this.searchResultData.length>0){
    for (let y = 0; y <  this.searchResultData.length; y++) {
      if(this.searchResultData[y].Selected== true)
      obj_arry.push(this.searchResultData[y]);
    }
console.log('excel',obj_arry);

for (let i = 0; i <  obj_arry.length; i++) {
  obj_arry1.push(obj_arry[i].UID);
}
 Ids = obj_arry1.toString();
 this.getViwAndDeliveryAll(Ids);
// this.excelService.exportAsExcelFile(obj_arry, 'ViewAndDelivery');
    const worksheetForACC: XLSX.WorkSheet = XLSX.utils.json_to_sheet(obj_arry);
    const worksheetForVEH: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.vehicles);
    const worksheetForPass: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.passingers);
    const worksheetForPAR: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.parties);
    const workbook: XLSX.WorkBook = { Sheets: {'Accident':worksheetForACC,'Vehicles':worksheetForVEH,'Parties':worksheetForPAR,'passengers':worksheetForPass},
     SheetNames: ['Accident','Vehicles','Parties','passengers'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }); 
    this.saveAsExcelFile(excelBuffer, 'ViewAndDelivery');
      Swal.fire({ text: 'Download Successfully', icon: 'success' });
      obj_arry=[];
      this.parties=[];
      this.vehicles=[];
      this.passingers=[];
  }
  else
    Swal.fire({ text: 'No Data Found', icon: 'error' });
    
    
  }
  getViwAndDeliveryAll(ids:string){
    this.authService.getViwAndDeliveryAll(ids).subscribe(data => {
      console.log('all',data);
      this.passingers=data.recordsets[0];
      this.vehicles=data.recordsets[1];
      this.parties=data.recordsets[2];
      });
  }
  xmlexport():void{
    let resultArray = []; let obj = {};
    for(let i=0;i < this.searchResultData.length;i++){
      if(this.searchResultData[i].Selected == true){
        obj = {'recivedDate':this.searchResultData[i].Received_Date,'uid':this.searchResultData[i].UID,'pdfname':this.searchResultData[i].pdf_name,'Metro_Type':this.searchResultData[i].Metro_Type,'File_org_name':this.searchResultData[i].File_org_name}
        resultArray.push(obj);
      }
    }
    console.log('res=',resultArray);
    this.authService.convertXML(resultArray,this.sessionuser).subscribe((data) =>{
      //this.xmlfile = data.msg;
      Swal.fire(data.msg);
    })
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });    
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
