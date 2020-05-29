import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOpsComponent } from './post-ops.component';

describe('PostOpsComponent', () => {
  let component: PostOpsComponent;
  let fixture: ComponentFixture<PostOpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostOpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
