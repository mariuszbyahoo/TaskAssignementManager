import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUserTask } from '../userTasks/IUserTask';

@Injectable({
  providedIn: 'root'
})
export class UserTaskService {
  private url :string;

  constructor(private http : HttpClient, @Inject('BASE_URL') url: string) {
    this.url = `${this.url}/api/tasks`;
  }

  getUserTask(id) {
    let url = `${this.url}/${id}`;
    return this.http.get<IUserTask>(url);
  }
}
