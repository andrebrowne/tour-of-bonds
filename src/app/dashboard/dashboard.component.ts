import { Component, OnInit } from '@angular/core';
import { Bond } from '../bond';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  bonds: Bond[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.getBonds();
  }

  getBonds(): void {
    this.messageService.getBondList()
      .subscribe(bonds => this.bonds = bonds.slice(2, (bonds.length / 2) + 2));
  }
}
