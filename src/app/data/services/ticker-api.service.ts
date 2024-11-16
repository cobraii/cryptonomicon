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
      `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=164001b8d87df66e009c9af61f5ab45cd2ae58885470c8508a93517e988b6356`
    ).pipe(
      catchError(error => {
        console.error("Ошибка запроса к API:", error);
        return of({ Response: 'Error', Message: 'Ошибка сети или неверный тикер' });
      })
    );
  }

  getAllCoin() {
    return this.http.get<any>('https://min-api.cryptocompare.com/data/blockchain/list', {
      headers: {
        'Authorization': 'Apikey 164001b8d87df66e009c9af61f5ab45cd2ae58885470c8508a93517e988b6356'
      }
    });
  }
}
