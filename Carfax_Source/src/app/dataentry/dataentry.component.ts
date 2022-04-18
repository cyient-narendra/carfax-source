import { Component, Directive, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DynamicGrid, Passengers } from '../grid.model';
import { AuthserviceService } from '../_services/authservice.service';

@Component({
  selector: 'app-dataentry',
  templateUrl: './dataentry.component.html',
  styleUrls: ['./dataentry.component.css']  
})
export class DataentryComponent implements OnInit {
  numberColumn: any;
  sortByAsc: boolean = true;
  filteredData: any;  
    sortdata:any;
    pdfname:any;

    form:any =  {
      agencyori : '',
      receivedDate:'',
      source:'CYIENT',
      rfi:'',fileorgname:'',controlno:'',crashdate:'',reportno:'',city:'',county:'',state:'',dcremarks:'',qcremarks:'',qaremarks:'',timespent:'',dctime:'',qctime:'',qatime:''
    }
    reporttype:any;
    selectedRow:any;
    passengersRow:any;
  msg: any;
  error: any;
  statusSelected: any;
  sessionuser: string;
  reportSelected: any;

  constructor(private toastr: ToastrService,private authservice:AuthserviceService) { }   

  dynamicArray: Array<DynamicGrid> = [];  
      newDynamic:any ={} ; 
  dynamicArray1:Array<Passengers> =[];
   newDynamic1:any ={};
  
  ngOnInit(): void {
    // this.newDynamic = {p_ID: "", Driver_first_name: "",Driver_last_name:"",insurance_company:"",V_ID:"",vin:"",vehicle_make:"",vehicle_model:"",vehicle_plate:"",
    // vehicle_year:"",plate_state:"",airbag:"",damage:"",extraction:"",fire:"",point_of_impact:"",towing:""};  
    //       this.dynamicArray.push(this.newDynamic); 
    //       this.newDynamic1 = {Passenger_first_name:"",Passenger_last_name:""};
    //       this.dynamicArray1.push(this.newDynamic1);
      this.sessionuser = sessionStorage.getItem('userid');
      window.addEventListener("keyup", disableF5);
     window.addEventListener("keydown", disableF5);
   
    function disableF5(e:any) {
       if ((e.which || e.keyCode) == 116) e.preventDefault(); 
    };         
  } 
  onSelect(value:any){
    if(value != ''){
      this.reporttype = value;
      console.log("selected ="+this.reporttype);
    }
  }
  partiesSelect(item:any) {
    this.selectedRow = [];
    this.dynamicArray.forEach((element:any) => {
      if (element.properties == item.item_text) {
        this.selectedRow.push(element);
      }
    });
    console.log(this.selectedRow);
  }
  passengersSelect(item:any) {
    this.passengersRow = [];
    this.dynamicArray1.forEach((element:any) => {
      if (element.properties == item.item_text) {
        this.passengersRow.push(element);
      }
    });
    console.log("passengers="+this.passengersRow);
  }
  
addRow() {  
  this.newDynamic = {P_ID: "", Driver_first_name: "",Driver_last_name:"",insurance_company:"",V_ID:"",vin:"",vehicle_make:"",vehicle_model:"",vehicle_plate:"",
  vehicle_year:"",plate_state:"",airbag:"",damage:"",extraction:"",fire:"",point_of_impact:"",towing:""};    
  this.dynamicArray.push(this.newDynamic);  
        this.toastr.success('New row added successfully', 'New Row');  
        console.log(this.dynamicArray);  
        return true;  
}  

deleteRow(index:any) {  
  // if(this.dynamicArray.length ==1) {  
  //   this.toastr.show("Can't delete the row when there is only one row and having data");            
  //     return false;  
  // } else {  
  //     this.dynamicArray.splice(index, 1);  
  //     this.toastr.warning('Row deleted successfully', 'Delete row');  
  //     return true;  
  // }  
  if(window.confirm('Are sure you want to delete ?')){
    this.dynamicArray.splice(index, 1);  
      this.toastr.warning('Row deleted successfully', 'Delete row');  
       
   }
}
addPassengerRow() {    
this.newDynamic1 = {Passenger_first_name:"",Passenger_last_name:""};   
        this.dynamicArray1.push(this.newDynamic1);  
        this.toastr.success('New row added successfully', 'New Row');  
        console.log(this.dynamicArray1);  
        return true;  
    }  
deletePassengerRow(index:any) {  
if(window.confirm('Are sure you want to delete ?')){ 
            this.dynamicArray1.splice(index, 1);  
            this.toastr.warning('Row deleted successfully', 'Delete row');                       
        }  
    }  
  statusSelect(value:any){
    if(value != ''){
      this.statusSelected = value;
    }
  }
  onReportSelect(value:any){
    if(value != ''){
      this.reportSelected = value;
    }
  }
  onSubmit(): void {
    this.authservice.dataEntry(this.form,this.reporttype,this.selectedRow,this.passengersRow,this.statusSelected,this.sessionuser,this.reportSelected).subscribe((data) => {
      console.log(data);
      this.pdfname = data.pdf_name;
      this.msg = data.msg;      
      Swal.fire(this.msg);
      console.log("pdfName = "+this.pdfname);
    }),(err:any) =>{  
      this.error = err.msg;
      Swal.fire(this.error);
    }
  }
  
  omit_special_char(event:any)
  {   
     var k;  
     k = event.charCode;  //         k = event.keyCode;  (Both can be used)
     return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {      
      alert("Enter Numbers Only");  
      return false;    
    }    
    return true;

  }
specialUnderscore(event:any){
  var n;  
  n = event.charCode;  //         k = event.keyCode;  (Both can be used)
  return((n > 64 && n < 91) || (n > 96 && n < 123) || n == 8 || n == 32 || (n >= 48 && n <= 57) ||n==95 ); 
}
specialUnderscoreDot(event:any){
  var n;  
  n = event.charCode;  //         k = event.keyCode;  (Both can be used)
  return((n > 64 && n < 91) || (n > 96 && n < 123) || n == 8 || n == 32 || (n >= 48 && n <= 57) ||n==95 || n == 46 ); 
}
specialDash(event:any){
  var n;  
  n = event.charCode;  //         k = event.keyCode;  (Both can be used)
  return((n > 64 && n < 91) || (n > 96 && n < 123) || n == 8 || n == 32 || (n >= 48 && n <= 57) ||n==45 ); 
}
specialDashSpace(event:any){
  var n;  
  n = event.charCode;  //         k = event.keyCode;  (Both can be used)
  return((n > 64 && n < 91) || (n > 96 && n < 123) || n == 8 || n == 32 || (n >= 48 && n <= 57) ||n==45 || n== 35);
}
specialDashDotSpace(event:any){
  var n;  
  n = event.charCode;  //         k = event.keyCode;  (Both can be used)
  return((n > 64 && n < 91) || (n > 96 && n < 123) || n == 8 || n == 32 || (n >= 48 && n <= 57) ||n==45 || n== 35 || n == 46);
}
specialDashDotSpaceAnd(event:any){
  var n;  
  n = event.charCode;  //         k = event.keyCode;  (Both can be used)
  return((n > 64 && n < 91) || (n > 96 && n < 123) || n == 8 || n == 32 || (n >= 48 && n <= 57) ||n==45 || n== 35 || n == 46 || n==38);
}
           
            
      public settings = {
    
        columns: {
          P_ID: {
            title: 'P_ID'
          },
          Driver_first_name: {
            title: 'Driver_first_name'
          },
          Driver_last_name: {
            title: 'Driver_last_name'
          },
          insurance_company: {
            title: 'insurance_company'
          },
          V_ID:{
            title:'V_ID'
          },
          vin:{
            title:'vin'           
            
          },
          vehicle_make:{
            title:'vehicle_make'
          },
          vehicle_model:{
            title:'vehicle_model'
          },
          vehicle_plate:{
            title:'vehicle_plate'
          },
          vehicle_year:{
            title:'vehicle_year'
          },
          plate_state:{
            title:'plate_state'
          },
          airbag:{
            title:'airbag'
          },
          damage:{
            title:'damage'
          },
          extraction:{
            title:'extraction'
          },
          fire:{
            title:'fire'
          },
          point_of_impact:{
            title:'point_of_impact'
          },
          towing:{
            title:'towing'
          }
        },
        pager: {
          display: true,
          perPage: 10
        },
        actions: {
          columnTitle: 'Action',
          add: true,
          edit: true,
          delete: true,
          position: 'left',
          class:'abc'
        },
        rowClassFunction: (row:any) =>{
          if(row.index % 2 === 0){
            return 'solved';
          }else {
            return 'aborted'
          }
        },
        attr: {
          class: 'table table-striped table-bordered table-hover'
        },
        defaultStyle: false
      };      

}

  
