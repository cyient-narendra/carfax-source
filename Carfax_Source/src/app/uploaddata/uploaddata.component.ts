import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { LoadComponent } from '../load/load.component';
import { SourcecopyComponent } from '../sourcecopy/sourcecopy.component';

@Component({
  selector: 'app-uploaddata',
  templateUrl: './uploaddata.component.html',
  styleUrls: ['./uploaddata.component.css']
})
export class UploaddataComponent implements OnInit {

  constructor(private dialog:MatDialog,private router:Router) { }

  ngOnInit(): void {
  }
  dataUpload(){
    const dialogConfig = new MatDialogConfig();    
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'full-with-dialog',
    dialogConfig.width = '80vh',        
    this.dialog.open(LoadComponent,dialogConfig );  
  }
  sourceCopy(){
    const dialogConfig = new MatDialogConfig();    
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'full-with-dialog',
    dialogConfig.maxHeight = '100vh',    
    this.dialog.open(SourcecopyComponent,dialogConfig );  
  }
  
}
