import { Component, OnInit } from '@angular/core';
import { TickerService } from '../../data/services/ticker.service';
import { TickerCardComponent } from "../ticker-card/ticker-card.component";
import { Ticker } from '../../data/interfaces/ticker.interface';
import { CommonModule } from '@angular/common';
import { TickerFormComponent } from "../ticker-form/ticker-form.component";
import { TickerChartComponent } from "../ticker-chart/ticker-chart.component";

@Component({
  selector: 'app-ticker-list',
  standalone: true,
  imports: [TickerCardComponent, CommonModule, TickerFormComponent, TickerChartComponent],
  providers: [TickerService],
  templateUrl: './ticker-list.component.html',
  styleUrl: './ticker-list.component.css'
})
export class TickerListComponent implements OnInit {

  public tickers: Ticker[] = []
  public prices: number[] = []
  public normalizedPrices: number[] = []
  public selectedChart?: string | null;
  private intervalId: any;

  constructor(
    private tickerService: TickerService,
  ){}

  ngOnInit(): void {
    this.tickers = this.tickerService.tickers
    this.intervalId = setInterval(() => {
      this.tickerService.updatePrices();
      this.tickers.filter((ticker) => {
        if(ticker.tickerName === this.selectedChart){
          this.prices.push(ticker.tickerPrice)
          this.normalizedPrices = this.normalizeChart(this.prices);
        }
      })
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  onAddTicker(tickerName: string){
    this.tickerService.addTicker(tickerName)
    this.tickers = this.tickerService.tickers
  }

  onTickerDelete(curentId: number) {
    this.tickerService.deleteTicker(curentId)
    this.tickers = this.tickerService.tickers
  }

  onViewChart(curentId: number){
    this.prices = []
    this.tickers.filter((ticker) => {
      if(ticker.id === curentId){
        this.prices.push(ticker.tickerPrice)
        this.selectedChart = ticker.tickerName
      }
    })
    this.normalizedPrices = this.normalizeChart(this.prices);
  }

  normalizeChart(prices: number[]) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    let diff = maxPrice - minPrice || 1;
    return prices.map((price) => 5 + ((price - minPrice) * 95) / diff);
  }

}
