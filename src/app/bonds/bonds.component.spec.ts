import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BondsComponent } from './bonds.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BondsComponent', () => {
  let component: BondsComponent;
  let fixture: ComponentFixture<BondsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BondsComponent ],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
