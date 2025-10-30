import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertPost } from './upsert-post';

describe('UpsertPost', () => {
  let component: UpsertPost;
  let fixture: ComponentFixture<UpsertPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertPost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
