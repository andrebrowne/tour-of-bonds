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

  /** GET bonds from the server */
  getBondList(): Observable<Bond[]> {
    return this.http.get<Bond[]>(this.bondsUrl)
      .pipe(
        tap(_ => console.log('fetched bond list')),
        catchError(this.handleError<Bond[]>('getBondList', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
