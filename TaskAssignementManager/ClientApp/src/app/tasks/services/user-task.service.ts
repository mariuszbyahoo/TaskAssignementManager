import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUserTask } from '../userTasks/IUserTask';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserTaskService {
  private url :string;

  constructor(private http : HttpClient, @Inject('BASE_URL') url: string) {
    this.url = `${this.url}/api/tasks`;
  }

  // Observable IUserTask source
  private taskSource = new Subject<IUserTask>();

  // Observable IUserTask streams
  taskSelected$ = this.taskSource.asObservable();

  // Service message commands
  sendTask(task: IUserTask) {
    console.log(task);
    this.taskSource.next(task);
  }

  getUserTask(id) {
    let url = `${this.url}/${id}`;
    return this.http.get<IUserTask>(url);
  }
}
