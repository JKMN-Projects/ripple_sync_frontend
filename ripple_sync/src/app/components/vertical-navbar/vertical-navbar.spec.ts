import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavbar } from './vertical-navbar';

describe('VerticalNavbar', () => {
  let component: VerticalNavbar;
  let fixture: ComponentFixture<VerticalNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
