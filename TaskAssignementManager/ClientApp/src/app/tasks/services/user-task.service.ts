import { Injectable, Inject, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUserTask } from '../userTasks/IUserTask';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserTaskService {
  private url :string;

  constructor(private http : HttpClient, @Inject('BASE_URL') url: string) {
    this.url = `${url}api/tasks`;
  }

  private taskSource = new Subject<IUserTask>();
  taskSelected$ = this.taskSource.asObservable();
  sendTask(task: IUserTask) {
    this.taskSource.next(task);
  }

  private tasksArrSource = new Subject<IUserTask[]>();
  taskArr$ = this.tasksArrSource.asObservable();
  sendTasksArr(arr: IUserTask[]){
    this.tasksArrSource.next(arr);
  }

  getUserTask(id) {
    let url = `${this.url}/${id}`;
    return this.http.get<IUserTask>(url);
  }

  getTasksFromGroup(id) {
    let url = `${this.url}/grouped/specific?id=${id}`;
    return this.http.get<IUserTask[]>(url);
  }

  delete(id) {
    let url = `${this.url}/${id}`;
    return this.http.delete(url);
  }

  patchUserTask(task){
    return this.http.patch<IUserTask>(this.url, task);
  }

  postUserTask(task) {
    return this.http.post<IUserTask>(this.url, task);
  }
}
