import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthserviceService } from '../_services/authservice.service';

@Component({
  selector: 'app-self-allotment',
  templateUrl: './self-allotment.component.html',
  styleUrls: ['./self-allotment.component.css']
})
export class SelfAllotmentComponent implements OnInit {
  selfForm:any={
    metroType:"", commersType:"",required:"",stepName:""
  }
  userId:any;
  isQCaccess: string;
  isQAaccess: string;
  constructor(private authService:AuthserviceService) { }

  ngOnInit(): void {
  this.userId=sessionStorage.getItem('userid');
  this.isQCaccess = sessionStorage.getItem('qcAccess');
  this.isQAaccess = sessionStorage.getItem('qaAccess');

  console.log('id',this.userId);
  
  }
  AssignMe(){
  console.log(this.selfForm);
  this.authService.assignMe(this.selfForm,this.userId).subscribe(data => {
  console.log('as',data);
  Swal.fire(data.msg);
  this.selfForm = {
  metroType:"", commersType:"",required:"",stepName:""
}
  })

  }
  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {      
      Swal.fire("Enter Numbers Only");  
      return false;    
    }    
    return true;

  }
}
