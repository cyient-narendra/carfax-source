import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { AuthserviceService } from '../_services/authservice.service';

@Component({
  selector: 'app-userboard',
  templateUrl: './userboard.component.html',
  styleUrls: ['./userboard.component.css']
})
export class UserboardComponent implements OnInit {
  user: any;
  filedata: any;
  pdf: any;
  status: any;
  sessionuser: string;
  received: any;
  qcstatus: any;
  qastatus: any;

  constructor(private authservice:AuthserviceService) { }

  ngOnInit(): void { 
    console.log("Hi");
    this.user = LoginComponent.userId;
    this.sessionuser = sessionStorage.getItem('userid')
    console.log(this.sessionuser);
    this.getFiles();    
  }
getFiles(){ 

  this.authservice.getProductionFiles(this.sessionuser).subscribe((data) =>{    
    this.filedata = data['recordset'];
    this.pdf = data['recordset'][0].File_org_name;
    this.status = data['recordset'][0].DC_Status;
    this.received = data['recordset'][0].ReceivedDate;
    this.qcstatus = data['recordset'][0].QC_Status;
    this.qastatus = data['recordset'][0].QA_Status;
    //console.log("files="+this.filedata);
  })
}
// onClick(){
//   this.newwindow = window.open(this.authservice.fetchPDF(fname), '_blank', 'location=yes,height=900,width=720,scrollbars=yes,status=yes')
// }
}
