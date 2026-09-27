import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPreviaEncuestaComponent } from './vista-previa-encuesta.component';

describe('VistaPreviaEncuestaComponent', () => {
  let component: VistaPreviaEncuestaComponent;
  let fixture: ComponentFixture<VistaPreviaEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaPreviaEncuestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaPreviaEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
