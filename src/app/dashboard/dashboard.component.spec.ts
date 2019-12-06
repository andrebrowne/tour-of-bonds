import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { BondSearchComponent } from '../bond-search/bond-search.component';

import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BONDS } from '../mock-bonds';
import { BondService } from '../bond.service';
import { MessageService } from '../message.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let bondService;
  let messageService;
  let getBondsSpy;
  let getBondListSpy;

  beforeEach(async(() => {
    bondService = jasmine.createSpyObj('BondService', ['getBonds']);
    getBondsSpy = bondService.getBonds.and.returnValue( of(BONDS) );
    messageService = jasmine.createSpyObj('MessageService', ['getBondList']);
    getBondListSpy = messageService.getBondList.and.returnValue( of(BONDS) );
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        BondSearchComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: BondService, useValue: bondService },
        { provide: MessageService, useValue: messageService }
      ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top 4 Bonds" as headline', () => {
    expect(fixture.nativeElement.querySelector('h3').textContent).toEqual('Top 4 Bonds');
  });

  it('should call bondService', async(() => {
    expect(getBondsSpy.calls.any()).toBe(true);
  }));

  it('should display 4 links', async(() => {
    expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(4);
  }));

});
