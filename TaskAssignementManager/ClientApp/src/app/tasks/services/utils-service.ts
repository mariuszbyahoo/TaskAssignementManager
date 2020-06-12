import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskGroupService } from './task-group.service';
import { ITaskGroup } from '../userTasks/ITaskGroup';

@Injectable({providedIn: 'root'})
export class UtilsService {
    constructor(private http: HttpClient, private taskGroupService: TaskGroupService) { }
    
    public doesGroupExist(id){
        let outsideGroups = new Array<ITaskGroup>(0);
        this.taskGroupService.getTaskGroups().subscribe(groups => {
            outsideGroups = groups;
        }, err => console.error(err),
        () => { // check, is the ID duplicated
            for(let i = 0 ; i < outsideGroups.length; i ++){
                if(outsideGroups[i].id === id){
                    return true;
                }
            }
            return false;
        }
    )};
}