import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendDataComponent } from './backend-data.component';

describe('BackendDataComponent', () => {
  let component: BackendDataComponent;
  let fixture: ComponentFixture<BackendDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackendDataComponent]
    });
    fixture = TestBed.createComponent(BackendDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
