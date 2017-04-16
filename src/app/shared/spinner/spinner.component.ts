import { Component, Input } from '@angular/core';

@Component({
  selector: 'nghb-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.styl']
})
export class SpinnerComponent {
  @Input() enabled: boolean;
}
