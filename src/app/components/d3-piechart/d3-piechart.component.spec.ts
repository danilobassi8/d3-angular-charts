import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PiechartComponent } from './d3-piechart.component';

describe('D3PiechartComponent', () => {
  let component: D3PiechartComponent;
  let fixture: ComponentFixture<D3PiechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ D3PiechartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
