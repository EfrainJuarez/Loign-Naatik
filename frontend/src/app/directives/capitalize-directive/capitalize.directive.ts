import { Directive,ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCapitalize]'
})
export class CapitalizeDirective {

  constructor(private el:ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: any): void {
    const inputValue = event.target.value;
    event.target.value = this.capitalizeWords(inputValue);
  }

  capitalizeWords(inputString: string): string {
    return inputString
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

}
