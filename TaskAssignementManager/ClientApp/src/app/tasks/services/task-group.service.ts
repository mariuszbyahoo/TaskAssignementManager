import { Injectable, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ITaskGroup } from '../userTasks/ITaskGroup';

@Injectable({
  providedIn: 'root'
})
export class TaskGroupService implements OnInit {
  private url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url + 'api/groups';
  }
  ngOnInit(): void {
    console.log('Group selected in group service: ');
    this.groupSelected$.subscribe(g => {
      console.log(g);
    })
  }

  // Observable IUserTask source
  private groupSource = new Subject<ITaskGroup>();

  // Observable IUserTask streams
  groupSelected$ = this.groupSource.asObservable();

  // Service message tasks
  sendGroup(group: ITaskGroup) {
    this.groupSource.next(group);
    this.groupSource.subscribe(g=> {
      console.log('group send from service, here again: ');
      console.log(g);
    })
  }

  getTaskGroups(): Observable<ITaskGroup[]> {
    console.log('getTaskGroups() succesfully ran!');
    return this.http.get<ITaskGroup[]>(this.url);
  }

  getTaskGroup(id): Observable<ITaskGroup> {
    let tempUrl = `${this.url}/${id}`;
    console.log('getTaskGroup() succesfully ran!');
    return this.http.get<ITaskGroup>(tempUrl);
  }

  deleteTaskGroup(id): Observable<any> {
    console.log('deleteTaskGroup invoked');
    let tempUrl = `${this.url}/${id}`;
    return this.http.delete(tempUrl);
  }

  patchTaskGroup(taskGroup): Observable<ITaskGroup> {
    return this.http.patch<ITaskGroup>(this.url, taskGroup);
  }
}
