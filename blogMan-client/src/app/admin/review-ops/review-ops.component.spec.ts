import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewOpsComponent } from './review-ops.component';

describe('ReviewOpsComponent', () => {
  let component: ReviewOpsComponent;
  let fixture: ComponentFixture<ReviewOpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewOpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
