import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthserviceService } from '../_services/authservice.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sourcecopy',
  templateUrl: './sourcecopy.component.html',
  styleUrls: ['./sourcecopy.component.css']
})
export class SourcecopyComponent implements OnInit {
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
      myfile: ['']
    });
  }
  onFileSelect(event:any) {    
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
       //console.log(file);
        this.fileInputLabel = file.name;
        this.fileUploadForm.get('myfile').setValue(file);      
    }
  }
  onFormSubmit() {

    if (!this.fileUploadForm.get('myfile').value) {
      Swal.fire("Please Select PDF");
    }      
    const formData = new FormData();
    formData.append('myfile', this.fileUploadForm.get('myfile').value);
    //console.log(this.fileUploadForm.get('myfile').value);    
    this.authservice.savePDF(formData)
      .subscribe(response => {
       console.log(response);
       this.showMsg= true;       
      }, error => {
        console.log(error);
        this.error = error;
      });
  } 

}
