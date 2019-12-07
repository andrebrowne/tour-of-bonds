import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { Bond } from './bond';
import { tap, catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class MessageService {

  private bondsUrl = 'api/bondList';  // URL to web api

  messages: string[] = [];

  constructor(private http: HttpClient) {}

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [ 'All messages cleared'];
  }

}
