import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountbilityComponent } from './user-accountbility.component';

describe('UserAccountbilityComponent', () => {
  let component: UserAccountbilityComponent;
  let fixture: ComponentFixture<UserAccountbilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountbilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountbilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
