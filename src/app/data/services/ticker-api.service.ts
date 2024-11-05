import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TickerApiService {
  constructor(private http: HttpClient ) { }

  getDataPrice(tickerName: string): Observable<{ USD: number } | { Response: string, Message: string }> {
    return this.http.get<{ USD: number } | { Response: string, Message: string }>(
      `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=ce3fd966e7a1d10d65f907b20bf000552158fd3ed1bd614110baa0ac6cb57a7e`
    ).pipe(
      catchError(error => {
        console.error("Ошибка запроса к API:", error);
        return of({ Response: 'Error', Message: 'Ошибка сети или неверный тикер' });
      })
    );
  }
}
