import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  template: `
    <div style="position:fixed;right:10px;top:10px;width:400px;background:#fff;border:1px solid #ccc;padding:10px;box-shadow:0 2px 8px rgba(0,0,0,0.2)">
      <button (click)="close.emit()" style="float:right">Close</button>
      <pre>{{ issue | json }}</pre>
    </div>
  `
})
export class IssueDetailComponent {
  @Input() issue: any;
  @Output() close = new EventEmitter<void>();
}
