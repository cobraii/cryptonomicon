import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TickerService } from '../../data/services/ticker.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'app-ticker-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TickerFormComponent),
      multi: true,
    }
  ],
  templateUrl: './ticker-form.component.html',
  styleUrl: './ticker-form.component.css'
})
export class TickerFormComponent implements ControlValueAccessor, OnInit{
  @Input() displayedCoinListName?: string[]
  @Output() addTicker = new EventEmitter<string>()
  public tickerName = new FormControl<string>('')
  public isTickerExists: string = ''

  onChange: any = () => {};
  onTouched: any = () => {};

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

  valueInput(coin: string){
    this.tickerName.setValue(coin)
  }

  ngOnInit(): void {
    this.subscribeToValueChanges()
  }

  writeValue(value: any): void {
    this.tickerName.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private subscribeToValueChanges(): void {
    this.tickerName.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.onChange(value);
    });
  }
}
