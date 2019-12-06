import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Bond } from '../bond';
import { BondService } from '../bond.service';

@Component({
  selector: 'app-bond-search',
  templateUrl: './bond-search.component.html',
  styleUrls: [ './bond-search.component.css' ]
})
export class BondSearchComponent implements OnInit {
  bonds$: Observable<Bond[]>;
  private searchTerms = new Subject<string>();

  constructor(private bondService: BondService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.bonds$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.bondService.searchBonds(term)),
    );
  }
}
