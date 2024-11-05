import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ticker-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticker-chart.component.html',
  styleUrl: './ticker-chart.component.css'
})
export class TickerChartComponent {
  @Input() normalizedPrices!: number[];
  @Input() selectedChart!: string | null;

  hideChart(){
    this.selectedChart = ''
  }
}
