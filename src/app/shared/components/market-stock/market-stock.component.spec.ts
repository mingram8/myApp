import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketStockComponent } from './market-stock.component';

describe('MarketStockComponent', () => {
  let component: MarketStockComponent;
  let fixture: ComponentFixture<MarketStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
