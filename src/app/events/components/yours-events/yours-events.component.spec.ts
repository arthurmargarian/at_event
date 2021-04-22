import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoursEventsComponent } from './yours-events.component';

describe('YoursEventsComponent', () => {
  let component: YoursEventsComponent;
  let fixture: ComponentFixture<YoursEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YoursEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoursEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
