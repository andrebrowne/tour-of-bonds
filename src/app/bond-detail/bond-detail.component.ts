import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Bond }         from '../bond';
import { BondService }  from '../bond.service';

@Component({
  selector: 'app-bond-detail',
  templateUrl: './bond-detail.component.html',
  styleUrls: [ './bond-detail.component.css' ]
})
export class BondDetailComponent implements OnInit {
  @Input() bond: Bond;

  constructor(
    private route: ActivatedRoute,
    private bondService: BondService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getBond();
  }

  getBond(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.bondService.getBond(id)
      .subscribe(bond => this.bond = bond);
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.bondService.updateBond(this.bond)
      .subscribe(() => this.goBack());
  }
}
