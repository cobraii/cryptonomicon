import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TickerChartComponent } from "./components/ticker-chart/ticker-chart.component";
import { TickerListComponent } from "./components/ticker-list/ticker-list.component";
import { TickerFormComponent } from "./components/ticker-form/ticker-form.component";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TickerChartComponent, TickerListComponent, TickerFormComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cryptonomicon';
}
