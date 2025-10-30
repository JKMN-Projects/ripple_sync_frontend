import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterModal } from './register-modal';

describe('RegisterModal', () => {
  let component: RegisterModal;
  let fixture: ComponentFixture<RegisterModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
