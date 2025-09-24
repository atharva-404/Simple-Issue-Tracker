import { Component } from '@angular/core';
import { IssueListComponent } from './issue-list.component';
import { HttpClientModule } from '@angular/common/http'; // << import HttpClientModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IssueListComponent, HttpClientModule], // << add it here
  template: `
    <div style="padding:20px;font-family:Arial,Helvetica,sans-serif">
      <h1>Simple Issue Tracker</h1>
      <app-issue-list></app-issue-list>
    </div>
  `
})
export class AppComponent {}
