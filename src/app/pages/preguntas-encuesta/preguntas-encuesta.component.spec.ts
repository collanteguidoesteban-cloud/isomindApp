import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasEncuestaComponent } from './preguntas-encuesta.component';

describe('PreguntasEncuestaComponent', () => {
  let component: PreguntasEncuestaComponent;
  let fixture: ComponentFixture<PreguntasEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreguntasEncuestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntasEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
