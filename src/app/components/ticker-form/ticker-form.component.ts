import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TickerService } from '../../data/services/ticker.service';


@Component({
  selector: 'app-ticker-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [],
  templateUrl: './ticker-form.component.html',
  styleUrl: './ticker-form.component.css'
})
export class TickerFormComponent{
  @Output() addTicker = new EventEmitter<string>()

  public tickerName = new FormControl<string>('')
  public isTickerExists: string = ''

  constructor(private tickerService: TickerService) {
  }

  onAddTicker(){
    if(this.tickerName.value){
      this.tickerService.isTickerExists$.subscribe((exists: string) => {
        this.isTickerExists = exists;
      });
      this.addTicker.emit(this.tickerName.value);
    }
  }
}
