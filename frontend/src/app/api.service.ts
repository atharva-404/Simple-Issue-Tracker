import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:8000';

@Injectable({providedIn: 'root'})
export class ApiService {
  constructor(private http: HttpClient) {}

  listIssues(params:any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params || {}).forEach(k => {
      if (params[k] !== null && params[k] !== undefined && params[k] !== '') {
        httpParams = httpParams.set(k, params[k]);
      }
    });
    return this.http.get(API + '/issues', { params: httpParams });
  }

  getIssue(id: number) {
    return this.http.get(API + '/issues/' + id);
  }

  createIssue(payload:any) {
    return this.http.post(API + '/issues', payload);
  }

  updateIssue(id:number, payload:any) {
    return this.http.put(API + '/issues/' + id, payload);
  }
}