import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutenticidadPage } from './autenticidad.page';

describe('AutenticidadPage', () => {
  let component: AutenticidadPage;
  let fixture: ComponentFixture<AutenticidadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AutenticidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
