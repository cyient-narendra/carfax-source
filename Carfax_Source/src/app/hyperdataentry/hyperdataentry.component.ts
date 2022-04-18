import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AuthserviceService } from '../_services/authservice.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { Cell, ViewCell } from 'ng2-smart-table';
import { DomSanitizer } from '@angular/platform-browser'
import Swal from 'sweetalert2';
import pdfnamesData from 'src/pdfname.json'
import { Router } from '@angular/router';
import { SharingService } from '../_services/sharing.service';

interface pdfnamesData {
  id: number;
  name: string;
}
@Component({
  selector: 'app-hyperdataentry',
  templateUrl: './hyperdataentry.component.html',
  styleUrls: ['./hyperdataentry.component.css']
})
export class HyperdataentryComponent implements ViewCell, OnInit {

  @Input() value: string | number;
  @Input() rowData: any;

  formObj: any = {
    agencyori: '',
    receivedDate: '',
    source: 'CYIENT', pdfname: '',
    rfi: '', fileorgname: '', controlno: '', crashdate: '', reportno: '', reporttype: '', city: '', county: '', state: '', dcremarks: '', qcremarks: '', qaremarks: '', timespent: ''
  }
  reporttype: any;
  selectedRow: any;
  passengersRow: any;
  filename: any;
  hyperitems: any;
  fileOrgName: any;
  entrydata: any;
  agency: any;
  partiesData: any;
  vechiclesData: any;
  reportcolor: any;
  passengersData: any;
  reptype: any;
  hyperdataForm: any;
  firstnameaccu: any;
  citycolor: any;
  countycolor: any;
  crashdatecolor: any;
  rowClass: any;
  first_name: any;
  lastnameaccu: any;
  insuranceaccu: any;
  vinaccu: any;
  vechiclemakeaccu: any;
  vechiclemodelaccu: any;
  vechicleyearaccu: any;
  platestateaccu: any;
  airbagaccu: any;
  damageaccu: any;
  extractionaccu: any;
  fireaccu: any;
  pointofaccu: any;
  towingaccu: any;
  passfirstaccu: any;
  passlastaccu: any;
  timespentdata: any;
  msg: any;
  error: any;
  statusSelected: any;
  dataShow: boolean;
  popupfile: any;
  pdfSrc: string;
  newwindow: any;
  getpath: any;
  user: any;
  sessionuser: string;
  form: any;
  filefirst: any;
  path: any;
  tableData: any;
  filerecddate: any;
  type: any;
  recfile: any;
  filetype: any;
  datereceived: any;
  typeoffile: any;
  datereceivedselect: any;
  typeoffileselect: any;
  month: any;

  constructor(private router: Router, private authservice: AuthserviceService, private formBuilder: FormBuilder, private domSanitizer: DomSanitizer, private share: SharingService) { }

  pdf: pdfnamesData[] = pdfnamesData;

  ngOnInit(): void {
    this.sessionuser = sessionStorage.getItem('userid');
    this.hyperdataForm = this.formBuilder.group({
      agencyori: new FormControl(''), receivedDate: new FormControl(''), pdfname: new FormControl(''), rfi: new FormControl(''),
      controlno: new FormControl(''), crashdate: new FormControl(''), reportno: new FormControl(''),
      reporttype: new FormControl(''), city: new FormControl(''), county: new FormControl(''), state: new FormControl('')
    });
    this.timespentdata = this.formBuilder.group({
      dcremarks: new FormControl(''), qcremarks: new FormControl(''), qaremarks: new FormControl(''), timespent: new FormControl(''),dctime: new FormControl(''),qctime: new FormControl(''),qatime: new FormControl('')
    })
    this.getFilename();
    //this.fileSelect('');

  }
  fileSelect(select: any) {
    if (select != '') {
      this.filename = select;            
      this.hyperdata();
      this.getParties();
      this.getVechicles();
      this.getpassengers();           
      this.show(this.filename.replace('.PDF', '.pdf'));
      //this.datereceivedselect = this.recfile.replaceAll('-','_');
      //this.typeoffileselect = this.type; 
      console.log(this.filename);
      //console.log("this.datereceived="+this.datereceivedselect);
      //console.log("this.typeoffile="+this.typeoffileselect);
    }
    if(select == '') {
      this.filename = this.filefirst;
      this.datereceived = this.filerecddate.replaceAll('-','_');
      this.typeoffile = this.filetype;
      this.hyperdata();
      this.getParties();
      this.getVechicles();
      this.getpassengers();
      this.show(this.filename.replace('.PDF', '.pdf'));
      //this.show(this.filefirst.File_org_name.replace('.PDF','.pdf'));
      console.log("Hi" + this.filename);
    }

  }
  statusSelect(value: any) {
    if (value != '') {
      this.statusSelected = value;
    }
  }
  show(fname: any): void {
    this.month = this.datereceived.substring(5,7);
    console.log("month="+this.month);
    if (this.newwindow != undefined) {
      this.newwindow.close();
    } 
    if(this.filename == this.filefirst){     
      this.newwindow = window.open(this.authservice.fetchPDF(fname,this.datereceived,this.typeoffile,this.month), '_blank', 'location=yes,height=900,width=720,scrollbars=yes,status=yes');
    }else if(this.filename){
      this.newwindow = window.open(this.authservice.fetchPDF(fname,this.recfile.replaceAll('-','_'),this.type,this.month), '_blank', 'location=yes,height=900,width=720,scrollbars=yes,status=yes');
    }
    }
  hyperdata(): void {
    this.authservice.getHyperData(this.filename).subscribe((result) => {
      this.entrydata = result['recordset'][0];
      this.hyperdataForm.patchValue({
        agencyori: this.entrydata.agency_ori, receivedDate: this.entrydata.ReceivedDate,
        pdfname: this.entrydata.pdf_name, rfi: this.entrydata.RFI, controlno: this.entrydata.control_number, crashdate: this.entrydata.crashdate,
        reportno: this.entrydata.report_number, reporttype: this.entrydata.report_type, city: this.entrydata.City,
        county: this.entrydata.County, state: this.entrydata.state
      })
      this.reportcolor = result['recordset'][0].reportnumber_accuracy;
      this.citycolor = result['recordset'][0].city_accuracy;
      this.countycolor = result['recordset'][0].county_accuracy;
      this.crashdatecolor = result['recordset'][0].crashdate_accuracy;
      this.type = result['recordset'][0].Metro_Type;
      this.recfile = result['recordset'][0].ReceivedDate;
      //localStorage.setItem('datasource',JSON.stringify(this.entrydata));
      //console.log("recdate="+this.recfile);
    })
  }
  onSubmit(): void {
    try {
      console.log("Onsubmit");      
      this.formObj['agencyori'] = this.hyperdataForm.controls["agencyori"].value;
      this.formObj['receivedDate'] = this.hyperdataForm.controls["receivedDate"].value;
      this.formObj['pdfname'] = this.hyperdataForm.controls["pdfname"].value;
      this.formObj['rfi'] = this.hyperdataForm.controls["rfi"].value;
      this.formObj['controlno'] = this.hyperdataForm.controls["controlno"].value;
      this.formObj['crashdate'] = this.hyperdataForm.controls["crashdate"].value;
      this.formObj['reportno'] = this.hyperdataForm.controls["reportno"].value;
      this.formObj['reporttype'] = this.hyperdataForm.controls["reporttype"].value;
      this.formObj['city'] = this.hyperdataForm.controls["city"].value;
      this.formObj['county'] = this.hyperdataForm.controls["county"].value;
      this.formObj['state'] = this.hyperdataForm.controls["state"].value;
      this.formObj['dcremarks'] = this.timespentdata.controls["dcremarks"].value;
      this.formObj['qcremarks'] = this.timespentdata.controls["qcremarks"].value;
      this.formObj['qaremarks'] = this.timespentdata.controls["qaremarks"].value;
      this.formObj['timespent'] = this.timespentdata.controls["timespent"].value;
      this.formObj['dctime'] = this.timespentdata.controls["dctime"].value;
      this.formObj['qctime'] = this.timespentdata.controls["qctime"].value;
      this.formObj['qactime'] = this.timespentdata.controls["qatime"].value;

      this.authservice.hyperdataEntry(this.formObj, this.filename, this.statusSelected, this.sessionuser).subscribe((data) => {
        console.log(data);
        this.msg = data.msg;
        Swal.fire(this.msg);
        Swal.fire(data.err);
        setTimeout(() => {
          this.reloadpage();
          this.newwindow.close();
        }, 4000)

      })


    } catch (error) { console.log(error); }
  }
  reloadpage(): void {
    window.location.reload();
  }
  getFilename(): void {
    this.authservice.getfileorgName(this.sessionuser).subscribe((data) => {
      this.fileOrgName = data['recordset'];
      this.filefirst = this.fileOrgName[0].File_org_name;
      this.filerecddate = this.fileOrgName[0].ReceivedDate;
      this.filetype = this.fileOrgName[0].Metro_Type;      
      this.fileSelect('');
      console.log("filefirst=" + this.filefirst);
      console.log("fileReceived="+this.filerecddate);
    })
  }
  getParties(): void {
    this.authservice.getParties(this.filename).subscribe((data) => {
      this.partiesData = data['recordset'];
      this.firstnameaccu = data['recordset'][0].firstname_accuracy;
      this.lastnameaccu = data['recordset'][0].lastname_accuracy;
      this.insuranceaccu = data['recordset'][0].insurancecompany_accuracy;
      console.log("firstnameaccu = " + this.firstnameaccu);
      this.dataShow = true;
      //localStorage.setItem('parties',JSON.stringify(this.partiesData));
      //let dataparty = localStorage.getItem('parties');
      //console.log("Dataparty = "+dataparty);
    })
  }
  getVechicles(): void {
    this.authservice.getVechicles(this.filename).subscribe((data) => {
      this.vechiclesData = data['recordset'];
      this.vinaccu = data['recordset'][0].vin_accuracy;
      this.vechiclemakeaccu = data['recordset'][0].vehicle_make_accuracy;
      this.vechiclemodelaccu = data['recordset'][0].vehicle_model_accuracy;
      this.vechicleyearaccu = data['recordset'][0].vehicle_year_accuracy;
      this.platestateaccu = data['recordset'][0].plate_state_accuracy;
      this.airbagaccu = data['recordset'][0].airbag_accuracy;
      this.damageaccu = data['recordset'][0].damage_accuracy;
      this.extractionaccu = data['recordset'][0].extarction_accuracy;
      this.fireaccu = data['recordset'][0].fire_accuracy;
      this.pointofaccu = data['recordset'][0].point_of_impact_accuracy;
      this.towingaccu = data['recordset'][0].towing_accuracy;
      console.log("vinaccu =" + this.vinaccu);
      this.dataShow = true;
    })
  }
  getpassengers(): void {
    this.authservice.getPassengers(this.filename).subscribe((data) => {
      this.passengersData = data['recordset'];
      this.passfirstaccu = data['recordset'][0].firstname_accuracy;
      this.passlastaccu = data['recordset'][0].lastname_accuracy;
      //console.log("fileorgname"+this.fileOrgName);
      this.dataShow = true;
    })
  }
  omit_special_char(event: any) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      alert("Enter Numbers Only");
      return false;
    }
    return true;

  }
  specialUnderscore(event: any) {
    var n;
    n = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((n > 64 && n < 91) || (n > 96 && n < 123) || n == 8 || n == 32 || (n >= 48 && n <= 57) || n == 95);
  }
  specialDash(event: any) {
    var n;
    n = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((n > 64 && n < 91) || (n > 96 && n < 123) || n == 8 || n == 32 || (n >= 48 && n <= 57) || n == 45);
  }
  specialDashSpace(event: any) {
    var n;
    n = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((n > 64 && n < 91) || (n > 96 && n < 123) || n == 8 || n == 32 || (n >= 48 && n <= 57) || n == 45 || n == 35);
  }
  specialDashDotSpace(event: any) {
    var n;
    n = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((n > 64 && n < 91) || (n > 96 && n < 123) || n == 8 || n == 32 || (n >= 48 && n <= 57) || n == 45 || n == 35 || n == 46);
  }
  specialDashDotSpaceAnd(event: any) {
    var n;
    n = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((n > 64 && n < 91) || (n > 96 && n < 123) || n == 8 || n == 32 || (n >= 48 && n <= 57) || n == 45 || n == 35 || n == 46 || n == 38);
  }
  public parties = {

    columns: {

      P_ID: {
        title: 'P_ID',
        filter: false
      },
      first_name: {
        type: 'html',
        title: 'Driver_first_name',
        filter: false,
        valuePrepareFunction: (first_name: any) => {
          if (this.firstnameaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${first_name}</span>&nbsp;<small style="color: grey;">${this.firstnameaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${first_name}</span>&nbsp;<small style="color: grey;">${this.firstnameaccu}</small>`);
          }
        }
      },
      last_name: {
        type: 'html',
        title: 'Driver_last_name',
        filter: false,
        valuePrepareFunction: (last_name: any) => {
          if (this.lastnameaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${last_name}</span>&nbsp;<small style="color: grey;">${this.lastnameaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${last_name}</span>&nbsp;<small style="color: grey;">${this.lastnameaccu}</small>`);
          }
        }
      },
      insurance_company: {
        type: 'html',
        title: 'Insurance_company',
        filter: false,
        valuePrepareFunction: (insurance_company: any) => {
          if (this.insuranceaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${insurance_company}</span>&nbsp;<small style="color: grey;">${this.insuranceaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${insurance_company}</span>&nbsp;<small style="color: grey;">${this.insuranceaccu}</small>`);
          }
        }
      },
    },
    pager: {
      display: true,
      perPage: 10
    },
    hideSubHeader: true,
    selectedRowIndex: -1,
    mode: 'inline',
    actions: {
      columnTitle: 'Action',
      add: false,
      edit: true,
      delete: true,
      position: 'left',
      class: 'abc'
    },
    edit: {
      confirmSave: true,
      deleteButtonContent: 'Delete',
      saveButtonContent: 'Save',
      cancelButtonContent: 'Cancel'
    },
    delete: {
      confirmDelete: true,
      deleteButtonContent: 'Delete',
      saveButtonContent: 'Save',
      cancelButtonContent: 'Cancel'
    },
    // rowClassFunction: (row:any,cell:any) => {
    //   if(row.data.firstname_accuracy > 90 ){
    //     return this.domSanitizer.bypassSecurityTrustHtml(`<h1 [style.color]="green">${row.data.first_name}</h1>`);
    //   }else {
    //     return 'yellow'
    //   }
    // }    
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: false
  };
  public vechicles = {
    columns: {
      V_ID: {
        title: 'V_ID',
        filter: false
      },
      vin: {
        type: 'html',
        title: 'vin',
        filter: false,
        valuePrepareFunction: (vin: any) => {
          if (this.vinaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${vin}</span>&nbsp;<small style="color: grey;">${this.vinaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${vin}</span>&nbsp;<small style="color: grey;">${this.vinaccu}</small>`);
          }
        }
      },
      vehicle_make: {
        type: 'html',
        title: 'vehicle_make',
        filter: false,
        valuePrepareFunction: (vehicle_make: any) => {
          if (this.vechiclemakeaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${vehicle_make}</span>&nbsp;<small style="color: grey;">${this.vechiclemakeaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${vehicle_make}</span>&nbsp;<small style="color: grey;"${this.vechiclemakeaccu}</small>`);
          }
        }
      },
      vehicle_model: {
        type: 'html',
        title: 'vehicle_model',
        filter: false,
        valuePrepareFunction: (vehicle_model: any) => {
          if (this.vechiclemodelaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${vehicle_model}</span>&nbsp;<small style="color: grey;">${this.vechiclemodelaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${vehicle_model}</span>&nbsp;<small style="color: grey;">${this.vechiclemodelaccu}</small>`);
          }
        }
      },
      vehicle_plate: {
        type: 'html',
        title: 'vehicle_plate',
        filter: false,
      },
      vehicle_year: {
        type: 'html',
        title: 'vehicle_year',
        filter: false,
        valuePrepareFunction: (vehicle_year: any) => {
          if (this.vechicleyearaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${vehicle_year}</span>&nbsp;<small style="color: grey;">${this.vechicleyearaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${vehicle_year}</span>&nbsp;<small style="color: grey;">${this.vechicleyearaccu}</small>`);
          }
        }
      },
      plate_state: {
        type: 'html',
        title: 'plate_state',
        filter: false,
        valuePrepareFunction: (plate_state: any) => {
          if (this.platestateaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${plate_state}</span>&nbsp;<small style="color: grey;">${this.platestateaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${plate_state}</span>&nbsp;<small style="color: grey;">${this.platestateaccu}</small>`);
          }
        }
      },
      airbag: {
        type: 'html',
        title: 'airbag',
        filter: false,
        valuePrepareFunction: (airbag: any) => {
          if (this.airbagaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${airbag}</span>&nbsp;<small style="color: grey;">${this.airbagaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${airbag}</span>&nbsp;<small style="color: grey;">${this.airbagaccu}</small>`);
          }
        }
      },
      damage: {
        type: 'html',
        title: 'damage',
        filter: false,
        valuePrepareFunction: (damage: any) => {
          if (this.damageaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${damage}</span>&nbsp;<small style="color: grey;">${this.damageaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${damage}</span>&nbsp;<small style="color: grey;">${this.damageaccu}</small>`);
          }
        }
      },
      extraction: {
        type: 'html',
        title: 'extraction',
        filter: false,
        valuePrepareFunction: (extraction: any) => {
          if (this.extractionaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${extraction}</span>&nbsp;<small style="color: grey;">${this.extractionaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${extraction}</span>&nbsp;<small style="color: grey;">${this.extractionaccu}</small>`);
          }
        }
      },
      fire: {
        type: 'html',
        title: 'fire',
        filter: false,
        valuePrepareFunction: (fire: any) => {
          if (this.fireaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${fire}</span>&nbsp;<small style="color: grey;">${this.fireaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${fire}</span>&nbsp;<small style="color: grey;">${this.fireaccu}</small>`);
          }
        }
      },
      point_of_impact: {
        type: 'html',
        title: 'point_of_impact',
        filter: false,
        valuePrepareFunction: (point_of_impact: any) => {
          if (this.pointofaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${point_of_impact}</span>&nbsp;<small style="color: grey;">${this.pointofaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${point_of_impact}</span>&nbsp;<small style="color: grey;">${this.pointofaccu}</small>`);
          }
        }
      },
      towing: {
        type: 'html',
        title: 'towing',
        filter: false,
        valuePrepareFunction: (towing: any) => {
          if (this.towingaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${towing}</span>&nbsp;<small style="color: grey;">${this.towingaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${towing}</span>&nbsp;<small style="color: grey;">${this.towingaccu}</small>`);
          }
        }
      }
    },
    hideSubHeader: true,
    selectedRowIndex: -1,
    pager: {
      display: true,
      perPage: 10
    },
    mode: 'inline',
    actions: {
      columnTitle: 'Action',
      add: false,
      edit: true,
      delete: true,
      position: 'left',
      class: 'abc'
    },
    delete: {
      confirmDelete: true,
      deleteButtonContent: 'Delete',
      saveButtonContent: 'save',
      cancelButtonContent: 'cancel'
    },
    edit: {
      confirmSave: true,
      deleteButtonContent: 'Delete',
      saveButtonContent: 'Save',
      cancelButtonContent: 'Cancel'
    },
    rowClassFunction: (row: any) => {
      if (row.index % 2 === 0) {
        return 'solved';
      } else {
        return 'aborted'
      }
    },
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: false
  };
  public passengers = {

    columns: {

      first_name: {
        type: 'html',
        title: 'Passenger First Name',
        filter: false,
        valuePrepareFunction: (first_name: any) => {
          if (this.passfirstaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${first_name}</span>&nbsp;<small style="color: grey;">${this.passfirstaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${first_name}</span>&nbsp;<small style="color: grey;">${this.passfirstaccu}</small>`);
          }
        }
      },
      last_name: {
        type: 'html',
        title: 'Passenger Last Name',
        filter: false,
        valuePrepareFunction: (last_name: any) => {
          if (this.passlastaccu > 90) {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: lightgreen !important;">${last_name}</span>&nbsp;<small style="color: grey;">${this.passlastaccu}</small>`);
          }
          else {
            return this.domSanitizer.bypassSecurityTrustHtml(`<span class="myclass" style="background-color: yellow !important;">${last_name}</span>&nbsp;<small style="color: grey;">${this.passlastaccu}</small>`);
          }
        }

      }
    },
    pager: {
      display: true,
      perPage: 10
    },
    mode: 'inline',
    actions: {
      columnTitle: 'Action',
      add: false,
      edit: true,
      delete: true,
      position: 'left',
      class: 'abc'
    },
    hideSubHeader: true,
    selectedRowIndex: -1,
    edit: {
      confirmSave: true,
      deleteButtonContent: 'Delete',
      saveButtonContent: 'Save',
      cancelButtonContent: 'Cancel'
    },
    delete: {
      confirmDelete: true,
      deleteButtonContent: 'Delete',
      saveButtonContent: 'Save',
      cancelButtonContent: 'Cancel',
    },
    rowClassFunction: (row: any) => {
      if (row.index % 2 === 0) {
        return 'solved';
      } else {
        return 'aborted'
      }
    },
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: false
  };
  onDeleteConfirm($event: any) {
    if (window.confirm('Are you sure you want to delete?')) {
      $event.confirm.resolve();
    } else {
      $event.confirm.reject();
    }
  }
  onSaveConfirm($event: any) {
    alert("Edit Event In Console")
    console.log($event);
  }
  onEditConfirm($event: any) {
    if (window.confirm('Are you sure you want to save?')) {
      //call to remote api, remember that you have to await this
      $event.confirm.resolve($event.newData);
      this.tableData = $event.newData;
      console.log($event.newData);
      if (this.tableData.P_ID != undefined && this.tableData.P_ID != '') {
        this.authservice.tableDataSaveParties(this.tableData, this.filename, this.sessionuser).subscribe((data) => {

        })
      }
      else if (this.tableData.V_ID != undefined && this.tableData.V_ID != '') {
        this.authservice.tableDataSaveVechicles(this.tableData, this.filename, this.sessionuser).subscribe((data) => {

        })
      }
      else {
        this.authservice.tableDataSavePassengers(this.tableData, this.filename, this.sessionuser).subscribe((data) => {

        })
      }

    } else {
      $event.confirm.reject();
    }
  }

}