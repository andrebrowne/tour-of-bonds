import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Bond } from './bond';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class BondService {

  private bondsUrl = 'api/bonds';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET bonds from the server */
  getBonds(): Observable<Bond[]> {
    return this.http.get<Bond[]>(this.bondsUrl)
      .pipe(
        tap(_ => this.log('fetched bonds')),
        catchError(this.handleError<Bond[]>('getBonds', []))
      );
  }

  /** GET bond by id. Return `undefined` when id not found */
  getBondNo404<Data>(id: number): Observable<Bond> {
    const url = `${this.bondsUrl}/?id=${id}`;
    return this.http.get<Bond[]>(url)
      .pipe(
        map(bonds => bonds[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} bond id=${id}`);
        }),
        catchError(this.handleError<Bond>(`getBond id=${id}`))
      );
  }

  /** GET bond by id. Will 404 if id not found */
  getBond(id: number): Observable<Bond> {
    const url = `${this.bondsUrl}/${id}`;
    return this.http.get<Bond>(url).pipe(
      tap(_ => this.log(`fetched bond id=${id}`)),
      catchError(this.handleError<Bond>(`getBond id=${id}`))
    );
  }

  /* GET bonds whose name contains search term */
  searchBonds(term: string): Observable<Bond[]> {
    if (!term.trim()) {
      // if not search term, return empty bond array.
      return of([]);
    }
    return this.http.get<Bond[]>(`${this.bondsUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found bonds matching "${term}"`)),
      catchError(this.handleError<Bond[]>('searchBonds', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new bond to the server */
  addBond(bond: Bond): Observable<Bond> {
    return this.http.post<Bond>(this.bondsUrl, bond, this.httpOptions).pipe(
      tap((newBond: Bond) => this.log(`added bond w/ id=${newBond.id}`)),
      catchError(this.handleError<Bond>('addBond'))
    );
  }

  /** DELETE: delete the bond from the server */
  deleteBond(bond: Bond | number): Observable<Bond> {
    const id = typeof bond === 'number' ? bond : bond.id;
    const url = `${this.bondsUrl}/${id}`;

    return this.http.delete<Bond>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted bond id=${id}`)),
      catchError(this.handleError<Bond>('deleteBond'))
    );
  }

  /** PUT: update the bond on the server */
  updateBond(bond: Bond): Observable<any> {
    return this.http.put(this.bondsUrl, bond, this.httpOptions).pipe(
      tap(_ => this.log(`updated bond id=${bond.id}`)),
      catchError(this.handleError<any>('updateBond'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a BondService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`BondService: ${message}`);
  }
}
