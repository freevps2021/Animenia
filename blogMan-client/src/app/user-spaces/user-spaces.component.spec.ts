import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSpacesComponent } from './user-spaces.component';

describe('UserSpacesComponent', () => {
  let component: UserSpacesComponent;
  let fixture: ComponentFixture<UserSpacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSpacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
