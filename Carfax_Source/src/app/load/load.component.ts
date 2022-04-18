import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthserviceService } from '../_services/authservice.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit {

  error:any;
  showMsg: boolean = false;
  gridpanel:boolean = false;
  ncrSummary:any;
  sessionuser: any;
  
  constructor(private authservice:AuthserviceService,private formBuilder: FormBuilder) { }

  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
   fileUploadForm: FormGroup;
   fileInputLabel: string;

  ngOnInit(): void {
    this.sessionuser = sessionStorage.getItem('userid');
    this.fileUploadForm = this.formBuilder.group({
      myfile: [''],recdate:new FormControl('')
    });
  }
  onFileSelect(event:any) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
       //console.log(file);

      if (!_.includes(af, file.type)) {
        alert('Only EXCEL Docs Allowed!');
      } else {
        this.fileInputLabel = file.name;
        this.fileUploadForm.get('myfile').setValue(file);
      }
    }
  }
  onFormSubmit() {

    if (!this.fileUploadForm.get('myfile').value) {
      Swal.fire("Please Select File");
    }      
    const formData = new FormData();
    formData.append('myfile', this.fileUploadForm.get('myfile').value);
    formData.append('user',this.sessionuser);
    formData.append('recdate',this.fileUploadForm.get('recdate').value)
    //console.log("date="+this.fileUploadForm.get('recdate').value);   
    this.authservice.Upload(formData)
      .subscribe(response => {
       console.log(response);
       this.showMsg= true;       
      }, error => {
        console.log(error);
        this.error = error;
      });
  } 

}
