import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeOpsComponent } from './anime-ops.component';

describe('AnimeOpsComponent', () => {
  let component: AnimeOpsComponent;
  let fixture: ComponentFixture<AnimeOpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimeOpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
