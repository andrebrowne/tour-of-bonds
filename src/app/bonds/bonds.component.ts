import { Component, OnInit } from '@angular/core';

import { Bond } from '../bond';
import { BondService } from '../bond.service';

@Component({
  selector: 'app-bonds',
  templateUrl: './bonds.component.html',
  styleUrls: ['./bonds.component.css']
})
export class BondsComponent implements OnInit {
  bonds: Bond[];

  constructor(private bondService: BondService) { }

  ngOnInit() {
    this.getBonds();
  }

  getBonds(): void {
    this.bondService.getBonds()
    .subscribe(bonds => this.bonds = bonds);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.bondService.addBond({ name } as Bond)
      .subscribe(bond => {
        this.bonds.push(bond);
      });
  }

  delete(bond: Bond): void {
    this.bonds = this.bonds.filter(h => h !== bond);
    this.bondService.deleteBond(bond).subscribe();
  }

}
