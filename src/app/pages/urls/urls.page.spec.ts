import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlsPage } from './urls.page';

describe('UrlsPage', () => {
  let component: UrlsPage;
  let fixture: ComponentFixture<UrlsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UrlsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
