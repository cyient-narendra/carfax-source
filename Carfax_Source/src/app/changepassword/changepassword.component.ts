import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { AuthserviceService } from '../_services/authservice.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

  
  form:any={
    oldpassword:'',password:'',confirmpassword:'',phone:'',email:''
  }

  //id=LoginComponent.userId;
  user: string;

  constructor(private authService:AuthserviceService,public dialogRef: MatDialogRef<HomeComponent>) { }

  ngOnInit(): void {
    this.user = sessionStorage.getItem('userid')
  }  
  onClick():void {
    console.log(this.user);
    if(!(this.form.confirmpassword===this.form.password))
    {         
      Swal.fire("Please enter same Confirm & New passwords");
    }
    else if(this.form.confirmpassword == '' || this.form.password == '' || this.form.oldpassword == '')
    {         
      Swal.fire("Please enter values");
    }
    else{
      this.authService.changePassword(this.form,this.user).subscribe(data => {
           console.log(data);           
            Swal.fire(data.msg);          
            Swal.fire(data.err);
    })
  }
  
} 
close():void{
  this.dialogRef.close();
} 

}
