import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyersComponent } from './buyers.component';

describe('SellersComponent', () => {
  let component: BuyersComponent;
  let fixture: ComponentFixture<BuyersComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BuyersComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
