import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IssueDetailComponent } from './issue-detail.component';
import { ApiService } from './api.service';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, IssueDetailComponent],
  providers: [ApiService],
  template: `
    <div>
      <div style="margin-bottom:10px;">
        <input [(ngModel)]="q" placeholder="Search title" />
        <select [(ngModel)]="filters.status">
          <option value="">All status</option>
          <option>open</option>
          <option>closed</option>
        </select>
        <select [(ngModel)]="filters.priority">
          <option value="">All priority</option>
          <option>low</option>
          <option>medium</option>
          <option>high</option>
        </select>
        <input [(ngModel)]="filters.assignee" placeholder="Assignee" />
        <button (click)="load()">Search</button>
        <button (click)="openCreate()">Create Issue</button>
      </div>

      <table border="1" cellpadding="6" style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <th (click)="setSort('id')">id</th>
            <th (click)="setSort('title')">title</th>
            <th (click)="setSort('status')">status</th>
            <th (click)="setSort('priority')">priority</th>
            <th (click)="setSort('assignee')">assignee</th>
            <th (click)="setSort('updatedAt')">updatedAt</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let it of issues" (click)="openDetail(it)" style="cursor:pointer">
            <td>{{it.id}}</td>
            <td>{{it.title}}</td>
            <td>{{it.status}}</td>
            <td>{{it.priority}}</td>
            <td>{{it.assignee}}</td>
            <td>{{it.updatedAt}}</td>
            <td><button (click)="edit(it); $event.stopPropagation()">Edit</button></td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:10px;">
        <button (click)="prev()" [disabled]="page<=1">Prev</button>
        Page {{page}}
        <button (click)="next()">Next</button>
      </div>

      <div *ngIf="showCreate" style="margin-top:20px;border:1px solid #ccc;padding:10px">
        <h3>{{editing? 'Edit Issue' : 'Create Issue'}}</h3>
        <div>
          <label>Title</label><br/>
          <input [(ngModel)]="form.title" style="width:100%"/>
        </div>
        <div>
          <label>Description</label><br/>
          <textarea [(ngModel)]="form.description" style="width:100%"></textarea>
        </div>
        <div>
          <label>Status</label>
          <select [(ngModel)]="form.status">
            <option>open</option><option>closed</option>
          </select>
          <label>Priority</label>
          <select [(ngModel)]="form.priority">
            <option>low</option><option>medium</option><option>high</option>
          </select>
          <label>Assignee</label>
          <input [(ngModel)]="form.assignee" />
        </div>
        <div style="margin-top:10px;">
          <button (click)="save()">Save</button>
          <button (click)="cancel()">Cancel</button>
        </div>
      </div>

      <app-issue-detail *ngIf="detail" [issue]="detail" (close)="detail=null"></app-issue-detail>
    </div>
  `
})
export class IssueListComponent implements OnInit {
  issues:any[] = [];
  q = '';
  filters:any = {status:'',priority:'',assignee:''};
  sortBy = 'updatedAt';
  sortDir = 'desc';
  page = 1;
  pageSize = 10;
  showCreate = false;
  form:any = {title:'',description:'',status:'open',priority:'medium',assignee:''};
  editing = false;
  editId:number|undefined = undefined;
  detail:any = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    const params:any = {
      q: this.q,
      status: this.filters.status,
      priority: this.filters.priority,
      assignee: this.filters.assignee,
      sortBy: this.sortBy,
      sortDir: this.sortDir,
      page: this.page,
      pageSize: this.pageSize
    };
    this.api.listIssues(params).subscribe((res:any) => {
      this.issues = res;
    });
  }

  setSort(col:string) {
    if (this.sortBy === col) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = col;
      this.sortDir = 'asc';
    }
    this.load();
  }

  prev(){ if(this.page>1){ this.page--; this.load(); } }
  next(){ this.page++; this.load(); }

  openCreate(){
    this.showCreate = true;
    this.editing = false;
    this.form = {title:'',description:'',status:'open',priority:'medium',assignee:''};
  }

  edit(it:any){
    this.showCreate = true;
    this.editing = true;
    this.form = {...it};
    this.editId = it.id;
  }

  save(){
    if(this.editing && this.editId){
      this.api.updateIssue(this.editId, this.form).subscribe((res:any)=>{ this.showCreate=false; this.load(); });
    } else {
      this.api.createIssue(this.form).subscribe((res:any)=>{ this.showCreate=false; this.load(); });
    }
  }

  cancel(){ this.showCreate=false; }

  openDetail(it:any){
    this.api.getIssue(it.id).subscribe((res:any)=>{ this.detail = res; });
  }
}
