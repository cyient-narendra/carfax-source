import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthserviceService } from '../_services/authservice.service';

@Component({
  selector: 'app-multiplereports',
  templateUrl: './multiplereports.component.html',
  styleUrls: ['./multiplereports.component.css']
})
export class MultiplereportsComponent implements OnInit {

  form: any = {
    recdfromdate: '', recdtodate: ''
  }
  metro: any;
  nonmetro: any
  selected: string;
  state: any;
  agency: any;
  stateselect: any;
  agencyselect: any;
  currentAllotment: any;
  showcurrent: boolean;
  overviewData: any;
  showoverview: boolean;
  completedCount: any;
  showcomplete: boolean;
  allotlength: any;
  overviewlength: any;
  completedRecordLength: any;
  agencyWise: any;
  showagency: boolean;
  agencyWiseLength: any;
  optionSelect: any;
  rejectedFile: any;
  showrejectedfiles: boolean;
  rejeclength: any;
  selectCommerce: any;

  constructor(private authservice: AuthserviceService) { }

  ngOnInit(): void {
    this.getState();
  }
  onItemChange(value: any) {
    if (this.selected != '') {
      this.selected = value;
      console.log(this.selected);
    }
  }
  changeCommerce(value:any):void{
    if(this.selectCommerce !='Select'){
      this.selectCommerce = value;
    }
  }
  onStateChange(state: any) {
    if (this.stateselect != '') {
      this.stateselect = state;
    }
  }
  onAgencyChange(agency: any) {
    if (this.agencyselect != '') {
      this.agencyselect = agency;
    }
  }
  getState(): void {
    this.authservice.getServiceState().subscribe((data) => {
      this.state = data['recordsets'][3];
      this.agency = data['recordsets'][2];
    })
  }
  getCurrentAllotments(): void {
    this.authservice.getCurrentAllotments(this.stateselect, this.agencyselect, this.selected,this.selectCommerce).subscribe((data) => {
      this.currentAllotment = data['recordset'];
      this.showcurrent = true;
      Swal.fire(data.msg);
      this.allotlength = this.currentAllotment.length;
    })
  }
  getOverview(): void {
    this.authservice.getOverview(this.agencyselect, this.selected,this.selectCommerce).subscribe((data) => {
      this.overviewData = data['recordset'];
      this.showoverview = true;
      Swal.fire(data.msg);
      this.overviewlength = this.overviewData.length;
    })
  }
  getCompletedCount(): void {
    this.authservice.getCompletedCount(this.form, this.stateselect, this.agencyselect, this.selected,this.selectCommerce).subscribe((data) => {
      this.completedCount = data['recordset'];
      this.showcomplete = true;
      Swal.fire(data.msg);
      this.completedRecordLength = this.completedCount.length;
    })
  }
  getAgencyWise(): void {
    this.authservice.getAgencyWise(this.form, this.agencyselect, this.selected).subscribe((data) => {
      this.agencyWise = data['recordset'];
      this.showagency = true;
      Swal.fire(data.msg);
      this.agencyWiseLength = this.agencyWise.length;
    })
  }
  onChangeSelect(select: any) {
    if (this.optionSelect != 'Select')
      this.optionSelect = select;
  }
  getRejectedFiles(): void {
    this.authservice.getRejectedFiles(this.selected,this.optionSelect,this.form,this.stateselect,this.agencyselect,this.selectCommerce).subscribe((data) =>{
      this.rejectedFile = data['recordset'];
      this.showrejectedfiles = true;
      Swal.fire(data.msg);
      this.rejeclength = this.rejectedFile.length;      
    })
  }
  public currentAllotmentSettings = {

    columns: {

      Name: {
        title: 'Name',
        filter: false
      },
      State: {
        type: 'html',
        title: 'State',
        filter: false
      },
      Agency: {
        type: 'html',
        title: 'Agency',
        filter: false
      },
      Step: {
        type: 'html',
        title: 'Step',
        filter: false
      },
      Count: {
        type: 'html',
        title: 'Count',
        filter: false
      }
    },
    pager: {
      display: true,
      perPage: 2000
    },
    hideSubHeader: true,
    selectedRowIndex: -1,
    mode: 'inline',
    actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: false
  };
  public overview = {

    columns: {

      agency_ori: {
        title: 'agency_ori',
        filter: false
      },
      Receiveddate: {
        type: 'html',
        title: 'Received_Date',
        filter: false,
        valuePrepareFunction: (Receiveddate: any) => { return Receiveddate.slice(0, 10).replace('T', ' ') }
      },
      Received: {
        type: 'html',
        title: 'Received',
        filter: false
      },
      DC: {
        type: 'html',
        title: 'DC',
        filter: false
      },
      QC: {
        type: 'html',
        title: 'QC',
        filter: false
      },
      Shipment: {
        type: 'html',
        title: 'Shipment',
        filter: false
      },
      COMP: {
        type: 'html',
        title: 'COMP',
        filter: false
      },
    },
    pager: {
      display: true,
      perPage: 2000
    },
    hideSubHeader: true,
    selectedRowIndex: -1,
    mode: 'inline',
    actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: false
  };
  public completed = {

    columns: {

      Name: {
        title: 'Name',
        filter: false
      },
      State: {
        type: 'html',
        title: 'State',
        filter: false
      },
      Agency: {
        type: 'html',
        title: 'Agency',
        filter: false
      },
      Step: {
        type: 'html',
        title: 'Step',
        filter: false
      },
      Count: {
        type: 'html',
        title: 'Count',
        filter: false
      }
    },
    pager: {
      display: true,
      perPage: 2000
    },
    hideSubHeader: true,
    selectedRowIndex: -1,
    mode: 'inline',
    actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: false
  };
  public agencysettings = {

    columns: {

      agency_ori: {
        title: 'Agency_ori',
        filter: false
      },
      Step: {
        type: 'html',
        title: 'Step',
        filter: false
      },
      Count: {
        type: 'html',
        title: 'Count',
        filter: false
      }
    },
    pager: {
      display: true,
      perPage: 2000
    },
    hideSubHeader: true,
    selectedRowIndex: -1,
    mode: 'inline',
    actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: false
  };
  public rejectsettings = {

    columns: {

      DC_Name: {
        title: 'DC_Name',
        filter: false,
        width: "10%" 
      },
      Rejected_Count: {
        type: 'html',
        title: 'Rejected_Count',
        filter: false,
        width: "10%" 
      },
      Total_Rejections: {
        type: 'html',
        title: 'Total_Rejections',
        filter: false,
        width: "10%" 
      }
    },
    pager: {
      display: true,
      perPage: 2000
    },
    hideSubHeader: true,
    selectedRowIndex: -1,
    mode: 'inline',
    actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: false
  };
}
