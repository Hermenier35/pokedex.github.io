import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheComponentComponent } from './recherche-component.component';

describe('RechercheComponentComponent', () => {
  let component: RechercheComponentComponent;
  let fixture: ComponentFixture<RechercheComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RechercheComponentComponent]
    });
    fixture = TestBed.createComponent(RechercheComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
