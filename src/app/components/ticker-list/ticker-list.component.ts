import { Component, OnInit } from '@angular/core';
import { TickerService } from '../../data/services/ticker.service';
import { TickerCardComponent } from "../ticker-card/ticker-card.component";
import { Ticker } from '../../data/interfaces/ticker.interface';
import { CommonModule, NgClass } from '@angular/common';
import { TickerFormComponent } from "../ticker-form/ticker-form.component";
import { TickerChartComponent } from "../ticker-chart/ticker-chart.component";
import { TickerApiService } from '../../data/services/ticker-api.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ticker-list',
  standalone: true,
  imports: [TickerCardComponent,
    CommonModule,
    TickerFormComponent,
    TickerChartComponent,
    ReactiveFormsModule, LoadingSpinnerComponent],
  providers: [TickerService],
  templateUrl: './ticker-list.component.html',
  styleUrl: './ticker-list.component.css'
})
export class TickerListComponent implements OnInit {

  private intervalId: any;
  public isLoading$!: Observable<boolean>;
  public tickers$?: Observable<Ticker[]>;
  public displayedTickers: Ticker[] = []
  public prices: number[] = []
  public normalizedPrices: number[] = []
  public coinListName: string[] = []
  public displayedCoinListName: string[] = []
  public selectedChart?: string | null;
  public currentPage: number = 1;
  public total: number = 0;
  public pages: number[] = [];
  public tickerName = new FormControl('')

  constructor(
    private tickerService: TickerService,
    private tickerApiService: TickerApiService ,
  ){}

  ngOnInit(): void {
    this.tickers$ = this.tickerService.getTickers$()
    this.isLoading$ = this.tickerService.isLoading$;
    this.tickerApiService.getAllCoin().subscribe(coinList => {
      this.coinListName = Object.keys(coinList.Data)
    });
    this.tickerName.valueChanges.subscribe(filterName => {
      if (filterName) {
        const filteredCoinList = this.coinListName.filter(coin =>
          coin.toLowerCase().includes(filterName.toLowerCase())
        );
        this.displayedCoinListName = filteredCoinList;
      } else {
        this.displayedCoinListName = [];
      }
    })
    this.tickers$.subscribe(tickers =>{
      this.displayedTickers = tickers.slice(0,6)
    })
    this.pagesCount()
    this.intervalId = setInterval(() => {
      this.tickerService.updatePrices();
      this.tickers$?.subscribe(tickers =>{
        tickers.filter((ticker) => {
          if(ticker.tickerName === this.selectedChart){
            this.prices.push(ticker.tickerPrice)
            this.normalizedPrices = this.normalizeChart(this.prices);
          }
        })
      })
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  range(start: number, end: number): number[] {
    return [...Array(end).keys()].map((el) => el + start)
  }
  
  pagesCount(){
    this.tickers$?.subscribe(tickers =>{
      const pageCount = Math.ceil(tickers.length / 6)
      this.pages = this.range(1, pageCount)
    })
  }

  changePage(page: number){
    this.currentPage = page
    this.tickers$?.subscribe(tickers =>{
      this.displayedTickers = tickers.slice(6 * (page - 1), 6 * page)
    })
  }
  
  onAddTicker(tickerName: string) {
    this.tickerService.addTicker(tickerName)
  }

  onTickerDelete(curentId: number) {
    this.tickerService.deleteTicker(curentId)

    this.tickers$?.subscribe(tickers =>{
      if (tickers.length <= (this.currentPage - 1) * 6 && this.currentPage > 1) {
        this.currentPage--;
      }
    })
  }

  onViewChart(curentId: number){
    this.prices = []
    this.tickers$?.subscribe(tickers =>{
      tickers.filter((ticker) => {
        if(ticker.id === curentId){
          this.prices.push(ticker.tickerPrice)
          this.selectedChart = ticker.tickerName
        }
      })
      this.normalizedPrices = this.normalizeChart(this.prices);
    })
  }

  normalizeChart(prices: number[]) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    let diff = maxPrice - minPrice || 1;
    return prices.map((price) => 5 + ((price - minPrice) * 95) / diff);
  }

}
