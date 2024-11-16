import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticker } from '../../data/interfaces/ticker.interface';
import { NgClass, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-ticker-card',
  standalone: true,
  imports: [UpperCasePipe, NgClass],
  templateUrl: './ticker-card.component.html',
  styleUrl: './ticker-card.component.css'
})
export class TickerCardComponent {
  @Input() displayedTickers!: Ticker;
  @Input() selectedBorder?: string | null;
  @Output() deleteTicker  = new EventEmitter<number>();
  @Output() viewChart  = new EventEmitter<number>();

  OnDelete(){
    this.deleteTicker.emit(this.displayedTickers.id)
  }

  OnviewChart(){
    this.viewChart.emit(this.displayedTickers.id)
    this.selectedBorder = this.displayedTickers.tickerName
  }
}
