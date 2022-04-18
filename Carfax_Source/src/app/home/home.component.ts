import { Component, OnInit } from '@angular/core';
import { MatDialogConfig,MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangepasswordComponent } from '../changepassword/changepassword.component';
import { LocationStrategy } from '@angular/common';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  name:any;
  role: any;
  user: any;
  rolename: string;
  
  constructor(private dialog:MatDialog,private router:Router,private locationStrategy:LocationStrategy) { }

  ngOnInit(): void {
    this.preventBackButton();
    this.name = sessionStorage.getItem('username')
    this.role = sessionStorage.getItem('Role');
    if(this.role == 'true'){
      this.rolename = 'admin';
    }else{
      this.rolename = 'user';
    }
    this.user = LoginComponent.userId
    console.log("this.name = "+this.name);
    console.log("role = "+this.role);
  }
  changePassword(){
    const dialogConfig = new MatDialogConfig();    
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'full-with-dialog',
    dialogConfig.maxHeight = '150vh',
    this.dialog.open(ChangepasswordComponent,dialogConfig );
  } 
  CloseWindow() {
    // window.open("/login", "_self")?.close;
    this.router.navigateByUrl('/login'); 
    sessionStorage.removeItem('usernumber');  
    sessionStorage.removeItem('userid');  
    sessionStorage.removeItem('Role');  
    sessionStorage.removeItem('username');  
    sessionStorage.removeItem('usernumber');  
  }
  preventBackButton() {
  history.pushState(null, document.title, location.href);
  this.locationStrategy.onPopState(() => {
    history.pushState(null, document.title, location.href);
  })
}
}