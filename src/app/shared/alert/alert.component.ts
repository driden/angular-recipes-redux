import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  templateUrl: './alert.component.html',
  selector: 'app-alert',
  styleUrls: ['alert.component.css']
})
export class AlertComponent {
  @Input() message: string;
  @Output() closeAlert = new EventEmitter<void>();

  onClose() {
    this.closeAlert.emit();
  }
}
