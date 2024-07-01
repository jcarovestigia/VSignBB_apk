import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultandoPage } from './consultando.page';

describe('ConsultandoPage', () => {
  let component: ConsultandoPage;
  let fixture: ComponentFixture<ConsultandoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConsultandoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
