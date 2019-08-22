import { Injectable } from '@angular/core';
import { Hero } from './hero';
// import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessagesService } from './messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ReturnStatement } from '@angular/compiler';
import { toBase64String } from '@angular/compiler/src/output/source_map';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {


  private heroesUrl = 'api/heroes';

  constructor(
    private messageService: MessagesService,
    private http: HttpClient,
  ) { }

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    // return of(HEROES);
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  /*  getHero(id:number):Observable<Hero> {
     this.messageService.add(`HeroService: fetched hero id=${id}`);
     return of(HEROES.find(hero => hero.id === id));
   }
  */

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero:Hero):Observable<any> {
    return this.http.put(this.heroesUrl,hero,httpOptions).pipe(
      tap(_=> this.log(`updates hero id = ${hero.id}`)),
      catchError(this.handleError<any>(`updateHero`))
    );
  }
  addHero(hero:Hero):Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl,hero,httpOptions).pipe(
      tap((newHero:Hero) => this.log(`added Hero /w id = ${newHero.id}`)),
      catchError(this.handleError<Hero>(`addHero`))
    );
  }

  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
  
    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }




  private log(mesage: string) {
    this.messageService.add('HeroService: ${message}');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
