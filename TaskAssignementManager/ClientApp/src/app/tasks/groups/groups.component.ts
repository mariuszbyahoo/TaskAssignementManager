import { Component, OnInit } from '@angular/core';
import {TaskGroupService } from '../services/task-group.service';
import { ITaskGroup } from '../userTasks/ITaskGroup';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  constructor(private taskGroupService: TaskGroupService) { }

  groups: ITaskGroup[];  
  displayedColumns: string[] = ['name', 'tasks amount', 'delete'];
  ngOnInit() {
    this.fetchData();
  }

  fetchData(): void {
    this.taskGroupService.getTaskGroups().subscribe(g => {
      this.groups = g;
    }),
      err => console.log(`An error occured: ${err}`);
  }

  deleteTaskGroup(id): void {
    this.taskGroupService.deleteTaskGroup(id).subscribe(g => {
      this.fetchData();
    }),
    err => console.log(`An error occured: ${err}`);
  }
}
