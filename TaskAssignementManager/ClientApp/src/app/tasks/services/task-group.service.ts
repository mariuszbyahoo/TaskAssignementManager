import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITaskGroup } from '../groups/ITaskGroup';

@Injectable({
  providedIn: 'root'
})
export class TaskGroupService {
  private url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url + 'api/groups';
  }

  getTaskGroups(): Observable<ITaskGroup[]> {
    console.log('TaskGroupService succesfully ran!');
    return this.http.get<ITaskGroup[]>(this.url);
  }
}
