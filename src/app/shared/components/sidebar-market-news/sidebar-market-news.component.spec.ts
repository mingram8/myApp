import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMarketNewsComponent } from './sidebar-market-news.component';

describe('SidebarMarketNewsComponent', () => {
  let component: SidebarMarketNewsComponent;
  let fixture: ComponentFixture<SidebarMarketNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarMarketNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarMarketNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
