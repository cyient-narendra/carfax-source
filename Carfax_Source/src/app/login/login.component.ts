import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { AuthserviceService } from '../_services/authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {form: any = {
  username: null,
  password: null
};
isLoggedIn = false;
isLoginFailed = false;
errorMessage = '';
roles: any;  
public static userId:any;

constructor(private router:Router,private locationStrategy:LocationStrategy,private authService:AuthserviceService) { }

ngOnInit() {   
  this.preventBackButton();    
}
onSubmit():void {
  this.authService.login(this.form).subscribe(
    data  => {  
      console.log('LOGIN',data);
      if(data.status == true && data.Role == 1){              
        this.isLoggedIn = true;
        LoginComponent.userId = data.user;          
        sessionStorage.setItem('username',data.empName);
        sessionStorage.setItem('userid',data.user);
        sessionStorage.setItem('Role',data.Role);
        sessionStorage.setItem('usernumber',data.userId);
        sessionStorage.setItem('wsml',data.wsml);
        sessionStorage.setItem('qcAccess',data.qcAccess);
        sessionStorage.setItem('qaAccess',data.qaAccess);
        
        console.log(LoginComponent.userId);
        console.log("name ="+data.empName);
        this.router.navigateByUrl('home/adminboard');                     
      }
      else if(data.status == true && data.Role == 0){
        this.isLoggedIn = true;
        LoginComponent.userId = data.user;
        sessionStorage.setItem('userid',data.user);         
        sessionStorage.setItem('username',data.empName);
        sessionStorage.setItem('usernumber',data.userId);
        sessionStorage.setItem('Role',data.Role);
        console.log(LoginComponent.userId);
        console.log("name ="+data.empName);
        sessionStorage.setItem('wsml',data.wsml);
        this.router.navigateByUrl('home/userboard');
      }
      else{
        this.isLoggedIn = false;
        alert("Invalid User");
      }        
  });   
  
}
reloadPage(): void {
  window.location.reload();
} 
reloadCurrentRoute():void {    
  this.router.navigateByUrl('/home');
  
}  
preventBackButton() {
  history.pushState(null, document.title, location.href);
  this.locationStrategy.onPopState(() => {
    history.pushState(null, document.title, location.href);
  })
}

}
