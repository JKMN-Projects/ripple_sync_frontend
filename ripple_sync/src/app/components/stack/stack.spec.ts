import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stack } from './stack';

describe('Stack', () => {
  let component: Stack;
  let fixture: ComponentFixture<Stack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
