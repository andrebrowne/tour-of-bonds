import { Component, OnInit } from '@angular/core';
import { Bond } from '../bond';
import { BondService } from '../bond.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  bonds: Bond[] = [];

  constructor(private bondService: BondService) { }

  ngOnInit() {
    this.getBonds();
  }

  getBonds(): void {
    this.bondService.getBonds()
      .subscribe(bonds => this.bonds = bonds.slice(2, (bonds.length / 2) + 2));
  }
}
