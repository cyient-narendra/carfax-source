import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import Swal from 'sweetalert2';
import { AuthserviceService } from '../_services/authservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  form:any={
    recdfromdate:'',recdtodate:''
  }  
  filestatus: any;
  fileshow: boolean;
  agency: any;
  name: any;
  agencySelected: any;
  selectedName: any;
  message: any;
  overallstatus: any;
  over: boolean;
  dailystatus: any;
  daily: boolean;

  constructor(private authservice:AuthserviceService) { }

  ngOnInit(): void {
    this.getAgencyori();
    this.getDcname();
  }
  onChange(value:any){    
    this.agencySelected = value;
  }
  onNameChange(name:any){
    this.selectedName = name;
  }
  getDcname():void{
    this.authservice.getName().subscribe((data) => {
      this.name = data['recordset'];
    })
  }
  getAgencyori(){   
    this.authservice.getAgency().subscribe((data) => {
      this.agency = data['recordset'];
    })
 } 
 dataFileStatusReport():void{   
   this.authservice.getFileStatusReport(this.form).subscribe((data) =>{
    console.log(data);
      this.filestatus = data['recordset']; 
      Swal.fire(data.msg);
      this.fileshow = true;     
   })
 }
 ascWiseOverallStatus():void{  
  this.authservice.ascWiseStatus(this.agencySelected,this.selectedName).subscribe((data) => {
    this.overallstatus = data['recordset'];
    Swal.fire(data.msg);
    this.over = true;
    
  })
 }
 ascWiseDailyStatus():void{  
  this.authservice.ascWiseDailyStatus(this.form,this.selectedName).subscribe((data) => {
    this.dailystatus = data['recordset'];
    Swal.fire(data.msg);
    this.daily = true;    
  })
 }
 public filesettings = {
    
  columns: { 

    agency_ori: {
      title: 'Agency ORI',
      filter:false         
    },      
    State: {
      type:'html',
      title: 'State',
      filter:false                  
    },      
    Recieved_count: {
      type:'html',
      title: 'Received_count',      
      filter:false
    },
    YTS: {
      type:'html',
      title: 'YTS',      
      filter:false
    },
    Data_entry: {
      type:'html',
      title: 'Data_entry',      
      filter:false
    }, 
    QC: {
      type:'html',
      title: 'QC',      
      filter:false
    }, 
    QA: {
      type:'html',
      title: 'QA',      
      filter:false
    },
    Shipment: {
      type:'html',
      title: 'Shipment',      
      filter:false
    }, 
    Pending_XML: {
      type:'html',
      title: 'Pending_XML',      
      filter:false
    }, 
    Delivered: {
      type:'html',
      title: 'Delivered',      
      filter:false
    }        
  },
  pager: {
    display: true,
    perPage: 1000
  },
  hideSubHeader: true,
  selectedRowIndex: -1,
  mode:"external",
  //selectMode: 'multi',
  actions: false,      
  attr: {
    class: 'table table-bordered'
  },
  defaultStyle: false
};
public overallsetting = {
    
  columns: { 

    AGENCY_ORI: {
      title: 'Agency ORI',
      filter:false         
    },      
    PROD_DONEBY: {
      type:'html',
      title: 'PROD_DONEBY',
      filter:false                  
    }, 
    DC_COMP: {
      type:'html',
      title: 'DC_COMP',      
      filter:false
    },
    DC_PEND: {
      type:'html',
      title: 'DC_PEND',      
      filter:false
    }, 
    QUERY: {
      type:'html',
      title: 'QUERY',      
      filter:false
    }, 
    DC_AVG: {
      type:'html',
      title: 'DC_AVG',      
      filter:false
    },
    QC_COMP: {
      type:'html',
      title: 'QC_COMP',      
      filter:false
    }, 
    REJECT: {
      type:'html',
      title: 'REJECT',      
      filter:false
    }, 
    QC_TOTAL: {
      type:'html',
      title: 'QC_TOTAL',      
      filter:false
    },
    REJECTIONS: {
      type:'html',
      title: 'REJECTIONS',      
      filter:false
    }         
  },
  pager: {
    display: true,
    perPage: 1000
  },
  hideSubHeader: true,
  selectedRowIndex: -1,
  mode:"external",
  //selectMode: 'multi',
  actions: false,      
  attr: {
    class: 'table table-bordered'
  },
  defaultStyle: false
};
public dailysetting = {
    
  columns: { 

    AGENCY_ORI: {
      title: 'Agency ORI',
      filter:false         
    },      
    NAME: {
      type:'html',
      title: 'NAME',
      filter:false                  
    }, 
    ALLOTED: {
      type:'html',
      title: 'ALLOTED',      
      filter:false
    },
    COMPLETED: {
      type:'html',
      title: 'COMPLETED',      
      filter:false
    }, 
    PENDING: {
      type:'html',
      title: 'PENDING',      
      filter:false
    }, 
    QUERY: {
      type:'html',
      title: 'QUERY',      
      filter:false
    },
    PERCENTAGE: {
      type:'html',
      title: 'PERCENTAGE',      
      filter:false
    }, 
    AVERAGE: {
      type:'html',
      title: 'AVERAGE',      
      filter:false
    }       
  },
  pager: {
    display: true,
    perPage: 1000
  },
  hideSubHeader: true,
  selectedRowIndex: -1,
  mode:"external",
  //selectMode: 'multi',
  actions: false,      
  attr: {
    class: 'table table-bordered'
  },
  defaultStyle: false
};
}


