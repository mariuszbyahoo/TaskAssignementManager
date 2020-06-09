import { Component, OnInit } from '@angular/core';
import {TaskGroupService } from '../services/task-group.service';
import { ITaskGroup } from './ITaskGroup';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  constructor(private taskGroupService: TaskGroupService) { }

  groups: ITaskGroup[];  

  ngOnInit() {
    this.fetchData();
  }

  fetchData(): void {
    this.taskGroupService.getTaskGroups().subscribe(g => {
      this.groups = g;
      for (let i = 0; i < g.length; i ++){
        this.groups[i] = g[i];
      }
      console.log(`Data fetched! ${this.groups}`);
    }),
      err => console.log(`An error occured: ${err}`);
  }
}
