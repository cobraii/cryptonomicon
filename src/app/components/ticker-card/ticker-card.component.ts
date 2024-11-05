import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticker } from '../../data/interfaces/ticker.interface';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-ticker-card',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './ticker-card.component.html',
  styleUrl: './ticker-card.component.css'
})
export class TickerCardComponent {
  @Input() ticker!: Ticker 
  @Output() deleteTicker  = new EventEmitter<number>();
  @Output() viewChart  = new EventEmitter<number>();

  OnDelete(){
    this.deleteTicker.emit(this.ticker.id)
  }

  OnviewChart(){
    this.viewChart.emit(this.ticker.id)
  }
}
