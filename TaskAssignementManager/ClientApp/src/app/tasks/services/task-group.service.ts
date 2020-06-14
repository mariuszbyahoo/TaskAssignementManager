import { Injectable, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ITaskGroup } from '../models/ITaskGroup';

@Injectable({
  providedIn: 'root'
})
export class TaskGroupService implements OnInit {
  private url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url + 'api/groups';
  }
  ngOnInit(): void {
  }

  getTaskGroups(): Observable<ITaskGroup[]> {
    return this.http.get<ITaskGroup[]>(this.url);
  }

  getTaskGroup(id): Observable<ITaskGroup> {
    let tempUrl = `${this.url}/take?id=${id}`;
    return this.http.get<ITaskGroup>(tempUrl);
  }

  deleteTaskGroup(id): Observable<any> {
    let tempUrl = `${this.url}?id=${id}`;
    return this.http.delete(tempUrl);
  }

  patchTaskGroup(taskGroup): Observable<ITaskGroup> {
    return this.http.patch<ITaskGroup>(this.url, taskGroup);
  }

  postTaskGroup(taskGroup): Observable<ITaskGroup> {
    return this.http.post<ITaskGroup>(this.url, taskGroup);
  }
}
