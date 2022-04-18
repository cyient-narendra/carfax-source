import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfAllotmentComponent } from './self-allotment.component';

describe('SelfAllotmentComponent', () => {
  let component: SelfAllotmentComponent;
  let fixture: ComponentFixture<SelfAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfAllotmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
