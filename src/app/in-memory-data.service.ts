import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Bond } from './bond';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const bondList = [
      { id:  10, name: 'James'},
      { id:  20, name: 'Barry'},
      { id: 150, name: 'Gold' },
      { id:  30, name: 'Bearer' },
      { id: 100, name: '' },
      { id:  40, name: 'Bearer' },
    ];

    const bonds = [
      { id:  10, name: 'James' },
      { id:  20, name: 'Barry' },
      { id:  30, name: 'bear' },
      { id:  40, name: 'Contract' },
      { id:  50, name: 'Commercial' },
      { id:  60, name: 'Municipal' },
      { id:  70, name: 'Zero-Coupon' },
      { id:  80, name: 'Corporate' },
      { id:  90, name: 'Notary' },
      { id: 100, name: 'Contractor License' },
      { id: 110, name: 'Motor Vehicle Dealer' },
      { id: 120, name: 'Private Investigator' },
      { id: 130, name: 'Mortgage Lender/Broker' },
      { id: 140, name: 'Collection Agency Bonds' },
      { id: 150, name: 'Gold' },
    ];

    return { bonds, bondList };
  }

  // Overrides the genId method to ensure that a bond always has an id.
  // If the bonds array is empty,
  // the method below returns the initial number (10).
  // if the bonds array is not empty, the method below returns the highest
  // bond id + 10.
  genId(bonds: Bond[]): number {
    return bonds.length > 0 ? Math.max(...bonds.map(bond => bond.id)) + 11 : 10;
  }
}
