import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Flap } from './flap';

describe('Flap', () => {
  let component: Flap;
  let fixture: ComponentFixture<Flap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Flap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Flap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
