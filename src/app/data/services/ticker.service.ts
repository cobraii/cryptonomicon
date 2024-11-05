import { Injectable, OnInit } from '@angular/core';
import { TickerApiService } from './ticker-api.service';
import { Ticker } from '../interfaces/ticker.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class TickerService {
  public tickers: Ticker[] = JSON.parse(localStorage.getItem('tickers') || '[]');
  private isTickerExistsSubject = new BehaviorSubject<string>('');
  public isTickerExists$ = this.isTickerExistsSubject.asObservable();

  constructor(private tickerApiService: TickerApiService) {}
  
  addTicker(tickerName: string) {
    if (!this.tickers.some(tickers => tickers.tickerName.toLowerCase() === tickerName.toLowerCase())) {
      const id = Date.now()
      this.tickerApiService.getDataPrice(tickerName).subscribe(response => {
        if ('USD' in response) {
          this.tickers.push({ id, tickerName, tickerPrice: response['USD'] });
          localStorage.setItem('tickers', JSON.stringify(this.tickers));
          this.isTickerExistsSubject.next('');
        } else {
          console.warn(`Не удалось добавить тикер ${tickerName}: ${response['Message'] || 'Ошибка получения данных'}`);
          this.isTickerExistsSubject.next(`${response['Message']}`);
        }
      });
    } else {
      this.isTickerExistsSubject.next('Такой тикер уже добавлен');
    }
  }

  deleteTicker(curentId: number){
    const filteredTicker = [... this.tickers.filter(ticker => ticker.id !== curentId)];
    this.tickers = filteredTicker
    localStorage.setItem('tickers', JSON.stringify(filteredTicker));

  }

  updatePrices() {
    this.tickers.forEach(ticker => {
      this.tickerApiService.getDataPrice(ticker.tickerName).subscribe(priceData => {
        if ('USD' in priceData) {
          ticker.tickerPrice = priceData['USD'];
          localStorage.setItem('tickers', JSON.stringify(this.tickers));
        }
      });
    });
  }

}
