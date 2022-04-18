import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAndDeliveryComponent } from './view-and-delivery.component';

describe('ViewAndDeliveryComponent', () => {
  let component: ViewAndDeliveryComponent;
  let fixture: ComponentFixture<ViewAndDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAndDeliveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAndDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
