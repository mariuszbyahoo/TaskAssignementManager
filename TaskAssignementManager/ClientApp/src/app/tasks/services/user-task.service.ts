import { Injectable, Inject, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUserTask } from '../userTasks/IUserTask';
import { Subject } from 'rxjs';
import { EventEmitter } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class UserTaskService {
  private url :string;

  constructor(private http : HttpClient, @Inject('BASE_URL') url: string) {
    this.url = `${url}api/tasks`;
  }

  // Observable IUserTask source
  private taskSource = new Subject<IUserTask>();

  // Observable IUserTask streams
  taskSelected$ = this.taskSource.asObservable();

  // Service message tasks
  sendTask(task: IUserTask) {
    this.taskSource.next(task);
  }

  getUserTask(id) {
    let url = `${this.url}/${id}`;
    return this.http.get<IUserTask>(url);
  }

  delete(id) {
    let url = `${this.url}/${id}`;
    return this.http.delete(url);
  }

  postUserTask(task) {
    return this.http.post<IUserTask>(this.url, task);
  }
}
