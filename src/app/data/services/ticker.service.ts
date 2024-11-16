import { Injectable, OnInit } from '@angular/core';
import { TickerApiService } from './ticker-api.service';
import { Ticker } from '../interfaces/ticker.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class TickerService {

  private tickers$ = new BehaviorSubject<Ticker[]>([])
  private isTickerExistsSubject = new BehaviorSubject<string>(''); // Субъект для сообщений об ошибках
  public isTickerExists$ = this.isTickerExistsSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false); // Субъект для сообщений об ошибках
  public isLoading$ = this.isLoadingSubject.asObservable();
  
  constructor(private tickerApiService: TickerApiService) {}

  public getTickers$() {
    const storedTickers = localStorage.getItem('tickers');
    if(storedTickers){
      this.tickers$.next(JSON.parse(storedTickers))
    }
    return this.tickers$.asObservable();
  }

  addTicker(tickerName: string) {
    const currentTickers = this.tickers$.value;
    this.isLoadingSubject.next(true);
    if (!this.tickers$.value.some(tickers => tickers.tickerName.toLowerCase() === tickerName.toLowerCase())) {
      const id = Date.now()
      this.tickerApiService.getDataPrice(tickerName).subscribe(response => {
        if ('USD' in response) {
          const newTicker: Ticker = { id, tickerName, tickerPrice: response['USD'] };
          const updatedTickers = [...currentTickers, newTicker];
          this.tickers$.next(updatedTickers);
          localStorage.setItem('tickers', JSON.stringify(updatedTickers));
          this.isTickerExistsSubject.next('');
          this.isLoadingSubject.next(false);
        } else {
          console.warn(`Не удалось добавить тикер ${tickerName}: ${response['Message'] || 'Ошибка получения данных'}`);
          this.isTickerExistsSubject.next(`Не удалось добавить тикер ${tickerName}`);
        }
      });
    } else {
      this.isTickerExistsSubject.next('Такой тикер уже добавлен');
      this.isLoadingSubject.next(false);
    }
  }

  deleteTicker(curentId: number){
    const filteredTicker = [... this.tickers$.value.filter(ticker => ticker.id !== curentId)];
    this.tickers$.next(filteredTicker)
    localStorage.setItem('tickers', JSON.stringify(filteredTicker));
  }

  updatePrices() {
    this.tickers$.value.forEach(ticker => {
      this.tickerApiService.getDataPrice(ticker.tickerName).subscribe(priceData => {
        if ('USD' in priceData) {
          ticker.tickerPrice = priceData['USD'];
          localStorage.setItem('tickers', JSON.stringify(this.tickers$.value));
        }
      });
    });
  }

}
