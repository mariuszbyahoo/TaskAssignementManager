import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificGroupComponent } from './specific-group.component';

describe('SpecificGroupComponent', () => {
  let component: SpecificGroupComponent;
  let fixture: ComponentFixture<SpecificGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
