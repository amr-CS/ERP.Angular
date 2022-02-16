import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicinfoComponent } from './demographicinfo.component';

describe('DemographicinfoComponent', () => {
  let component: DemographicinfoComponent;
  let fixture: ComponentFixture<DemographicinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemographicinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemographicinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
