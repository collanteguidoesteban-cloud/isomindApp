import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinarComponent } from './opinar.component';

describe('OpinarComponent', () => {
  let component: OpinarComponent;
  let fixture: ComponentFixture<OpinarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpinarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpinarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
