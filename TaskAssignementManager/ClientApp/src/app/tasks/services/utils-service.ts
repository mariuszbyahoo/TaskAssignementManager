import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskGroupService } from './task-group.service';
import { ITaskGroup } from '../userTasks/ITaskGroup';
import { IUser } from '../userTasks/IUser';

@Injectable({providedIn: 'root'})
export class UtilsService {
    private url: string;
    constructor(private http: HttpClient, private taskGroupService: TaskGroupService,
                @Inject('BASE_URL') url: string)
    {
      this.url = `${url}api/users`;
    }

  public getUsers() {
    return this.http.get<IUser[]>(this.url);
  }

    public doesGroupExist(id){
        let outsideGroups = new Array<ITaskGroup>(0);
        this.taskGroupService.getTaskGroups().subscribe(groups => {
            outsideGroups = groups;
        }, err => console.error(err),
        () => { // check, is the ID duplicated
            for(let i = 0 ; i < outsideGroups.length; i ++){
                    if (outsideGroups[i].id === id) {
                        return true;
                    }
                }
                return false;
            }
        )
    };

    public newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
