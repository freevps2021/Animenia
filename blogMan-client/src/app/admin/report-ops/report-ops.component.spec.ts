import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOpsComponent } from './report-ops.component';

describe('ReportOpsComponent', () => {
  let component: ReportOpsComponent;
  let fixture: ComponentFixture<ReportOpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportOpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
