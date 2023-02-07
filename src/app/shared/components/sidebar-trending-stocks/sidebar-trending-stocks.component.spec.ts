import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarTrendingStocksComponent } from './sidebar-trending-stocks.component';

describe('SidebarTrendingStocksComponent', () => {
  let component: SidebarTrendingStocksComponent;
  let fixture: ComponentFixture<SidebarTrendingStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarTrendingStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarTrendingStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
