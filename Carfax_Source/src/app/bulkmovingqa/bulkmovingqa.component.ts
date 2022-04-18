import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../_services/authservice.service';

@Component({
  selector: 'app-bulkmovingqa',
  templateUrl: './bulkmovingqa.component.html',
  styleUrls: ['./bulkmovingqa.component.css']
})
export class BulkmovingqaComponent implements OnInit {

  metro:any;
  nonmetro:any;
  selected: string;
  stateselect: string;
  agencyselect: string;
  state: any;
  agency: any;

  constructor(private authservice:AuthserviceService) { }

  ngOnInit(): void {
    this.getState();
  }
  onItemChange(value: any) {
    if (this.selected != '') {
      this.selected = value;
      console.log(this.selected);
    }
  }
  onStateChange(state: any) {
    if (this.stateselect != '') {
      this.stateselect = state;
    }
  }
  onAgencyChange(agency: any) {
    if (this.agencyselect != '') {
      this.agencyselect = agency;
    }
  }
  getState(): void {
    this.authservice.getServiceState().subscribe((data) => {
      this.state = data['recordsets'][3];
      this.agency = data['recordsets'][2];
    })
  }
  public Settings = {

    columns: {

      Name: {
        title: 'Name',
        filter: false
      },
      State: {
        type: 'html',
        title: 'State',
        filter: false
      },
      Agency: {
        type: 'html',
        title: 'Agency',
        filter: false
      },
      Step: {
        type: 'html',
        title: 'Step',
        filter: false
      },
      Count: {
        type: 'html',
        title: 'Count',
        filter: false
      }
    },
    pager: {
      display: true,
      perPage: 2000
    },
    hideSubHeader: true,
    selectedRowIndex: -1,
    mode: 'inline',
    actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: false
  };

}
